import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Coins, Zap, ShieldCheck, Loader2, 
  X, ShoppingCart, Star, Shield
} from 'lucide-react'; 
import { useAuth } from '../../Context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const CoinStore = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const getAuthToken = () => {
    const directToken = localStorage.getItem('token') || localStorage.getItem('jwt');
    if (directToken) return directToken;

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        return parsed.token || parsed.accessToken || parsed.jwt || userData;
      } catch (e) {
        return userData; 
      }
    }
    return null;
  };

  const bundles = [
    { id: 'starter', coins: 30, price: 30, label: 'Starter Pack', icon: <Coins className="text-indigo-400" size={32} /> },
    { id: 'pro', coins: 60, price: 50, label: 'Professional', icon: <Zap className="text-indigo-400" size={32} />, popular: true },
    { id: 'elite', coins: 120, price: 100, label: 'Elite Pack', icon: <ShieldCheck className="text-indigo-400" size={32} /> },
  ];

  const handleRazorpayPayment = async (bundle) => {
    const token = getAuthToken();
    if (!token) {
      alert("Session missing. Please login again.");
      navigate('/login');
      return;
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Check your internet.");
      return;
    }

    setLoading(true);
    try {
      const payload = { 
        amount: Math.floor(bundle.price), 
        coins: Math.floor(bundle.coins),
        userId: user?.id || user?._id 
      };

      const orderRes = await fetch(`${API_URL}/api/payment/order`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.message || "Backend rejected order creation.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: orderData.amount, 
        currency: orderData.currency || "INR",
        name: "HireMap",
        description: `Top-up: ${bundle.coins} AI Coins`,
        order_id: orderData.id,
        handler: async (response) => {
          setLoading(true);
          try {
            const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user?.id || user?._id,
                coins: bundle.coins,
                amount: orderData.amount
              })
            });

            const result = await verifyRes.json();
            if (result.success) {
              alert(` Success! ${bundle.coins} coins added.`);
              if(refreshUser) await refreshUser(); 
              navigate('/StudentDashboard');
            } else {
              alert("Verification Failed: " + (result.message || "Unknown Error"));
            }
          } catch (vErr) {
            alert("Network error during verification.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || ""
        },
        theme: { color: "#6366f1" },
        modal: { ondismiss: () => setLoading(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(" Gateway Error:", err);
      alert("Error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09141e] text-slate-200 font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      {loading && (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center space-y-6 text-center px-4">
          <Loader2 className="text-indigo-500 animate-spin" size={60} />
          <div>
            <p className="text-white font-black uppercase tracking-[0.3em] text-sm">Secure Payment Gateway</p>
            <p className="text-slate-500 text-[10px] uppercase mt-2">Connecting to Razorpay Servers...</p>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
        <Link to="/StudentDashboard" className="absolute top-8 right-8 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all z-[100] active:scale-90 shadow-2xl backdrop-blur-xl group">
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        </Link>

        <header className="mb-20 space-y-2">
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
            Coin <span className="text-indigo-500">Store</span>
          </motion.h1>
          <p className="text-slate-500 font-medium italic opacity-60">Recharge AI Analysis Credits</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {bundles.map((bundle, index) => (
            <motion.div 
              key={bundle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative bg-[#030712]/60 border ${bundle.popular ? 'border-indigo-500/40' : 'border-white/5'} p-12 rounded-[3.5rem] flex flex-col items-center backdrop-blur-3xl shadow-2xl transition-all duration-500 group`}
            >
              {bundle.popular && (
                <div className="absolute -top-5 bg-indigo-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                  <Star size={12} fill="currentColor" /> Best Value
                </div>
              )}
              <div className="mb-8 p-6 bg-[#09141e] rounded-3xl border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                {bundle.icon}
              </div>
              <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">{bundle.coins} Coins</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-10">{bundle.label}</p>
              <div className="text-5xl font-black text-white mb-12 tracking-tighter leading-none">
                <span className="text-xl text-indigo-500 align-top mr-1">₹</span>{bundle.price}
              </div>
              <button 
                onClick={() => handleRazorpayPayment(bundle)}
                disabled={loading}
                className={`w-full py-5 ${bundle.popular ? 'bg-indigo-600 text-white' : 'bg-white text-black'} hover:bg-indigo-500 hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 disabled:opacity-50`}
              >
                {loading ? "Waiting..." : "Purchase"} <ShoppingCart size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        <footer className="flex flex-col items-center opacity-30 space-y-4">
           <div className="flex items-center gap-2 text-slate-500 text-[9px] font-black uppercase tracking-[0.4em]">
              <Shield size={14} /> PCI-DSS Compliant Gateway • SSL Secured
           </div>
        </footer>
      </div>
    </div>
  );
};

export default CoinStore;
