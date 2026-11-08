import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import crypto from "crypto";
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from "fs";

let firebaseConfig: any = {};
if (fs.existsSync('./firebase-applet-config.json')) {
  firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
}

let db: any = null;
try {
  const fbApp = initializeApp({
    credential: applicationDefault(),
    projectId: firebaseConfig.projectId
  });
  db = getFirestore(fbApp, firebaseConfig.firestoreDatabaseId || '(default)');
} catch (e) {
  console.log("Firebase Admin initialization failed or running in client mode.");
}

import { GoogleGenAI } from "@google/genai";

let geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey && fs.existsSync('./server-secrets.json')) {
  try {
    const secrets = JSON.parse(fs.readFileSync('./server-secrets.json', 'utf8'));
    geminiApiKey = secrets.GEMINI_API_KEY;
  } catch (e) {}
}

const ai = geminiApiKey
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Basic health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Dedicated APK Download Endpoint
  const handleApkDownload = (req: express.Request, res: express.Response) => {
    const candidates = [
      path.join(process.cwd(), 'public', 'PamojaPesa.apk'),
      path.join(process.cwd(), 'dist', 'PamojaPesa.apk')
    ];
    for (const apkPath of candidates) {
      if (fs.existsSync(apkPath)) {
        res.setHeader('Content-Type', 'application/vnd.android.package-archive');
        res.setHeader('Content-Disposition', 'attachment; filename="PamojaPesa.apk"');
        return res.sendFile(apkPath);
      }
    }
    res.status(404).json({ error: "APK package not found. Run scripts/create_apk.py to generate." });
  };

  app.get("/api/download/apk", handleApkDownload);
  app.get("/download/PamojaPesa.apk", handleApkDownload);
  app.get("/PamojaPesa.apk", handleApkDownload);

  // Gemini AI Financial Insights endpoint
  app.post("/api/ai/insights", async (req, res) => {
    try {
      if (!ai) {
        return res.status(503).json({
          error: "Gemini API client not initialized. Ensure GEMINI_API_KEY is configured."
        });
      }
      const { language = "en", transactions = [], balance = 0 } = req.body;
      const prompt = `You are the smart financial assistant for PamojaPesa, Tanzania's mobile money platform.
Current user balance: ${balance} TZS.
Recent transactions: ${JSON.stringify(transactions.slice(0, 5))}.
Output language: ${language === 'sw' ? 'Swahili' : 'English'}.
Provide 2 brief, actionable money tips or spending observations for a mobile money user (M-Pesa, Airtel Money, Tigo Pesa). Keep under 80 words.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      res.json({ insights: response.text });
    } catch (e: any) {
      console.error("Gemini API error:", e);
      res.status(500).json({ error: e.message || "Failed to generate AI insights" });
    }
  });

  // ========== PUBLIC REST API ENDPOINTS ==========

  // GET all transactions (with optional limits/filtering)
  app.get("/api/v1/transactions", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database unavailable" });
      
      const { limit = 50, userId } = req.query;
      let queryRef = db.collection('transactions').orderBy('createdAt', 'desc').limit(Number(limit));
      
      if (userId) {
        // NOTE: In Firestore, combining an equality filter on one field and range/orderBy on another 
        // requires a composite index. To keep it simple, we filter client-side if it errors, 
        // string queries will be exact matches.
        queryRef = db.collection('transactions').where('userId', '==', userId);
      }
      
      const snapshot = await queryRef.get();
      let transactions = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      
      if (userId) {
        // Sort in memory to avoid needing composite indexes right away
        transactions.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        transactions = transactions.slice(0, Number(limit));
      }
      
      res.json(transactions);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET a specific transaction
  app.get("/api/v1/transactions/:id", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database unavailable" });
      const doc = await db.collection('transactions').doc(req.params.id).get();
      if (!doc.exists) return res.status(404).json({ error: "Transaction not found" });
      res.json({ id: doc.id, ...doc.data() });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // POST a new transaction via API
  app.post("/api/v1/transactions", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database unavailable" });
      const { type, amount, isPositive, provider, recipient, userId } = req.body;
      
      if (!type || !amount || !userId) {
        return res.status(400).json({ error: "Missing required fields (type, amount, userId)" });
      }

      const now = new Date();
      const dateStr = `${now.toLocaleString('sw', { month: 'short' })} ${now.getDate()}, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

      const newTx = {
        userId,
        type,
        amount: Number(amount),
        isPositive: Boolean(isPositive),
        provider: provider || null,
        recipient: recipient || null,
        date: dateStr,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await db.collection('transactions').add(newTx);
      res.status(201).json({ id: docRef.id, ...newTx });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET user profile
  app.get("/api/v1/users/:id", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database unavailable" });
      const doc = await db.collection('users').doc(req.params.id).get();
      if (!doc.exists) return res.status(404).json({ error: "User not found" });
      
      const userData = doc.data();
      delete userData.pin; // Do not expose sensitive auth pin via API
      
      res.json({ id: doc.id, ...userData });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET all users
  app.get("/api/v1/users", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database unavailable" });
      const snapshot = await db.collection('users').get();
      const users = snapshot.docs.map((doc: any) => {
        const data = doc.data();
        delete data.pin;
        return { id: doc.id, ...data };
      });
      res.json(users);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // DELETE a transaction
  app.delete("/api/v1/transactions/:id", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database unavailable" });
      await db.collection('transactions').doc(req.params.id).delete();
      res.json({ message: "Transaction deleted successfully" });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // POST Flutterwave Webhook
  app.post("/api/v1/webhook/flutterwave", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
      const signature = req.headers["verif-hash"];

      if (!signature || signature !== secretHash) {
        // This request isn't from Flutterwave; discard
        return res.status(401).end();
      }

      const payload = req.body;
      console.log("Flutterwave Webhook received:", payload.event);

      if (payload.event === "charge.completed" && payload.data.status === "successful") {
        // Here we could find the transaction by tx_ref if we created it beforehand,
        // or update its status to 'verified' if it was already saved on client-side.
        // For simplicity, we just mark the verified flag.
        const txRef = payload.data.tx_ref;
        if (txRef) {
          const snapshot = await db.collection("transactions").where("tx_ref", "==", txRef).get();
          if (!snapshot.empty) {
            const docId = snapshot.docs[0].id;
            await db.collection("transactions").doc(docId).update({
              status: "verified",
              flw_id: payload.data.id
            });
            console.log(`Transaction ${txRef} verified successfully via Webhook.`);
          }
        }
      }

      res.status(200).end();
    } catch (e: any) {
      console.error("Webhook processing error:", e);
      res.status(500).json({ error: e.message });
    }
  });


  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
