import React from 'react';
import { ArrowRight, Info, Briefcase, Code2, Smile, UserPlus, User } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] relative overflow-hidden flex flex-col items-center justify-center font-sans text-slate-800">
      
      {/* Background Blurs (Fluid effect) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-orange-100/40 blur-[100px] pointer-events-none" />

      {/* Top Navigation */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
        <button className="flex items-center gap-2 bg-white/50 backdrop-blur-md border border-slate-200 shadow-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/80 transition-colors">
          <div className="w-5 h-5 bg-black rounded-md flex items-center justify-center">
             <span className="text-white text-[10px] font-bold">AI</span>
          </div>
          Build your AI portfolio <ArrowRight className="w-4 h-4 ml-1 text-slate-400" />
        </button>
        
        <button className="p-2 rounded-full hover:bg-black/5 transition-colors border border-transparent hover:border-slate-200">
          <Info className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center w-full max-w-2xl z-10 mt-10">
        {/* Avatar */}
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 rounded-full bg-slate-100 mb-6 shadow-lg border-4 border-white overflow-hidden flex items-center justify-center text-5xl"
        >
          {/* Placeholder emoji - we can swap with a Memoji image later! */}
          👨🏽‍💻
        </motion.div>

        {/* Headings */}
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h2 className="text-xl font-medium text-slate-800 mb-2">Hey, I'm Vaibhav 👋</h2>
          <h1 className="text-6xl font-extrabold tracking-tight text-black">AI Engineer</h1>
        </motion.div>

        {/* Search Input */}
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full relative max-w-xl mb-10"
        >
          <input 
            type="text" 
            placeholder="Ask me anything..." 
            className="w-full bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm rounded-full py-4 pl-6 pr-14 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
          />
          <button className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors shadow-md">
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Quick Prompts */}
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <QuickPrompt icon={<User className="w-4 h-4 text-teal-600" />} label="Me" />
          <QuickPrompt icon={<Briefcase className="w-4 h-4 text-emerald-600" />} label="Projects" />
          <QuickPrompt icon={<Code2 className="w-4 h-4 text-indigo-600" />} label="Skills" />
          <QuickPrompt icon={<Smile className="w-4 h-4 text-pink-600" />} label="Fun" />
          <QuickPrompt icon={<UserPlus className="w-4 h-4 text-amber-600" />} label="Contact" />
        </motion.div>
      </main>
      
      {/* Faint Background Text */}
      <div className="absolute bottom-[-2%] left-1/2 transform -translate-x-1/2 text-[12vw] font-black text-slate-200/40 pointer-events-none select-none z-0 tracking-tighter whitespace-nowrap">
        VAIBHAV
      </div>
    </div>
  );
}

function QuickPrompt({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex items-center gap-2 bg-white/60 backdrop-blur-md border border-slate-200 shadow-sm px-6 py-3 rounded-2xl hover:bg-white hover:scale-105 hover:shadow-md transition-all text-sm font-medium text-slate-700">
      {icon}
      {label}
    </button>
  );
}

export default App;
