import React, { useState, useEffect } from 'react';
import { ArrowRight, Info, Briefcase, Code2, Smile, UserPlus, User, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ViewState = 'landing' | 'chat';

interface ChatMessage {
  id: string;
  query: string;
  type: 'projects' | 'skills' | 'resume' | 'general' | 'me';
  title: string;
  ai_text?: string;
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const handleQuery = async (query: string, typeHint: string = 'general') => {
    if (viewState === 'landing') {
      setViewState('chat');
    }
    
    setIsTyping(true);
    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      query, 
      type: typeHint as any, 
      title: "Query" 
    };
    
    setChatHistory(prev => [...prev, userMsg]);
    setActiveIndex(chatHistory.length);
    
    try {
      // Enforce a minimum 1.5s typing animation for a realistic feel
      const minDelayPromise = new Promise(resolve => setTimeout(resolve, 1500));
      
      const responsePromise = fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      const [response] = await Promise.all([responsePromise, minDelayPromise]);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      let responseTitle = "Response";
      if (data.intent === 'projects') responseTitle = "My Projects";
      if (data.intent === 'skills') responseTitle = "Skills & Expertise";
      if (data.intent === 'resume') responseTitle = "Professional Experience";
      if (data.intent === 'me') responseTitle = "About Me";
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        query: query,
        type: data.intent || 'general',
        title: responseTitle,
        ai_text: data.ai_text
      };
      
      setChatHistory(prev => [...prev, aiMsg]);
      setActiveIndex(chatHistory.length + 1);
    } catch (error) {
      console.error("Failed to fetch AI response", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        query: query,
        type: 'general',
        title: "Error",
        ai_text: "Sorry, my brain is currently offline. Please try again later."
      };
      setChatHistory(prev => [...prev, errorMsg]);
      setActiveIndex(chatHistory.length + 1);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`min-h-screen relative flex flex-col font-sans text-slate-800 transition-colors duration-500 ${viewState === 'chat' ? 'bg-white' : 'bg-[#FDFDFD]'}`}>
      
      <AnimatePresence>
        {viewState === 'landing' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            className="fixed inset-0 z-0 pointer-events-none"
          >
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/40 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-[120px]" />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-orange-100/40 blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-slate-200/40 tracking-tighter whitespace-nowrap">
              VAIBHAV
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
        <AnimatePresence>
          {viewState === 'landing' ? (
            <motion.a 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/50 transition-all text-slate-700"
            >
              <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center shadow-inner">
                 <FileText className="w-3 h-3 text-white" />
              </div>
              Resume <ArrowRight className="w-3 h-3 ml-1 opacity-70" />
            </motion.a>
          ) : (
            <div />
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-2 rounded-full hover:bg-black/5 transition-colors border border-transparent hover:border-slate-200 backdrop-blur-xl"
        >
          <Info className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <main className="flex-1 flex flex-col items-center w-full z-10 relative">
        <AnimatePresence mode="wait">
          {viewState === 'landing' ? (
            <LandingView key="landing" onQuery={handleQuery} />
          ) : (
            <ChatView 
              key="chat" 
              history={chatHistory} 
              activeIndex={activeIndex} 
              setActiveIndex={setActiveIndex} 
              onQuery={handleQuery}
              isTyping={isTyping}
            />
          )}
        </AnimatePresence>
      </main>
      
      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

function LandingView({ onQuery }: { onQuery: (q: string, t: ChatMessage['type']) => void }) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    onQuery(input, 'general');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center w-full max-w-3xl mt-24 md:mt-32 px-4"
    >
      <motion.div className="w-24 h-24 rounded-full bg-white/50 backdrop-blur-xl mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-4 border-white overflow-hidden flex items-center justify-center text-5xl">
        👨🏽‍💻
      </motion.div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif italic text-slate-700 mb-3">Hey, I'm Vaibhav 👋</h2>
        <h1 className="text-7xl md:text-8xl font-serif font-bold tracking-tight text-slate-900">AI Engineer</h1>
      </div>

      <div className="w-full relative max-w-xl mb-10">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Ask me anything..." 
          className="w-full bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-full py-4 pl-6 pr-14 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-500 text-slate-800"
        />
        <button 
          onClick={handleSubmit}
          className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors shadow-md"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <LandingPrompt icon={<User className="w-5 h-5 text-teal-600" />} label="Me" onClick={() => onQuery("Tell me about yourself.", 'me')} />
        <LandingPrompt icon={<Briefcase className="w-5 h-5 text-emerald-600" />} label="Projects" onClick={() => onQuery("Show me your projects.", 'projects')} />
        <LandingPrompt icon={<Code2 className="w-5 h-5 text-indigo-600" />} label="Skills" onClick={() => onQuery("What are your skills?", 'skills')} />
        <LandingPrompt icon={<Smile className="w-5 h-5 text-pink-600" />} label="Fun" onClick={() => onQuery("Tell me a fun fact.", 'general')} />
        <LandingPrompt icon={<UserPlus className="w-5 h-5 text-amber-600" />} label="Contact" onClick={() => onQuery("How can I contact you?", 'general')} />
      </div>
    </motion.div>
  );
}

function LandingPrompt({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] px-6 py-3 rounded-2xl hover:bg-white/60 hover:scale-105 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all text-sm font-medium text-slate-700"
    >
      {icon}
      {label}
    </button>
  );
}

function ChatView({ history, activeIndex, setActiveIndex, onQuery, isTyping }: { history: ChatMessage[], activeIndex: number, setActiveIndex: any, onQuery: any, isTyping: boolean }) {
  const [input, setInput] = useState('');
  const activeMessage = history[activeIndex];

  const handleSubmit = () => {
    onQuery(input, 'general');
    setInput('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex-1 flex flex-col items-center pt-8 pb-6 px-4 relative"
    >
      <motion.div 
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        className="w-12 h-12 rounded-full bg-white/50 backdrop-blur-xl mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white overflow-hidden flex items-center justify-center text-xl shrink-0"
      >
        👨🏽‍💻
      </motion.div>

      <div className="w-full max-w-2xl flex-1 flex flex-col relative z-10 pb-40">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="w-full flex justify-start mb-6"
        >
          <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-bl-sm shadow-sm text-[15px] font-medium max-w-[85%] leading-relaxed">
            {activeMessage?.query}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isTyping ? (
            <motion.div 
              key="typing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full flex justify-start mb-6"
            >
              <div className="flex items-center gap-1.5 px-5 py-4 bg-slate-100 shadow-sm rounded-2xl rounded-tl-sm w-fit">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="response"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col"
            >
              {activeMessage?.type === 'me' && <MeProfile />}

              {activeMessage?.ai_text ? (
                <div className="w-full flex justify-end mb-6">
                  <div className="bg-slate-100 text-slate-800 px-6 py-4 rounded-2xl rounded-br-sm shadow-sm text-[15px] max-w-[85%] border border-slate-200/50 leading-relaxed">
                    {activeMessage?.ai_text}
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full text-left mb-6">
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{activeMessage?.title}</h2>
                  </div>
                  
                  <div className="w-full h-[22rem] bg-slate-50/50 rounded-[2rem] border border-slate-200 flex flex-col items-center justify-center text-slate-500 shadow-sm mb-8">
                     <Code2 className="w-8 h-8 mb-2 opacity-50" />
                     <span>[ Dynamic &lt;{activeMessage?.type} /&gt; renders here ]</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 flex flex-col items-center z-30 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-2">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <ChatPrompt icon={<User className="w-3.5 h-3.5 text-teal-600" />} label="Me" onClick={() => onQuery("Tell me about yourself.", 'me')} />
          <ChatPrompt icon={<Briefcase className="w-3.5 h-3.5 text-emerald-600" />} label="Projects" onClick={() => onQuery("Show me your projects.", 'projects')} />
          <ChatPrompt icon={<Code2 className="w-3.5 h-3.5 text-indigo-600" />} label="Skills" onClick={() => onQuery("What are your skills?", 'skills')} />
          <ChatPrompt icon={<Smile className="w-3.5 h-3.5 text-pink-600" />} label="Fun" onClick={() => onQuery("Tell me a fun fact.", 'general')} />
          <ChatPrompt icon={<UserPlus className="w-3.5 h-3.5 text-amber-600" />} label="Contact" onClick={() => onQuery("How can I contact you?", 'general')} />
        </div>

        <div className="w-full relative px-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Ask me anything..." 
            className="w-full bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-200/60 rounded-full py-4 pl-6 pr-14 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-slate-800 placeholder-slate-400"
          />
          <button 
            onClick={handleSubmit}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all shadow-md shadow-blue-500/20"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ChatPrompt({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-1.5 bg-white/40 backdrop-blur-md border border-white/60 shadow-sm px-4 py-2.5 rounded-full hover:bg-white/60 hover:scale-105 transition-all text-[13px] font-semibold text-slate-700"
    >
      {icon}
      {label}
    </button>
  );
}

function InfoModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome to AI Portfolio</h2>
              <button 
                onClick={onClose}
                className="bg-black text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">What's ????</h3>
                <p>
                  I'm so excited to present my <strong>brand new AI Portfolio.</strong><br/>
                  Whether you're a recruiter, a friend, family member, or just curious, feel free to ask anything you want!
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Why ???</h3>
                <p>
                  Traditional portfolios can be limiting.<br/>
                  They can't adapt to every visitor's specific needs.<br/>
                  My portfolio becomes <strong>exactly what you're interested in knowing about me and my work.</strong>
                </p>
              </div>
            </div>
            
            <div className="mt-10 flex flex-col items-center">
              <button 
                onClick={onClose}
                className="bg-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-slate-800 hover:scale-105 transition-all mb-6 shadow-md"
              >
                Start Chatting
              </button>
              <p className="text-sm text-slate-500">
                If you love it, please share it! Feedback is always welcome. <a href="#" className="text-blue-500 hover:underline">Contact me.</a>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function MeProfile() {
  return (
    <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
      {/* Photo */}
      <div className="w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-[2rem] overflow-hidden bg-slate-100 shadow-sm border border-slate-200/60">
         <img 
            src="https://ui-avatars.com/api/?name=Vaibhav+Arya&size=256&background=f1f5f9&color=334155" 
            alt="Vaibhav" 
            className="w-full h-full object-cover" 
         />
      </div>
      
      {/* Details */}
      <div className="flex-1 flex flex-col">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Vaibhav</h1>
        <p className="text-slate-500 mb-4 font-medium">AI Engineer <span className="mx-2">•</span> India</p>
        
        <p className="text-slate-700 leading-relaxed mb-6">
          Hey 👋<br/>
          I'm Vaibhav, an AI Engineer who builds intelligent products. I enjoy solving real problems, working closely with data and machine learning. I'm especially interested in LLMs, predictive modeling, and modern AI application stacks.
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[13px] font-medium shadow-sm">Machine Learning</span>
          <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[13px] font-medium shadow-sm">FastAPI</span>
          <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[13px] font-medium shadow-sm">React</span>
        </div>
      </div>
    </div>
  );
}
