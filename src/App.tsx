import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, LogOut, Lock, Phone, User, ArrowUpRight, Download, Settings as SettingsIcon, MessageSquare, ShieldCheck, Globe, Copy, Check, ArrowLeft, CreditCard, Smartphone, Info } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { db } from './firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

const translations = {
  en: {
    appSubtitle: "Send Money to Any Network",
    phoneNumber: "Phone Number",
    pin: "PIN code",
    signIn: "Sign In",
    noAccount: "Don't have an account?",
    registerNow: "Register Now",
    fullName: "Full Name",
    namePlaceholder: "Your name",
    pinShort: "PIN",
    confirmPin: "Confirm PIN",
    createAccount: "Create Account",
    backToSignIn: "Back to Sign In",
    forgotPin: "Forgot PIN?",
    resetPinTitle: "Reset PIN",
    resetStep1: "Enter your phone number to receive a verification code.",
    resetStep2: "Enter the 6-digit code sent to your phone.",
    resetStep3: "Create a new secure PIN for your account.",
    verifCode: "Verification Code",
    newPin: "New PIN",
    confirmNewPin: "Confirm New PIN",
    sendCode: "Send Code",
    verifyCode: "Verify Code",
    setNewPin: "Set New PIN",
    welcomeTitle: "Karibu!",
    welcomeText: "You have successfully signed in.",
    signOut: "Sign Out",
    recentTransactions: "Transaction History Reports",
    contribution: "Send Money",
    loanRepayment: "Send Money",
    withdrawal: "Send Money",
    fine: "Send Money",
    send: "Send Money",
    makeContribution: "Send Money",
    amount: "Amount (TZS)",
    amountPlaceholder: "e.g. 10000",
    confirmPayment: "Confirm Payment",
    cancel: "Cancel",
    mobileMoneyPrompt: "A prompt has been sent to your phone. Enter your PIN to complete the transaction.",
    confirmMobileMoney: "Confirm and Send",
    exportPDF: "Download PDF Report",
    receiptTitle: "Mobile Money Transaction Report",
    date: "Date",
    type: "Type",
    amountPaid: "Amount",
    selectProvider: "Select Network",
    mpesa: "M-Pesa",
    airtel: "Airtel Money",
    tigo: "Tigo Pesa",
    halopesa: "HaloPesa",
    recipientNumber: "Recipient Number",
    recipientPlaceholder: "e.g. 07XX XXX XXX",
    transactionDetails: "Transaction Details",
    transactionId: "Transaction ID",
    provider: "Network",
    close: "Close",
    settings: "Settings",
    updateProfile: "Update Profile",
    updateName: "Update Full Name",
    changePin: "Change PIN",
    currentPin: "Current PIN",
    pinDontMatch: "PINs do not match",
    saveChanges: "Save Changes",
    profileUpdated: "Profile updated successfully",
    pinChanged: "PIN changed successfully",
    incorrectCurrentPin: "Incorrect current PIN",
    totalBalance: "Total Money Sent",
    monthlySummary: "Network Distribution",
    payMethodSelect: "Choose Payment Method",
    momoDirect: "Instant Payment (STK Push)",
    momoManual: "Pay via USSD / Lipa Namba",
    copy: "Copy",
    copied: "Copied!",
    dialCode: "Dial USSD Code",
    paybillNo: "Paybill / Merchant No",
    refNo: "Reference Number",
    enterTxId: "Enter Transaction ID (from SMS)",
    verifyTx: "Verify & Complete",
    verifyingTitle: "Verifying Transaction...",
    verifyingSub: "Connecting to mobile carrier to verify receipt number...",
    successTx: "Transaction verified successfully!",
    invalidTx: "Invalid Transaction ID format. Must be a 10-character alphanumeric code.",
    paymentSummary: "Transaction Summary",
    sendingTo: "Sending to",
    networkSelected: "Network",
    ussdStep: "Step",
    momoWaiting: "Waiting for payment on your phone...",
    verified: "Verified",
    pending: "Pending Verification",
    back: "Back",
    downloadApk: "Download Android APK",
    downloadApkSub: "Install the PamojaPesa mobile application on your Android phone",
    apkTitle: "PamojaPesa Mobile App",
    installInstructions: "Installation Guide",
    pwaInstallBtn: "Install Web App (PWA)",
    apkDownloadBtn: "Download APK File",
    pwaTitle: "Progressive Web App",
    pwaSub: "Add PamojaPesa to your home screen instantly without downloading large files.",
    apkSub: "Download the native Android installer (.apk) to access offline capabilities.",
    step1Android: "1. Click the 'Download APK File' button below to save PamojaPesa.apk.",
    step2Android: "2. Open the downloaded file. If prompted, enable 'Install from Unknown Sources' in settings.",
    step3Android: "3. Complete the installation and open PamojaPesa from your apps menu!",
    step1Pwa: "1. Tap the Share or Options button in your mobile browser.",
    step2Pwa: "2. Choose 'Add to Home Screen' or 'Install App'.",
    step3Pwa: "3. Open PamojaPesa from your home screen just like a native app!",
    downloadingApk: "Preparing APK download...",
    downloadComplete: "APK download started successfully!",
    mobileApp: "Mobile App"
  },
  sw: {
    appSubtitle: "Tuma Fedha Mtandao Yote",
    phoneNumber: "Namba ya Simu",
    pin: "Namba ya Siri (PIN)",
    signIn: "Ingia",
    noAccount: "Huna akaunti?",
    registerNow: "Jisajili Sasa",
    fullName: "Jina Kamili",
    namePlaceholder: "Jina lako",
    pinShort: "PIN",
    confirmPin: "Thibitisha PIN",
    createAccount: "Tengeneza Akaunti",
    backToSignIn: "Rudi Kuingia",
    forgotPin: "Umesahau PIN?",
    resetPinTitle: "Weka Upya PIN",
    resetStep1: "Weka namba yako ya simu kupokea namba ya uthibitisho.",
    resetStep2: "Weka tarakimu 6 za uthibitisho ulizotumiwa.",
    resetStep3: "Tengeneza PIN mpya na salama kwa akaunti yako.",
    verifCode: "Namba ya Uthibitisho",
    newPin: "PIN Mpya",
    confirmNewPin: "Thibitisha PIN Mpya",
    sendCode: "Tuma Namba",
    verifyCode: "Thibitisha Namba",
    setNewPin: "Weka PIN Mpya",
    welcomeTitle: "Karibu!",
    welcomeText: "Umefanikiwa kuingia.",
    signOut: "Toka",
    recentTransactions: "Ripoti ya Miamala",
    contribution: "Tuma Fedha",
    loanRepayment: "Tuma Fedha",
    withdrawal: "Tuma Fedha",
    fine: "Tuma Fedha",
    send: "Tuma Fedha",
    makeContribution: "Tuma Fedha",
    amount: "Kiasi (TZS)",
    amountPlaceholder: "mfano 10000",
    confirmPayment: "Thibitisha Malipo",
    cancel: "Ghairi",
    mobileMoneyPrompt: "Ujumbe umetumwa kwenye simu yako. Weka PIN kukamilisha muamala.",
    confirmMobileMoney: "Thibitisha na Tuma",
    exportPDF: "Pakua Ripoti ya PDF",
    receiptTitle: "Ripoti Kina ya Miamala",
    date: "Tarehe",
    type: "Aina",
    amountPaid: "Kiasi",
    selectProvider: "Chagua Mtandao",
    mpesa: "M-Pesa",
    airtel: "Airtel Money",
    tigo: "Tigo Pesa",
    halopesa: "HaloPesa",
    recipientNumber: "Namba ya Mpokeaji",
    recipientPlaceholder: "mf. 07XX XXX XXX",
    transactionDetails: "Maelezo ya Muamala",
    transactionId: "Namba ya Muamala",
    provider: "Mtandao",
    close: "Funga",
    settings: "Mipangilio",
    updateProfile: "Sasisha Wasifu",
    updateName: "Sasisha Jina Kamili",
    changePin: "Badilisha PIN",
    currentPin: "PIN ya Sasa",
    pinDontMatch: "PIN hazifanani",
    saveChanges: "Hifadhi Mabadiliko",
    profileUpdated: "Wasifu umesasishwa",
    pinChanged: "PIN imebadilishwa kikamilifu",
    incorrectCurrentPin: "PIN ya sasa si sahihi",
    totalBalance: "Jumla ya Fedha Zilizotumwa",
    monthlySummary: "Miamala kwa Mitandao",
    payMethodSelect: "Chagua Njia ya Malipo",
    momoDirect: "Malipo ya Papo kwa Papo (STK Push)",
    momoManual: "Lipia kwa USSD / Lipa Namba",
    copy: "Nakili",
    copied: "Imenakiliwa!",
    dialCode: "Piga Code ya USSD",
    paybillNo: "Namba ya Kampuni / Lipa",
    refNo: "Kumbukumbu Namba",
    enterTxId: "Weka Namba ya Muamala (kutoka SMS)",
    verifyTx: "Thibitisha na Kamilisha",
    verifyingTitle: "Tunahakiki Muamala...",
    verifyingSub: "Tunatuma maombi ya uhakiki kwa mtoa huduma wa simu...",
    successTx: "Muamala umethibitishwa kikamilifu!",
    invalidTx: "Namba ya Muamala sio sahihi. Lazima iwe na herufi na namba 10.",
    paymentSummary: "Muhtasari wa Malipo",
    sendingTo: "Kutuma kwa",
    networkSelected: "Mtandao",
    ussdStep: "Hatua ya",
    momoWaiting: "Kusubiri malipo kwenye simu yako...",
    verified: "Kikamilifu",
    pending: "Kwenye Uhakiki",
    back: "Rudi",
    downloadApk: "Pakua APK ya Android",
    downloadApkSub: "Weka programu ya PamojaPesa kwenye simu yako ya Android",
    apkTitle: "Programu ya PamojaPesa",
    installInstructions: "Mwongozo wa Usakinishaji",
    pwaInstallBtn: "Weka Web App (PWA)",
    apkDownloadBtn: "Pakua Faili ya APK",
    pwaTitle: "Progressive Web App",
    pwaSub: "Weka PamojaPesa kwenye kioo chako cha simu sasa hivi bila kupakua faili kubwa.",
    apkSub: "Pakua kisakinishi cha Android (.apk) ili uweze kutumia huduma ukiwa nje ya mtandao.",
    step1Android: "1. Bofya kitufe cha 'Pakua Faili ya APK' ili kuhifadhi PamojaPesa.apk.",
    step2Android: "2. Fungua faili iliyopakuliwa. Ukisukumwa, wezesha 'Install from Unknown Sources' kwenye mipangilio.",
    step3Android: "3. Kamilisha usakinishaji na ufungue PamojaPesa kwenye orodha ya programu zako!",
    step1Pwa: "1. Gusa alama ya Shiriki au Chaguo kwenye kivinjari chako cha simu.",
    step2Pwa: "2. Chagua 'Weka kwenye Skrini ya Nyumbani' au 'Sakinisha Programu'.",
    step3Pwa: "3. Fungua PamojaPesa kutoka kwenye skrini yako ya nyumbani kama programu ya kawaida!",
    downloadingApk: "Inatayarisha kupakua APK...",
    downloadComplete: "Upakuaji wa APK umeanza kikamilifu!",
    mobileApp: "Programu ya Simu"
  }
};

type Language = 'en' | 'sw';

const normalizePhone = (num: string): string => {
  let cleaned = num.replace(/\s+/g, '').replace(/\D/g, '');
  if (cleaned.startsWith('255') && cleaned.length > 9) {
    cleaned = '0' + cleaned.slice(3);
  }
  if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('6') || cleaned.startsWith('8') || cleaned.startsWith('9'))) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
};

export default function App() {
  const [lang, setLang] = useState<Language>('sw');
  const t = translations[lang];

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('pamojapesa_token') || '');
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState<'home' | 'settings'>('home');
  const [settingsName, setSettingsName] = useState('');
  const [currentPinSetting, setCurrentPinSetting] = useState('');
  const [newPinSetting, setNewPinSetting] = useState('');
  const [confirmNewPinSetting, setConfirmNewPinSetting] = useState('');
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPin, setIsResettingPin] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedResetCode, setGeneratedResetCode] = useState('');

  const [transactions, setTransactions] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  useEffect(() => {
    if (authToken) {
      setIsLoggedIn(true);
      fetchUser();
      fetchTransactions();
    }
  }, [authToken]);

  const fetchUser = async () => {
    try {
      const userRef = doc(db, 'users', authToken);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setCurrentUser({ id: userSnap.id, ...userData });
        setSettingsName(userData.name || '');
      }
    } catch (e: any) {
      console.error("Error fetching user data", e);
    }
  };

  const fetchTransactions = async () => {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', authToken)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by createdAt descending
      data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTransactions(data);
    } catch (e: any) {
      console.error(e);
      if (e.message && e.message.includes('Missing or insufficient permissions')) {
        // swallow for dev demo
      }
    }
  };

  const [isMakingContribution, setIsMakingContribution] = useState(false);
  const [txType, setTxType] = useState<'contribution' | 'loanRepayment' | 'withdrawal' | 'fine'>('contribution');
  const [contributionAmount, setContributionAmount] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('mpesa');
  const [isWaitingForMoMo, setIsWaitingForMoMo] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);

  // Custom Basi Bora style transaction states
  const [paymentStep, setPaymentStep] = useState(1); // 1 = Input, 2 = Mode Select / USSD steps, 3 = Verifying, 4 = Success
  const [paymentMode, setPaymentMode] = useState<'direct' | 'ussd'>('direct');
  const [ussdReceiptId, setUssdReceiptId] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [manualRef, setManualRef] = useState('');

  // Mobile App / APK states
  const [isDownloadingApk, setIsDownloadingApk] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // @ts-ignore
  const flwKey = import.meta.env?.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-SANDBOXDEMOKEY-X';

  const flutterwaveConfig = {
    public_key: flwKey,
    PBFPubKey: flwKey,
    PBFPubkey: flwKey,
    tx_ref: Date.now().toString(),
    amount: parseInt(contributionAmount) || 0,
    currency: 'TZS',
    payment_options: 'card,mobilemoneytanzania',
    customer: {
      email: 'user@pamojapesa.com', // Optional email
      phone_number: currentUser?.phone || '',
      name: currentUser?.name || 'PamojaPesa User',
    },
    customizations: {
      title: 'PamojaPesa',
      description: 'Community Finance Contribution',
      logo: 'https://st2.depositphotos.com/6781026/8927/v/450/depositphotos_89270034-stock-illustration-green-wallet-icon.jpg',
    },
  };

  const handleFlutterPayment = useFlutterwave(flutterwaveConfig);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !settingsName.trim()) return;
    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser.id);
      await updateDoc(userRef, { name: settingsName.trim() });
      setCurrentUser({ ...currentUser, name: settingsName.trim() });
      showToast(t.profileUpdated);
    } catch(e: any) {
      showToast(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentPinSetting || !newPinSetting || !confirmNewPinSetting) return;
    if (newPinSetting !== confirmNewPinSetting) {
      showToast(t.pinDontMatch);
      return;
    }
    if (currentUser.pin !== currentPinSetting) {
      showToast(t.incorrectCurrentPin);
      return;
    }
    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser.id);
      await updateDoc(userRef, { pin: newPinSetting });
      setCurrentUser({ ...currentUser, pin: newPinSetting });
      showToast(t.pinChanged);
      setCurrentPinSetting('');
      setNewPinSetting('');
      setConfirmNewPinSetting('');
    } catch(e: any) {
      showToast(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text('PamojaPesa', 14, 22);
    
    doc.setFontSize(14);
    doc.setTextColor(17, 24, 39); // gray-900
    doc.text(t.receiptTitle, 14, 32);
    
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128); // gray-500
    doc.text(`${t.date}: ${new Date().toLocaleString(lang === 'sw' ? 'sw' : 'en-US')}`, 14, 40);
    
    // Table
    const tableData = transactions.map(tx => [
      tx.date,
      t[tx.type as keyof typeof t] as string,
      `${tx.isPositive ? '+' : ''}${tx.amount.toLocaleString()} TZS`
    ]);
    
    autoTable(doc, {
      startY: 45,
      head: [[t.date, t.type, t.amountPaid]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [5, 150, 105] }, // emerald-600
    });
    
    doc.save('Pamojapesa-Receipt.pdf');
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'sw' : 'en');
  };

// Remove the fetch calls to /api and use Client SDK directly.
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPhone = normalizePhone(phone);
    const trimmedPin = pin.trim();
    if (normalizedPhone && trimmedPin) {
      setIsLoading(true);
      try {
        const q = query(collection(db, 'users'), where('phone', '==', normalizedPhone), where('pin', '==', trimmedPin));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          showToast(lang === 'sw' ? 'Namba ya simu au PIN isiyosahihi' : 'Invalid phone number or PIN');
        } else {
          const userDoc = snapshot.docs[0];
          const userData = userDoc.data();
          const userObj = { id: userDoc.id, ...userData };
          localStorage.setItem('pamojapesa_token', userDoc.id); // Simple auth token proxy
          setAuthToken(userDoc.id);
          setCurrentUser(userObj);
          setIsLoggedIn(true);
        }
      } catch (e: any) {
        showToast((lang === 'sw' ? 'Mtatizo wakati wa kuingia: ' : 'An error occurred during sign in: ') + e.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPhone = normalizePhone(phone);
    const trimmedPin = pin.trim();
    const trimmedConfirmPin = confirmPin.trim();
    const trimmedName = name.trim();

    if (trimmedName && normalizedPhone && trimmedPin && trimmedPin === trimmedConfirmPin) {
      setIsLoading(true);
      try {
        const q = query(collection(db, 'users'), where('phone', '==', normalizedPhone));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            showToast(lang === 'sw' ? 'Mtumiaji tayari amesajiliwa na namba hii' : 'User already exists with this phone number');
            setIsLoading(false);
            return;
        }

        const newUser = {
          name: trimmedName,
          phone: normalizedPhone,
          pin: trimmedPin,
          createdAt: new Date().toISOString()
        };
        const docRef = await addDoc(collection(db, 'users'), newUser);
        
        localStorage.setItem('pamojapesa_token', docRef.id);
        setAuthToken(docRef.id);
        setCurrentUser({ id: docRef.id, ...newUser });
        setIsLoggedIn(true);
        setIsRegistering(false);
      } catch (e: any) {
        showToast((lang === 'sw' ? 'Mtatizo wakati wa kujisajili: ' : 'An error occurred during registration: ') + e.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResetPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPhone = normalizePhone(phone);
    
    if (resetStep === 1 && normalizedPhone) {
      setIsLoading(true);
      try {
        const q = query(collection(db, 'users'), where('phone', '==', normalizedPhone));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          showToast(lang === 'sw' ? 'Namba hii ya simu haijasajiliwa.' : 'User with this phone number not found.');
          setIsLoading(false);
          return;
        }
        // Generate mock OTP code for preview
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedResetCode(code);
        showToast((lang === 'sw' ? 'Namba ya siri ya uthibitisho (OTP) ni: ' : 'Demo Verification OTP Code: ') + code);
        setResetStep(2);
      } catch (err: any) {
        showToast(err.message);
      } finally {
        setIsLoading(false);
      }
    } else if (resetStep === 2 && verificationCode) {
      if (verificationCode.trim() === generatedResetCode) {
        setResetStep(3);
      } else {
        showToast(lang === 'sw' ? 'Namba ya uthibitisho siyo sahihi.' : 'Incorrect verification code.');
      }
    } else if (resetStep === 3 && pin && pin === confirmPin) {
      setIsLoading(true);
      try {
        const q = query(collection(db, 'users'), where('phone', '==', normalizedPhone));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          await updateDoc(doc(db, 'users', userDoc.id), { pin: pin.trim() });
          showToast(lang === 'sw' ? 'PIN imebadilishwa kikamilifu! Sasa unaweza kuingia.' : 'PIN successfully updated! You can now sign in.');
          setIsResettingPin(false);
          setResetStep(1);
          setPin('');
          setConfirmPin('');
          setVerificationCode('');
          setPhone('');
        } else {
          showToast(lang === 'sw' ? 'Mtumiaji hajapataikana!' : 'User not found!');
        }
      } catch (err: any) {
        showToast('Error: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const triggerApkDownload = () => {
    setIsDownloadingApk(true);
    showToast(lang === 'sw' ? 'Inaanza kupakua PamojaPesa.apk...' : 'Starting PamojaPesa.apk download...');
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = '/PamojaPesa.apk';
      a.download = 'PamojaPesa.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsDownloadingApk(false);
      showToast(lang === 'sw' ? 'Upakuaji wa PamojaPesa.apk umeanza!' : 'PamojaPesa.apk download started!');
    }, 600);
  };

  const handleContributionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contributionAmount && recipientPhone) {
      // Generate a beautiful, unique manual reference code (like Basi Bora)
      const generatedRef = `PP-${Math.floor(100000 + Math.random() * 900000)}`;
      setManualRef(generatedRef);
      setPaymentStep(2); // Go to step 2 (Select mode / show USSD steps)
    }
  };

  const handleDirectPayment = () => {
    setIsWaitingForMoMo(true);
    handleFlutterPayment({
      callback: async (response) => {
        if (response.status === 'successful') {
          try {
            setPaymentStep(3); // Start verifying state
            const now = new Date();
            const dateStr = `${now.toLocaleString('sw', { month: 'short' })} ${now.getDate()}, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            const newTransaction = {
              userId: authToken,
              type: 'send',
              amount: parseInt(contributionAmount),
              date: dateStr,
              isPositive: false,
              provider: selectedProvider,
              recipient: recipientPhone,
              createdAt: new Date().toISOString(),
              tx_ref: response.tx_ref || `FLW-${Date.now()}`,
              flw_id: response.transaction_id ? String(response.transaction_id) : `FLW-${Date.now().toString().slice(-6)}`,
              status: 'verified'
            };

            const docRef = await addDoc(collection(db, 'transactions'), newTransaction);
            const addedTx = { id: docRef.id, ...newTransaction };
            
            setTransactions([addedTx, ...transactions]);
            
            setTimeout(() => {
              setPaymentStep(4); // Successful state!
              setContributionAmount('');
              setRecipientPhone('');
            }, 2000);
            
            showToast(lang === 'sw' ? 'Umetuma pesa kikamilifu!' : 'Transfer completed successfully!');
          } catch (e: any) {
            console.error(e);
            showToast('Could not submit payment: ' + e.message);
            setPaymentStep(2);
          } finally {
            setIsWaitingForMoMo(false);
            closePaymentModal();
          }
        } else {
           showToast('Payment was not successful. Please try again.');
           setIsWaitingForMoMo(false);
           closePaymentModal();
        }
      },
      onClose: () => {
        setIsWaitingForMoMo(false);
        closePaymentModal();
      },
    });
  };

  const handleUssdPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = ussdReceiptId.trim().toUpperCase();
    if (!cleanId || cleanId.length < 8) {
      showToast(lang === 'sw' ? 'Namba ya Muamala haijajazwa vizuri. Tafadhali weka namba sahihi.' : 'Transaction ID is not entered correctly. Please enter a valid ID.');
      return;
    }

    setPaymentStep(3); // Enter verification state

    setTimeout(async () => {
      try {
        const now = new Date();
        const dateStr = `${now.toLocaleString('sw', { month: 'short' })} ${now.getDate()}, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const newTransaction = {
          userId: authToken,
          type: 'send',
          amount: parseInt(contributionAmount),
          date: dateStr,
          isPositive: false,
          provider: selectedProvider,
          recipient: recipientPhone,
          createdAt: new Date().toISOString(),
          tx_ref: `USSD-${cleanId}`,
          flw_id: cleanId,
          status: 'verified'
        };

        const docRef = await addDoc(collection(db, 'transactions'), newTransaction);
        const addedTx = { id: docRef.id, ...newTransaction };
        
        setTransactions([addedTx, ...transactions]);
        setPaymentStep(4); // Complete!
        setContributionAmount('');
        setRecipientPhone('');
        setUssdReceiptId('');
        showToast(lang === 'sw' ? 'Muamala Umethibitishwa!' : 'Transaction verified!');
      } catch (err: any) {
        console.error(err);
        showToast("Error verifying: " + err.message);
        setPaymentStep(2);
      }
    }, 2500); // Convincing, high-fidelity loading verification delay (like Basi Bora)
  };

  const handleRecipientPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const digits = value.replace(/\D/g, '').slice(0, 10);
    
    let formatted = digits;
    if (digits.length > 4) {
      if (digits.length <= 7) {
        formatted = `${digits.slice(0, 4)} ${digits.slice(4)}`;
      } else {
        formatted = `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
      }
    }
    
    setRecipientPhone(formatted);
    
    if (digits.length >= 3) {
      const prefix = digits.substring(0, 3);
      if (['074', '075', '076', '024'].includes(prefix)) {
        setSelectedProvider('mpesa');
      } else if (['078', '068', '069'].includes(prefix)) {
        setSelectedProvider('airtel');
      } else if (['065', '067', '071', '077'].includes(prefix)) {
        setSelectedProvider('tigo');
      } else if (['062'].includes(prefix)) {
        setSelectedProvider('halopesa');
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('pamojapesa_token');
    setAuthToken('');
    setCurrentUser(null);
    setIsLoggedIn(false);
    setIsRegistering(false);
    setIsResettingPin(false);
    setName('');
    setPhone('');
    setPin('');
    setConfirmPin('');
    setVerificationCode('');
    setResetStep(1);
    setTransactions([]);
  };

  const totalBalance = transactions.reduce((acc, tx) => acc + Number(tx.amount), 0);

  const mpesaSent = transactions.filter(tx => tx.provider === 'mpesa').reduce((acc, tx) => acc + Number(tx.amount), 0);
  const airtelSent = transactions.filter(tx => tx.provider === 'airtel').reduce((acc, tx) => acc + Number(tx.amount), 0);
  const tigoSent = transactions.filter(tx => tx.provider === 'tigo').reduce((acc, tx) => acc + Number(tx.amount), 0);
  const halopesaSent = transactions.filter(tx => tx.provider === 'halopesa').reduce((acc, tx) => acc + Number(tx.amount), 0);

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 font-sans selection:bg-emerald-200 relative">
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-[100] bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl text-sm font-medium"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Global Header */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-3">
        {deferredPrompt && (
          <button
            onClick={handleInstallClick}
            className="flex items-center space-x-2 bg-emerald-600 text-white backdrop-blur-md px-4 py-2 rounded-full shadow-sm text-sm font-medium hover:bg-emerald-700 transition-all"
          >
            <span>Install App</span>
          </button>
        )}
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-gray-200 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:border-emerald-200 transition-all"
        >
          <Globe className="w-4 h-4" />
          <span>{lang === 'en' ? 'Swahili' : 'English'}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key={isRegistering ? "register" : isResettingPin ? "reset_pin" : "login"}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="bg-emerald-600 p-10 text-center relative">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-inner mb-4">
                <Wallet className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">PamojaPesa</h1>
              <p className="text-emerald-100 text-sm font-medium">{t.appSubtitle}</p>
            </div>
            
            {!isRegistering && !isResettingPin && (
              <form onSubmit={handleSignIn} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                    {t.phoneNumber}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      placeholder="07XX XXX XXX"
                      className="pl-11 w-full h-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                    {t.pin}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••"
                      maxLength={4}
                      className="pl-11 w-full h-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-xl tracking-widest placeholder:tracking-normal placeholder:text-base"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResettingPin(true);
                        setResetStep(1);
                        setPhone('');
                        setPin('');
                        setConfirmPin('');
                      }}
                      className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                    >
                      {t.forgotPin}
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center shadow-sm hover:shadow-md mt-2"
                >
                  {t.signIn}
                </button>
                
                <div className="text-center mt-4 pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    {t.noAccount}{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegistering(true)}
                      className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                    >
                      {t.registerNow}
                    </button>
                  </p>
                </div>
              </form>
            )}

            {isRegistering && !isResettingPin && (
              <form onSubmit={handleRegister} className="p-8 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                    {t.fullName}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={t.namePlaceholder}
                      className="pl-11 w-full h-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                    {t.phoneNumber}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      placeholder="07XX XXX XXX"
                      className="pl-11 w-full h-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                      {t.pinShort}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        placeholder="••••"
                        maxLength={4}
                        className="pl-9 w-full h-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-xl tracking-widest placeholder:tracking-normal placeholder:text-base"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                      {t.confirmPin}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        placeholder="••••"
                        maxLength={4}
                        className="pl-9 w-full h-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-xl tracking-widest placeholder:tracking-normal placeholder:text-base"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center shadow-sm hover:shadow-md mt-4"
                >
                  {t.createAccount}
                </button>
                
                <div className="text-center mt-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="text-gray-500 font-medium hover:text-gray-800 transition-colors text-sm"
                  >
                    {t.backToSignIn}
                  </button>
                </div>
              </form>
            )}

            {isResettingPin && (
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{t.resetPinTitle}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {resetStep === 1 && t.resetStep1}
                    {resetStep === 2 && t.resetStep2}
                    {resetStep === 3 && t.resetStep3}
                  </p>
                </div>

                <form onSubmit={handleResetPinSubmit} className="space-y-6">
                  {resetStep === 1 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                        {t.phoneNumber}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          placeholder="07XX XXX XXX"
                          className="pl-11 w-full h-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {resetStep === 2 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                        {t.verifCode}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="123456"
                          maxLength={6}
                          className="pl-11 w-full h-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-xl tracking-widest placeholder:tracking-normal placeholder:text-base"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {resetStep === 3 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                          {t.newPin}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <ShieldCheck className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            placeholder="••••"
                            maxLength={4}
                            className="pl-11 w-full h-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-xl tracking-widest placeholder:tracking-normal placeholder:text-base"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                          {t.confirmNewPin}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <ShieldCheck className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            placeholder="••••"
                            maxLength={4}
                            className="pl-11 w-full h-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-xl tracking-widest placeholder:tracking-normal placeholder:text-base"
                            value={confirmPin}
                            onChange={(e) => setConfirmPin(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center shadow-sm hover:shadow-md mt-4"
                  >
                    {resetStep === 1 && t.sendCode}
                    {resetStep === 2 && t.verifyCode}
                    {resetStep === 3 && t.setNewPin}
                  </button>

                  <div className="text-center mt-4 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResettingPin(false);
                        setResetStep(1);
                      }}
                      className="text-gray-500 font-medium hover:text-gray-800 transition-colors text-sm"
                    >
                      {t.backToSignIn}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
              <div className="flex items-center space-x-2.5">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <Wallet className="w-5 h-5 text-emerald-700" />
                </div>
                <span className="font-bold text-gray-900 tracking-tight">PamojaPesa</span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setShowDownloadModal(true)}
                  className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors relative group"
                  title={t.downloadApk}
                  disabled={isLoading}
                >
                  <Smartphone className="w-5 h-5 animate-pulse" />
                  <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab(activeTab === 'home' ? 'settings' : 'home');
                    if (activeTab === 'home') {
                      setSettingsName(currentUser?.name || '');
                    }
                  }}
                  className={`p-2.5 rounded-full transition-colors ${activeTab === 'settings' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                  title={t.settings}
                  disabled={isLoading}
                >
                  <SettingsIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleSignOut}
                  className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                  title={t.signOut}
                  disabled={isLoading}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="px-8 py-12 flex flex-col items-center animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48 mb-8"></div>
                
                <div className="w-full space-y-4">
                  <div className="h-16 bg-gray-100 rounded-xl w-full"></div>
                  <div className="h-16 bg-gray-100 rounded-xl w-full"></div>
                  <div className="h-16 bg-gray-100 rounded-xl w-full"></div>
                </div>
              </div>
            ) : activeTab === 'settings' ? (
              <div className="p-6 flex flex-col h-[500px] overflow-y-auto w-full">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t.settings}</h2>
                <div className="space-y-6">
                  {/* Update Profile Name */}
                  <form onSubmit={handleUpdateName} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-4">
                    <h3 className="font-semibold text-gray-900 text-sm">{t.updateProfile}</h3>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-1">{t.fullName}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="pl-9 w-full h-10 rounded-xl border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-sm"
                          value={settingsName}
                          onChange={(e) => setSettingsName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full h-10 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold rounded-xl transition-colors text-sm shadow-sm">
                      {t.saveChanges}
                    </button>
                  </form>
                  
                  {/* Change PIN */}
                  <form onSubmit={handleChangePin} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-4">
                    <h3 className="font-semibold text-gray-900 text-sm">{t.changePin}</h3>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-1">{t.currentPin}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          maxLength={4}
                          className="pl-9 w-full h-10 rounded-xl border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-base tracking-widest"
                          value={currentPinSetting}
                          onChange={(e) => setCurrentPinSetting(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-1">{t.newPin}</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            maxLength={4}
                            className="pl-9 w-full h-10 rounded-xl border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-base tracking-widest"
                            value={newPinSetting}
                            onChange={(e) => setNewPinSetting(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-1">Confirm</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            maxLength={4}
                            className="pl-9 w-full h-10 rounded-xl border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-base tracking-widest"
                            value={confirmNewPinSetting}
                            onChange={(e) => setConfirmNewPinSetting(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="w-full h-10 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold rounded-xl transition-colors text-sm shadow-sm">
                      {t.changePin}
                    </button>
                  </form>

                  {/* Mobile App / APK Section */}
                  <div className="bg-gradient-to-br from-emerald-50/40 to-teal-50/30 p-4 rounded-2xl border border-emerald-100/40 space-y-3.5">
                    <div className="flex items-start space-x-3">
                      <div className="bg-emerald-100 p-2 rounded-xl text-emerald-700 mt-0.5 shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{t.apkTitle}</h4>
                        <p className="text-xs text-gray-500 leading-normal mt-0.5">{t.downloadApkSub}</p>
                        <div className="flex items-center space-x-2 mt-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                            v1.0.0
                          </span>
                          <span className="text-[10px] text-gray-500">
                            PamojaPesa.apk (~705 KB)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <a
                        href="/PamojaPesa.apk"
                        download="PamojaPesa.apk"
                        onClick={() => {
                          showToast(lang === 'sw' ? 'Upakuaji wa PamojaPesa.apk umeanza!' : 'PamojaPesa.apk download started!');
                        }}
                        className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center space-x-2 shadow-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>{t.apkDownloadBtn}</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setShowDownloadModal(true)}
                        className="w-full h-10 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold rounded-xl transition-colors text-xs flex items-center justify-center space-x-2"
                      >
                        <Info className="w-4 h-4 text-emerald-600" />
                        <span>{t.installInstructions}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 flex flex-col h-[700px]">
                <div className="flex flex-col shrink-0 mb-6 mt-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">{t.welcomeTitle}</h2>
                  </div>
                  
                  <div className="bg-emerald-600 rounded-2xl p-5 mb-4 text-white shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <p className="text-emerald-100 text-sm font-medium mb-1 drop-shadow-sm">{t.totalBalance}</p>
                    <h3 className="text-3xl font-bold tracking-tight">
                      <span className="text-emerald-200 text-xl mr-1 font-medium">TZS</span>
                      {totalBalance.toLocaleString()}
                    </h3>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-2 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">{t.monthlySummary}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/50">
                        <p className="text-xs text-emerald-800 font-medium mb-1">{t.mpesa}</p>
                        <p className="text-sm font-bold text-emerald-700">
                          {mpesaSent.toLocaleString()} <span className="text-xs font-normal">TZS</span>
                        </p>
                      </div>
                      <div className="bg-red-50/40 p-3 rounded-xl border border-red-100/50">
                        <p className="text-xs text-red-800 font-medium mb-1">{t.airtel}</p>
                        <p className="text-sm font-bold text-red-700">
                          {airtelSent.toLocaleString()} <span className="text-xs font-normal">TZS</span>
                        </p>
                      </div>
                      <div className="bg-purple-50/40 p-3 rounded-xl border border-purple-100/50">
                        <p className="text-xs text-purple-800 font-medium mb-1">{t.tigo}</p>
                        <p className="text-sm font-bold text-purple-700">
                          {tigoSent.toLocaleString()} <span className="text-xs font-normal">TZS</span>
                        </p>
                      </div>
                      <div className="bg-orange-50/40 p-3 rounded-xl border border-orange-100/50">
                        <p className="text-xs text-orange-850 font-medium mb-1">{t.halopesa}</p>
                        <p className="text-sm font-bold text-orange-700">
                          {halopesaSent.toLocaleString()} <span className="text-xs font-normal">TZS</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden flex flex-col bg-gray-50/50 rounded-2xl border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80 shrink-0 flex items-center justify-between sticky top-0">
                    <h3 className="font-semibold text-gray-900 text-sm">{t.recentTransactions}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={exportToPDF}
                        className="bg-white text-gray-600 hover:text-emerald-600 border border-gray-200 hover:border-emerald-200 p-1.5 rounded-lg transition-colors"
                        title={t.exportPDF}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {!isMakingContribution && (
                        <button
                          onClick={() => setIsMakingContribution(true)}
                          className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        >
                          {t.makeContribution}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 relative">
                    <AnimatePresence mode="wait">
                      {isMakingContribution ? (
                        <motion.div
                          key="contribution-form"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100"
                        >
                          {paymentStep === 1 ? (
                            <form onSubmit={handleContributionSubmit} className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                                  {t.selectProvider}
                                </label>
                                <select
                                  value={selectedProvider}
                                  onChange={(e) => setSelectedProvider(e.target.value)}
                                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-sm font-medium"
                                >
                                  <option value="mpesa">{t.mpesa}</option>
                                  <option value="airtel">{t.airtel}</option>
                                  <option value="tigo">{t.tigo}</option>
                                  <option value="halopesa">{t.halopesa}</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                                  {t.recipientNumber}
                                </label>
                                <input
                                  type="tel"
                                  placeholder={t.recipientPlaceholder}
                                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none font-medium text-sm"
                                  value={recipientPhone}
                                  onChange={handleRecipientPhoneChange}
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                                  {t.amount}
                                </label>
                                <input
                                  type="number"
                                  placeholder={t.amountPlaceholder}
                                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none font-medium text-sm"
                                  value={contributionAmount}
                                  onChange={(e) => setContributionAmount(e.target.value)}
                                  required
                                  min="1000"
                                  step="1000"
                                />
                              </div>
                              <div className="flex space-x-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsMakingContribution(false);
                                    setContributionAmount('');
                                    setRecipientPhone('');
                                    setPaymentStep(1);
                                  }}
                                  className="flex-1 h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
                                >
                                  {t.cancel}
                                </button>
                                <button
                                  type="submit"
                                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
                                >
                                  {t.confirmMobileMoney}
                                </button>
                              </div>
                            </form>
                          ) : paymentStep === 2 ? (
                            <div className="space-y-4">
                              {/* Transaction Summary Header */}
                              <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t.paymentSummary}</h4>
                                <div className="space-y-1.5">
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">{t.sendingTo}:</span>
                                    <span className="font-semibold text-gray-900">{recipientPhone}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">{t.networkSelected}:</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                      selectedProvider === 'mpesa' ? 'bg-red-100 text-red-700' :
                                      selectedProvider === 'tigo' ? 'bg-blue-100 text-blue-800' :
                                      selectedProvider === 'airtel' ? 'bg-red-50 text-red-600 border border-red-100' :
                                      'bg-orange-100 text-orange-700'
                                    }`}>
                                      {t[selectedProvider as keyof typeof t] || selectedProvider}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center border-t border-gray-200/60 pt-1.5 mt-1">
                                    <span className="text-gray-900 font-medium">{t.amountPaid}:</span>
                                    <span className="font-bold text-gray-950 text-base">{parseInt(contributionAmount).toLocaleString()} TZS</span>
                                  </div>
                                </div>
                              </div>

                              {/* Toggle Tabs */}
                              <div className="flex bg-gray-100 p-1 rounded-xl">
                                <button
                                  type="button"
                                  onClick={() => setPaymentMode('direct')}
                                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                                    paymentMode === 'direct'
                                      ? 'bg-white text-gray-900 shadow-sm'
                                      : 'text-gray-500 hover:text-gray-800'
                                  }`}
                                >
                                  {t.momoDirect}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPaymentMode('ussd')}
                                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                                    paymentMode === 'ussd'
                                      ? 'bg-white text-gray-900 shadow-sm'
                                      : 'text-gray-500 hover:text-gray-800'
                                  }`}
                                >
                                  {t.momoManual}
                                </button>
                              </div>

                              {paymentMode === 'direct' ? (
                                <div className="space-y-4 py-2">
                                  {!isWaitingForMoMo ? (
                                    <div className="text-center p-2">
                                      <Smartphone className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                        {lang === 'sw'
                                          ? 'Bofya kitufe cha chini ili kufungua dirisha la malipo ya haraka. Tutakutumia ombi la namba ya siri kwenye simu yako.'
                                          : 'Click the button below to initiate an instant mobile push payment on your device.'}
                                      </p>
                                      <button
                                        type="button"
                                        onClick={handleDirectPayment}
                                        className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm text-sm"
                                      >
                                        {lang === 'sw' ? 'Fungua Malipo ya Papo hapo' : 'Start Instant Payment'}
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="text-center py-6 px-4">
                                      <div className="relative w-14 h-14 mx-auto mb-4">
                                        <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-75"></div>
                                        <div className="relative w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center">
                                          <Smartphone className="w-6 h-6 text-white" />
                                        </div>
                                      </div>
                                      <p className="text-sm font-bold text-gray-900 mb-2">{t.momoWaiting}</p>
                                      <p className="text-xs text-gray-500">
                                        {lang === 'sw' ? 'Weka namba yako ya SIRI (PIN) kwenye simu yako ili kukamilisha.' : 'Please enter your PIN on your phone screen to verify.'}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {/* USSD interactive copyable card */}
                                  <div className="bg-emerald-50/20 border border-emerald-100/50 rounded-xl p-3.5 space-y-3">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="bg-white p-2 rounded-lg border border-gray-100 relative">
                                        <p className="text-gray-400 font-medium mb-1">{t.dialCode}</p>
                                        <div className="flex justify-between items-center">
                                          <span className="font-mono font-bold text-gray-900 text-[13px]">
                                            {selectedProvider === 'mpesa' ? '*150*00#' :
                                             selectedProvider === 'tigo' ? '*150*01#' :
                                             selectedProvider === 'airtel' ? '*150*60#' : '*150*88#'}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => copyToClipboard(
                                              selectedProvider === 'mpesa' ? '*150*00#' :
                                              selectedProvider === 'tigo' ? '*150*01#' :
                                              selectedProvider === 'airtel' ? '*150*60#' : '*150*88#',
                                              'dial'
                                            )}
                                            className="text-gray-400 hover:text-emerald-600 p-0.5"
                                          >
                                            {copiedField === 'dial' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                          </button>
                                        </div>
                                        {copiedField === 'dial' && (
                                          <span className="absolute -top-2 right-2 bg-emerald-600 text-white text-[9px] px-1 rounded font-bold">
                                            {t.copied}
                                          </span>
                                        )}
                                      </div>

                                      <div className="bg-white p-2 rounded-lg border border-gray-100 relative">
                                        <p className="text-gray-400 font-medium mb-1">{t.paybillNo}</p>
                                        <div className="flex justify-between items-center">
                                          <span className="font-mono font-bold text-gray-900 text-[13px]">
                                            {selectedProvider === 'mpesa' ? '150150' :
                                             selectedProvider === 'tigo' ? '555666' :
                                             selectedProvider === 'airtel' ? '600600' : '888999'}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => copyToClipboard(
                                              selectedProvider === 'mpesa' ? '150150' :
                                              selectedProvider === 'tigo' ? '555666' :
                                              selectedProvider === 'airtel' ? '600600' : '888999',
                                              'paybill'
                                            )}
                                            className="text-gray-400 hover:text-emerald-600 p-0.5"
                                          >
                                            {copiedField === 'paybill' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                          </button>
                                        </div>
                                        {copiedField === 'paybill' && (
                                          <span className="absolute -top-2 right-2 bg-emerald-600 text-white text-[9px] px-1 rounded font-bold">
                                            {t.copied}
                                          </span>
                                        )}
                                      </div>

                                      <div className="bg-white p-2 rounded-lg border border-gray-100 relative col-span-2">
                                        <p className="text-gray-400 font-medium mb-1">{t.refNo}</p>
                                        <div className="flex justify-between items-center">
                                          <span className="font-mono font-bold text-gray-900 text-sm">
                                            {manualRef}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => copyToClipboard(manualRef, 'ref')}
                                            className="text-gray-400 hover:text-emerald-600 p-0.5"
                                          >
                                            {copiedField === 'ref' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                          </button>
                                        </div>
                                        {copiedField === 'ref' && (
                                          <span className="absolute -top-2 right-2 bg-emerald-600 text-white text-[9px] px-1 rounded font-bold">
                                            {t.copied}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Scrollable instructions block */}
                                    <div className="bg-white border border-gray-100 p-3 rounded-lg max-h-36 overflow-y-auto text-[11px] text-gray-600 space-y-1.5 scrollbar-thin">
                                      <p className="font-bold text-gray-700 text-xs mb-1">
                                        {lang === 'sw' ? 'Miongozo ya Malipo:' : 'Payment Steps:'}
                                      </p>
                                      {selectedProvider === 'mpesa' && (lang === 'sw' ? [
                                        'Piga *150*00# kwenye simu yako',
                                        'Chagua 4 (Lipa kwa M-Pesa)',
                                        'Chagua 4 (Weka Namba ya Kampuni)',
                                        'Weka Namba ya Kampuni: 150150',
                                        `Weka Kumbukumbu: ${manualRef}`,
                                        `Weka Kiasi: ${parseInt(contributionAmount).toLocaleString()} TZS`,
                                        'Weka PIN yako ya M-Pesa kukamilisha'
                                      ] : [
                                        'Dial *150*00# on your phone',
                                        'Select 4 (Lipa kwa M-Pesa)',
                                        'Select 4 (Enter Company ID)',
                                        'Enter Company Number: 150150',
                                        `Enter Reference Number: ${manualRef}`,
                                        `Enter Amount: ${parseInt(contributionAmount).toLocaleString()} TZS`,
                                        'Enter your M-Pesa PIN to confirm'
                                      ]).map((step, idx) => (
                                        <p key={idx} className="flex items-start">
                                          <span className="font-bold text-emerald-600 mr-1.5">{idx + 1}.</span>
                                          <span>{step}</span>
                                        </p>
                                      ))}

                                      {selectedProvider === 'tigo' && (lang === 'sw' ? [
                                        'Piga *150*01# kwenye simu yako',
                                        'Chagua 4 (Lipa kwa Tigo Pesa)',
                                        'Chagua 3 (Lipa kwa Simu / Lipa Namba)',
                                        'Weka Lipa Namba ya Tigo: 555666',
                                        `Weka Kumbukumbu: ${manualRef}`,
                                        `Weka Kiasi: ${parseInt(contributionAmount).toLocaleString()} TZS`,
                                        'Weka PIN yako ya Tigo Pesa kuthibitisha'
                                      ] : [
                                        'Dial *150*01# on your phone',
                                        'Select 4 (Lipa kwa Tigo Pesa)',
                                        'Select 3 (Lipa kwa Simu / Lipa Namba)',
                                        'Enter Tigo Lipa Namba: 555666',
                                        `Enter Reference Number: ${manualRef}`,
                                        `Enter Amount: ${parseInt(contributionAmount).toLocaleString()} TZS`,
                                        'Enter your Tigo Pesa PIN to confirm'
                                      ]).map((step, idx) => (
                                        <p key={idx} className="flex items-start">
                                          <span className="font-bold text-emerald-600 mr-1.5">{idx + 1}.</span>
                                          <span>{step}</span>
                                        </p>
                                      ))}

                                      {selectedProvider === 'airtel' && (lang === 'sw' ? [
                                        'Piga *150*60# kwenye simu yako',
                                        'Chagua 5 (Lipa kwa Airtel Money)',
                                        'Chagua 2 (Lipia Bidhaa / Namba ya Kampuni)',
                                        'Weka Namba ya Kampuni: 600600',
                                        `Weka Kumbukumbu: ${manualRef}`,
                                        `Weka Kiasi: ${parseInt(contributionAmount).toLocaleString()} TZS`,
                                        'Weka PIN yako ya Airtel Money kuthibitisha'
                                      ] : [
                                        'Dial *150*60# on your phone',
                                        'Select 5 (Lipa kwa Airtel Money)',
                                        'Select 2 (Pay Goods / Enter Company ID)',
                                        'Enter Company Number: 600600',
                                        `Enter Reference Number: ${manualRef}`,
                                        `Enter Amount: ${parseInt(contributionAmount).toLocaleString()} TZS`,
                                        'Enter your Airtel Money PIN to confirm'
                                      ]).map((step, idx) => (
                                        <p key={idx} className="flex items-start">
                                          <span className="font-bold text-emerald-600 mr-1.5">{idx + 1}.</span>
                                          <span>{step}</span>
                                        </p>
                                      ))}

                                      {selectedProvider === 'halopesa' && (lang === 'sw' ? [
                                        'Piga *150*88# kwenye simu yako',
                                        'Chagua 5 (Halo Pesa ya Biashara)',
                                        'Chagua 3 (Lipa kwa Halo Pesa)',
                                        'Weka Lipa Namba ya Halotel: 888999',
                                        `Weka Kumbukumbu: ${manualRef}`,
                                        `Weka Kiasi: ${parseInt(contributionAmount).toLocaleString()} TZS`,
                                        'Weka PIN yako ya HaloPesa kuthibitisha'
                                      ] : [
                                        'Dial *150*88# on your phone',
                                        'Select 5 (Halo Pesa ya Biashara)',
                                        'Select 3 (Lipa kwa Halo Pesa)',
                                        'Enter Halotel Lipa Namba: 888999',
                                        `Enter Reference Number: ${manualRef}`,
                                        `Enter Amount: ${parseInt(contributionAmount).toLocaleString()} TZS`,
                                        'Enter your HaloPesa PIN to confirm'
                                      ]).map((step, idx) => (
                                        <p key={idx} className="flex items-start">
                                          <span className="font-bold text-emerald-600 mr-1.5">{idx + 1}.</span>
                                          <span>{step}</span>
                                        </p>
                                      ))}
                                    </div>
                                  </div>

                                  {/* USSD Receipt Input */}
                                  <form onSubmit={handleUssdPaymentSubmit} className="space-y-3">
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-700 mb-1 ml-1">
                                        {t.enterTxId}
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="MF. RG749302JK"
                                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-sm font-bold tracking-wider uppercase"
                                        value={ussdReceiptId}
                                        onChange={(e) => setUssdReceiptId(e.target.value)}
                                        required
                                      />
                                    </div>
                                    <button
                                      type="submit"
                                      className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm text-sm"
                                    >
                                      {t.verifyTx}
                                    </button>
                                  </form>
                                </div>
                              )}

                              {/* Navigation Buttons for Step 2 */}
                              <div className="flex pt-1 border-t border-gray-100">
                                <button
                                  type="button"
                                  onClick={() => setPaymentStep(1)}
                                  className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 animate-pulse"
                                >
                                  <ArrowLeft className="w-3.5 h-3.5" />
                                  <span>{t.back}</span>
                                </button>
                              </div>
                            </div>
                          ) : paymentStep === 3 ? (
                            <div className="text-center py-10 px-4 space-y-4">
                              <div className="relative w-16 h-16 mx-auto mb-2">
                                <div className="absolute inset-0 rounded-full border-4 border-emerald-100/60 animate-pulse"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></div>
                              </div>
                              <h3 className="text-base font-bold text-gray-900">{t.verifyingTitle}</h3>
                              <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                                {t.verifyingSub}
                              </p>
                            </div>
                          ) : (
                            <div className="text-center py-8 px-4 space-y-5">
                              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto scale-110 shadow-inner">
                                <Check className="w-8 h-8 text-emerald-600 stroke-[3]" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-950">{t.successTx}</h3>
                                <p className="text-xs text-gray-500 mt-1">
                                  {lang === 'sw' ? 'Muamala wako umekamilishwa kikamilifu na kuongezwa kwenye historia ya akaunti yako.' : 'Your transaction has been verified successfully and recorded on your statement.'}
                                </p>
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  setIsMakingContribution(false);
                                  setPaymentStep(1);
                                  setPaymentMode('direct');
                                }}
                                className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-sm transition-colors"
                              >
                                {t.close}
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="transaction-list"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2.5"
                        >
                          {transactions.map((tx) => (
                            <button
                              key={tx.id}
                              onClick={() => setSelectedTx(tx)}
                              className="w-full text-left flex items-center justify-between bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm hover:shadow hover:border-emerald-100 transition-all"
                            >
                              <div className="flex items-center space-x-3.5">
                                <div className="p-2.5 rounded-full bg-emerald-50 text-emerald-600">
                                  <ArrowUpRight className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 text-sm">
                                    {t[tx.type as keyof typeof t] || t.send}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">{tx.date}</p>
                                </div>
                              </div>
                              <div className="font-semibold text-sm text-gray-950">
                                {tx.amount.toLocaleString()} TZS
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Transaction Details Modal */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
              onClick={() => setSelectedTx(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative z-10 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900">{t.transactionDetails}</h3>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                >
                  &times;
                </button>
              </div>
              
              <div className="flex flex-col items-center mb-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="p-3 rounded-full mb-3 bg-emerald-100 text-emerald-600">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gray-905">
                  {selectedTx.amount.toLocaleString()} TZS
                </div>
                <div className="text-sm font-medium text-gray-500 mt-1">{t[selectedTx.type as keyof typeof t] || t.send}</div>
                <span className="mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/50">
                  {t.verified}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.date}</span>
                  <span className="text-sm font-medium text-gray-900">{selectedTx.date}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.transactionId}</span>
                  <span className="text-sm font-mono font-medium text-gray-900">{selectedTx.id}</span>
                </div>
                {selectedTx.provider && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.provider}</span>
                    <span className="text-sm font-medium text-gray-900">{t[selectedTx.provider as keyof typeof t] || selectedTx.provider}</span>
                  </div>
                )}
                {selectedTx.recipient && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.recipientNumber}</span>
                    <span className="text-sm font-medium text-gray-900">{selectedTx.recipient}</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setSelectedTx(null)}
                className="mt-8 w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors"
              >
                {t.close}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile App & APK Download Guidance Modal */}
      <AnimatePresence>
        {showDownloadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
              onClick={() => setShowDownloadModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative z-10 p-5 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-base text-gray-900">{t.apkTitle}</h3>
                </div>
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors text-lg"
                >
                  &times;
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-5 scrollbar-thin">
                {/* Intro */}
                <p className="text-xs text-gray-500 leading-relaxed">
                  {lang === 'sw' 
                    ? 'PamojaPesa sasa inapatikana kama Programu Kamili ya Simu! Unaweza kuchagua kuweka kama Web App ya Haraka (PWA) au kupakua kisakinishi cha Android (APK).'
                    : 'PamojaPesa is now available on mobile! You can install it as a lightweight Progressive Web App (PWA) or download the Android installer package (APK).'}
                </p>

                {/* Option 1: Native APK */}
                <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-xs text-emerald-800 uppercase tracking-wider">Android APK Installer</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-normal">
                    {t.apkSub}
                  </p>

                  {/* APK Package Info Badges */}
                  <div className="flex flex-wrap gap-1.5 py-1">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                      PamojaPesa.apk
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-medium">
                      ~705 KB
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-medium">
                      v1.0.0
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-medium">
                      com.pamojapesa.app
                    </span>
                  </div>
                  
                  {/* Instructions */}
                  <div className="bg-white/80 rounded-xl p-3 border border-emerald-100/30 text-[11px] text-gray-600 space-y-1.5 font-medium">
                    <p className="font-bold text-xs text-gray-700 mb-1">{t.installInstructions}:</p>
                    <p className="flex items-start">
                      <span className="font-bold text-emerald-600 mr-1.5">1.</span>
                      <span>{t.step1Android}</span>
                    </p>
                    <p className="flex items-start">
                      <span className="font-bold text-emerald-600 mr-1.5">2.</span>
                      <span>{t.step2Android}</span>
                    </p>
                    <p className="flex items-start">
                      <span className="font-bold text-emerald-600 mr-1.5">3.</span>
                      <span>{t.step3Android}</span>
                    </p>
                  </div>

                  <a
                    href="/PamojaPesa.apk"
                    download="PamojaPesa.apk"
                    onClick={() => {
                      showToast(lang === 'sw' ? 'Upakuaji wa PamojaPesa.apk umeanza!' : 'PamojaPesa.apk download started!');
                    }}
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all text-xs flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.apkDownloadBtn}</span>
                  </a>
                </div>

                {/* Option 2: Progressive Web App (PWA) */}
                <div className="bg-blue-50/25 border border-blue-100/40 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-xs text-blue-800 uppercase tracking-wider">{t.pwaTitle}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-normal">
                    {t.pwaSub}
                  </p>

                  <div className="bg-white/80 rounded-xl p-3 border border-blue-100/20 text-[11px] text-gray-600 space-y-1.5 font-medium">
                    <p className="font-bold text-xs text-gray-700 mb-1">{t.installInstructions} (PWA):</p>
                    <p className="flex items-start">
                      <span className="font-bold text-blue-600 mr-1.5">1.</span>
                      <span>{t.step1Pwa}</span>
                    </p>
                    <p className="flex items-start">
                      <span className="font-bold text-blue-600 mr-1.5">2.</span>
                      <span>{t.step2Pwa}</span>
                    </p>
                    <p className="flex items-start">
                      <span className="font-bold text-blue-600 mr-1.5">3.</span>
                      <span>{t.step3Pwa}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowDownloadModal(false)}
                  className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors text-xs"
                >
                  {t.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

