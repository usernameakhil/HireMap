import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Zap, 
  Coins, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  Info,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: "Starter Pack",
      coins: 30,
      price: 30,
      description: "Perfect for a single detailed resume analysis and improvement suggestions.",
      color: "from-slate-400 to-slate-600",
      features: ["30 AI Credits", "can use all AI features", "Standard Email Support"]
    },
    {
      name: "Pro Growth",
      coins: 60,
      price: 50,
      description: "Best for active job seekers focusing on multiple roles.",
      color: "from-indigo-500 to-indigo-700",
      popular: true,
      features: ["60 AI Credits","can use all AI features", "Saves ₹10"]
    },
    {
      name: "Elite Career",
      coins: 120,
      price: 100,
      description: "Complete career toolkit for power users and serious applicants.",
      color: "from-rose-500 to-rose-700",
      features: ["120 AI Credits","can use all AI features", "Saves ₹20"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans selection:bg-indigo-100 pb-20">
      
      {/* --- HEADER SECTION --- */}
      <header className="bg-[#0F172A] pt-24 pb-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-600/10 rounded-full blur-[120px]" />
        </div>

        <Link 
          to="/" 
          className="absolute top-8 right-8 p-3 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-xl hover:bg-white/20 transition-all z-50"
        >
          <X size={20} />
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 space-y-4"
        >
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
            Fuel Your <span className="text-indigo-400">Career AI</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            purchase credits to access optional premium AI tools,Credits are non-transferable and only used to access platform features
          </p>
        </motion.div>
      </header>

      {/* --- PRICING CARDS --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-[2.5rem] p-8 shadow-xl border ${plan.popular ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-100'} flex flex-col relative overflow-hidden group`}
            >
              {plan.popular && (
                <div className="absolute top-5 right-5 bg-indigo-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Best Value
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white shadow-lg`}>
                  <Coins size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{plan.name}</h3>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed mt-1">{plan.description}</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 italic">₹{plan.price}</span>
                  <span className="text-slate-400 font-bold text-sm uppercase">/ {plan.coins} Coins</span>
                </div>
              </div>

              <div className="space-y-4 flex-grow border-t border-slate-50 pt-8">
                {plan.features.map(feature => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="p-1 bg-emerald-100 text-emerald-600 rounded-md">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className="text-slate-600 text-sm font-semibold">{feature}</span>
                  </div>
                ))}
              </div>

              
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- COMPLIANCE FOOTER --- */}
      <div className="max-w-4xl mx-auto mt-20 px-6">
        <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-[2.5rem] p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900">
                <ShieldCheck size={18} className="text-indigo-500" />
                <h4 className="text-sm font-black uppercase tracking-widest">Secure Payments</h4>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                All transactions are processed via encrypted payment gateways. We do not store your card or bank details.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900">
                <Info size={18} className="text-indigo-500" />
                <h4 className="text-sm font-black uppercase tracking-widest">Coin Usage</h4>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                Coins are digital credits for AI features and have no real-world monetary value. They are valid for 1 year from the date of purchase.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              By purchasing, you agree to our <Link to="/terms" className="text-indigo-500 underline">Terms of Service</Link>
            </p>
            <div className="flex gap-4">
              <CreditCard size={20} className="text-slate-300" />
              <Cpu size={20} className="text-slate-300" />
              <Zap size={20} className="text-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
