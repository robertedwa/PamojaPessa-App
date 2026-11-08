var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_app = require("firebase-admin/app");
var import_firestore = require("firebase-admin/firestore");
var import_fs = __toESM(require("fs"), 1);
var firebaseConfig = {};
if (import_fs.default.existsSync("./firebase-applet-config.json")) {
  firebaseConfig = JSON.parse(import_fs.default.readFileSync("./firebase-applet-config.json", "utf8"));
}
var db = null;
try {
  const fbApp = (0, import_app.initializeApp)({
    credential: (0, import_app.applicationDefault)(),
    projectId: firebaseConfig.projectId
  });
  db = (0, import_firestore.getFirestore)(fbApp, firebaseConfig.firestoreDatabaseId || "(default)");
} catch (e) {
  console.log("Firebase Admin initialization failed or running in client mode.");
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.get("/api/v1/transactions", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database unavailable" });
      const { limit = 50, userId } = req.query;
      let queryRef = db.collection("transactions").orderBy("createdAt", "desc").limit(Number(limit));
      if (userId) {
        queryRef = db.collection("transactions").where("userId", "==", userId);
      }
      const snapshot = await queryRef.get();
      let transactions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (userId) {
        transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        transactions = transactions.slice(0, Number(limit));
      }
      res.json(transactions);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/v1/transactions/:id", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database unavailable" });
      const doc = await db.collection("transactions").doc(req.params.id).get();
      if (!doc.exists) return res.status(404).json({ error: "Transaction not found" });
      res.json({ id: doc.id, ...doc.data() });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/v1/transactions", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database unavailable" });
      const { type, amount, isPositive, provider, recipient, userId } = req.body;
      if (!type || !amount || !userId) {
        return res.status(400).json({ error: "Missing required fields (type, amount, userId)" });
      }
      const now = /* @__PURE__ */ new Date();
      const dateStr = `${now.toLocaleString("sw", { month: "short" })} ${now.getDate()}, ${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
      const newTx = {
        userId,
        type,
        amount: Number(amount),
        isPositive: Boolean(isPositive),
        provider: provider || null,
        recipient: recipient || null,
        date: dateStr,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const docRef = await db.collection("transactions").add(newTx);
      res.status(201).json({ id: docRef.id, ...newTx });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/v1/users/:id", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database unavailable" });
      const doc = await db.collection("users").doc(req.params.id).get();
      if (!doc.exists) return res.status(404).json({ error: "User not found" });
      const userData = doc.data();
      delete userData.pin;
      res.json({ id: doc.id, ...userData });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/v1/users", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database unavailable" });
      const snapshot = await db.collection("users").get();
      const users = snapshot.docs.map((doc) => {
        const data = doc.data();
        delete data.pin;
        return { id: doc.id, ...data };
      });
      res.json(users);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.delete("/api/v1/transactions/:id", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database unavailable" });
      await db.collection("transactions").doc(req.params.id).delete();
      res.json({ message: "Transaction deleted successfully" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/v1/webhook/flutterwave", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database unavailable" });
      const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
      const signature = req.headers["verif-hash"];
      if (!signature || signature !== secretHash) {
        return res.status(401).end();
      }
      const payload = req.body;
      console.log("Flutterwave Webhook received:", payload.event);
      if (payload.event === "charge.completed" && payload.data.status === "successful") {
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
    } catch (e) {
      console.error("Webhook processing error:", e);
      res.status(500).json({ error: e.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
