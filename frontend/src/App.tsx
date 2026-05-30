import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Info, Briefcase, Code2, UserPlus, User, FileText, X, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, type MotionValue } from 'framer-motion';
import { projectsData, type Project } from './data/projects';
import { skillsData } from './data/skills';
import FluidCursor from './components/FluidCursor';
import ExperienceTimeline from './components/ExperienceTimeline';

type ViewState = 'landing' | 'chat';

interface ChatMessage {
  id: string;
  query: string;
  type: 'projects' | 'skills' | 'resume' | 'general' | 'me' | 'contact';
  title: string;
  ai_text?: string;
}

function MemojiAvatar({ type, className = "" }: { type: 'landing' | 'chat'; className?: string }) {
  const [hasError, setHasError] = useState(false);
  
  const fallbackEmoji = type === 'landing' ? '🙋🏽‍♂️' : '👨🏽‍💻';
  const imgSrc = type === 'landing' ? '/assets/memoji/landing.png' : '/assets/memoji/chat.png';
  
  if (hasError) {
    return <span className={`${className} flex items-center justify-center`}>{fallbackEmoji}</span>;
  }
  
  return (
    <img 
      src={imgSrc} 
      alt={`${type} memoji`} 
      className={`${className} object-contain`}
      onError={() => setHasError(true)}
    />
  );
}

function ProfileImage({ className = "" }: { className?: string }) {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <img 
        src="https://ui-avatars.com/api/?name=Vaibhav+Arya&size=256&background=f1f5f9&color=334155" 
        alt="Vaibhav" 
        className={className} 
      />
    );
  }
  
  return (
    <img 
      src="/assets/me/profile.jpg" 
      alt="Vaibhav" 
      className={className}
      onError={() => setHasError(true)}
    />
  );
}

interface ProjectImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
}

function ProjectImage({ src, fallbackSrc, alt, className = "" }: ProjectImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  
  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);
  
  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={() => {
        if (fallbackSrc && imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}

interface StreamingTextProps {
  text: string;
  speed?: number;
  renderText: (t: string) => React.ReactNode;
}

function StreamingText({ text, speed = 8, renderText }: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    if (!text) return;

    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <>{renderText(displayedText)}</>;
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

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
      
      const historyPayload = chatHistory.flatMap(msg => {
        const msgs = [{ role: 'user', content: msg.query }];
        if (msg.ai_text) {
          msgs.push({ role: 'assistant', content: msg.ai_text });
        }
        return msgs;
      });

      const responsePromise = fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, history: historyPayload })
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
    <div className={`min-h-screen relative flex flex-col font-sans transition-colors duration-500 ${
      theme === 'dark' 
        ? 'bg-black text-slate-100' 
        : viewState === 'chat' ? 'bg-white text-slate-800' : 'bg-[#FDFDFD] text-slate-800'
    }`}>
      
      <AnimatePresence>
        {viewState === 'landing' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            className="fixed inset-0 z-0 pointer-events-none"
          >
            <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-500 ${theme === 'dark' ? 'bg-purple-900/10' : 'bg-purple-200/40'}`} />
            <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-500 ${theme === 'dark' ? 'bg-blue-900/10' : 'bg-blue-200/40'}`} />
            <div className={`absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full blur-[100px] transition-colors duration-500 ${theme === 'dark' ? 'bg-orange-900/5' : 'bg-orange-100/40'}`} />
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 text-[15vw] font-black tracking-tighter whitespace-nowrap leading-none select-none transition-colors duration-500 ${
              theme === 'dark' ? 'text-zinc-900/10' : 'text-slate-200/40'
            }`}>
              VAIBHAV
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="fixed top-0 left-0 right-0 w-full px-6 pt-6 pb-4 flex justify-between items-start z-40 pointer-events-none">
        <AnimatePresence>
          {viewState === 'chat' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className={`absolute top-0 left-0 right-0 h-40 -z-10 pointer-events-none transition-colors duration-500 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-b from-black via-black/95 to-transparent' 
                  : 'bg-gradient-to-b from-white via-white/95 to-transparent'
              }`}
            />
          )}
        </AnimatePresence>
        <div className="flex-1">
          <AnimatePresence>
            {viewState === 'landing' && (
              <motion.a 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                href="https://drive.google.com/file/d/1qDxHL_Qsl6dEscLk_Ke3iONxXFauhmHu/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 backdrop-blur-xl border shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-5 py-2.5 rounded-full text-sm font-medium transition-all pointer-events-auto ${
                  theme === 'dark' 
                    ? 'bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-800/50 text-zinc-300' 
                    : 'bg-white/30 border-white/50 hover:bg-white/50 text-slate-700'
                }`}
              >
                <div className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center shadow-inner">
                   <FileText className="w-3 h-3 text-white" />
                </div>
                Resume <ArrowRight className="w-3 h-3 ml-1 opacity-70" />
              </motion.a>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 flex justify-center pointer-events-auto">
          <AnimatePresence>
            {viewState === 'chat' && (
              <motion.button 
                onClick={() => setViewState('landing')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-4xl md:text-5xl cursor-pointer bg-transparent border-0 outline-none select-none"
              >
                <MemojiAvatar type="chat" className="w-full h-full" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex-1 flex justify-end items-center gap-2.5 pointer-events-auto">
          <button 
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className={`p-2.5 rounded-full transition-colors border border-transparent backdrop-blur-xl cursor-pointer ${
              theme === 'dark' 
                ? 'hover:bg-white/5 hover:border-zinc-800 text-amber-400' 
                : 'hover:bg-black/5 hover:border-slate-200 text-slate-655'
            }`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className={`p-2.5 rounded-full transition-colors border border-transparent backdrop-blur-xl cursor-pointer ${
              theme === 'dark' 
                ? 'hover:bg-white/5 hover:border-zinc-800 text-zinc-400' 
                : 'hover:bg-black/5 hover:border-slate-200 text-slate-600'
            }`}
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full z-10 relative">
        <AnimatePresence mode="wait">
          {viewState === 'landing' ? (
            <LandingView key="landing" onQuery={handleQuery} theme={theme} />
          ) : (
            <ChatView 
              key="chat" 
              history={chatHistory} 
              activeIndex={activeIndex} 
              setActiveIndex={setActiveIndex} 
              onQuery={handleQuery}
              isTyping={isTyping}
              onSelectProject={setSelectedProject}
              theme={theme}
            />
          )}
        </AnimatePresence>
      </main>
      
      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} theme={theme} />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} theme={theme} />
    </div>
  );
}

function LandingView({ onQuery, theme }: { onQuery: (q: string, t: ChatMessage['type']) => void, theme?: string }) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    onQuery(input, 'general');
  };

  return (
    <>
      <FluidCursor />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center w-full max-w-3xl mt-24 md:mt-32 px-4"
      >
        <div className="text-center mb-6">
          <h2 className={`text-3xl font-serif italic mb-3 transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>Hey, I'm Vaibhav 👋</h2>
          <h1 className={`text-7xl md:text-8xl font-serif font-bold tracking-tight transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-100' : 'text-slate-900'}`}>AI Engineer</h1>
        </div>

        <motion.div className="w-24 h-24 mb-8 flex items-center justify-center text-5xl">
          <MemojiAvatar type="landing" className="w-full h-full" />
        </motion.div>

        <div className="w-full relative max-w-xl mb-10">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Ask me anything..." 
            className={`w-full backdrop-blur-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-full py-4 pl-6 pr-14 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-500 ${
              theme === 'dark' 
                ? 'bg-zinc-900/40 border-zinc-800/60 text-zinc-100' 
                : 'bg-white/40 border-white/60 text-slate-855'
            }`}
          />
          <button 
            onClick={handleSubmit}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors shadow-md cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <LandingPrompt icon={<User className="w-5 h-5 text-teal-600" />} label="Me" onClick={() => onQuery("Tell me about yourself.", 'me')} theme={theme} />
          <LandingPrompt icon={<Briefcase className="w-5 h-5 text-emerald-600" />} label="Projects" onClick={() => onQuery("Show me your projects.", 'projects')} theme={theme} />
          <LandingPrompt icon={<FileText className="w-5 h-5 text-violet-600" />} label="Experience" onClick={() => onQuery("Tell me about your work experience.", 'resume')} theme={theme} />
          <LandingPrompt icon={<Code2 className="w-5 h-5 text-indigo-600" />} label="Skills" onClick={() => onQuery("What are your skills?", 'skills')} theme={theme} />
          <LandingPrompt icon={<UserPlus className="w-5 h-5 text-amber-600" />} label="Contact" onClick={() => onQuery("How can I contact you?", 'general')} theme={theme} />
        </div>
      </motion.div>
    </>
  );
}

function LandingPrompt({ icon, label, onClick, theme }: { icon: React.ReactNode, label: string, onClick: () => void, theme?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 backdrop-blur-xl border shadow-[0_8px_32px_rgba(0,0,0,0.04)] px-6 py-3 rounded-2xl hover:scale-105 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all text-sm font-medium cursor-pointer ${
        theme === 'dark' 
          ? 'bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-800/50 text-zinc-350' 
          : 'bg-white/30 border-white/50 hover:bg-white/60 text-slate-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ChatView({ 
  history, 
  activeIndex, 
  onQuery, 
  isTyping, 
  onSelectProject,
  theme
}: { 
  history: ChatMessage[], 
  activeIndex: number, 
  setActiveIndex: any, 
  onQuery: any, 
  isTyping: boolean,
  onSelectProject: (p: Project) => void,
  theme?: string
}) {
  const [input, setInput] = useState('');
  const activeMessage = history[activeIndex];

  const renderChatText = (text: string) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        let cleanUrl = part;
        let trailingPunctuation = "";
        const trailingMatch = part.match(/[.,;:!?]+$/);
        if (trailingMatch) {
          cleanUrl = part.slice(0, -trailingMatch[0].length);
          trailingPunctuation = trailingMatch[0];
        }
        return (
          <span key={index}>
            <a 
              href={cleanUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-700 hover:underline break-all font-semibold"
            >
              {cleanUrl}
            </a>
            {trailingPunctuation}
          </span>
        );
      }
      return part;
    });
  };

  const handleSubmit = () => {
    onQuery(input, 'general');
    setInput('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex-1 flex flex-col items-center pt-32 pb-6 px-4 relative"
    >
      <div className="w-full max-w-4xl flex-1 flex flex-col relative z-10 pb-40">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="w-full flex justify-end mb-6"
        >
          <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-br-sm shadow-sm text-[15px] font-medium max-w-[85%] leading-relaxed">
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
              <div className={`flex items-center gap-1.5 px-5 py-4 shadow-sm rounded-2xl rounded-bl-sm w-fit transition-colors duration-500 ${
                theme === 'dark' ? 'bg-zinc-900 border border-zinc-800/80' : 'bg-slate-100'
              }`}>
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
              {activeMessage?.type === 'me' && <MeProfile theme={theme} />}
              {activeMessage?.type === 'projects' && <ProjectsCarousel onSelectProject={onSelectProject} theme={theme} />}
              {activeMessage?.type === 'resume' && <ExperienceTimeline />}
              {activeMessage?.type === 'skills' && (
                <SkillsExpertise 
                  onSelectSkill={(skill) => onQuery(`Tell me about your experience with ${skill}.`, 'skills')} 
                  theme={theme}
                />
              )}
              {activeMessage?.type === 'contact' && <ContactCard theme={theme} />}

              {activeMessage?.ai_text ? (
                <div className="w-full flex justify-start mb-6">
                  <div className={`px-6 py-4 rounded-2xl rounded-bl-sm shadow-sm text-[15px] max-w-[85%] leading-relaxed transition-colors duration-500 ${
                    theme === 'dark' 
                      ? 'bg-zinc-900 text-zinc-200 border border-zinc-800/80' 
                      : 'bg-slate-100 text-slate-800 border border-slate-200/50'
                  }`}>
                    <StreamingText key={activeMessage.id} text={activeMessage.ai_text} renderText={renderChatText} />
                  </div>
                </div>
              ) : (
                activeMessage?.type !== 'me' && activeMessage?.type !== 'projects' && activeMessage?.type !== 'resume' && activeMessage?.type !== 'skills' && activeMessage?.type !== 'contact' && (
                  <div className="w-full flex flex-col items-center">
                    <div className="w-full text-left mb-6">
                      <h2 className={`text-3xl font-bold tracking-tight transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-100' : 'text-slate-855'}`}>{activeMessage?.title}</h2>
                    </div>
                    
                    <div className={`w-full h-[22rem] rounded-[2rem] border flex flex-col items-center justify-center shadow-sm mb-8 transition-colors duration-500 ${
                      theme === 'dark' ? 'bg-zinc-900/40 border-zinc-800 text-zinc-400' : 'bg-slate-50/50 border-slate-200 text-slate-505'
                    }`}>
                       <Code2 className="w-8 h-8 mb-2 opacity-50" />
                       <span>[ Dynamic &lt;{activeMessage?.type} /&gt; renders here ]</span>
                    </div>
                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div 
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 flex flex-col items-center z-30"
      >
        <MagnifyingContainer>
          <MagnifyingItem><ChatPrompt icon={<User className="w-3.5 h-3.5 text-teal-600" />} label="Me" onClick={() => onQuery("Tell me about yourself.", 'me')} theme={theme} /></MagnifyingItem>
          <MagnifyingItem><ChatPrompt icon={<Briefcase className="w-3.5 h-3.5 text-emerald-600" />} label="Projects" onClick={() => onQuery("Show me your projects.", 'projects')} theme={theme} /></MagnifyingItem>
          <MagnifyingItem><ChatPrompt icon={<FileText className="w-3.5 h-3.5 text-violet-600" />} label="Experience" onClick={() => onQuery("Tell me about your work experience.", 'resume')} theme={theme} /></MagnifyingItem>
          <MagnifyingItem><ChatPrompt icon={<Code2 className="w-3.5 h-3.5 text-indigo-600" />} label="Skills" onClick={() => onQuery("What are your skills?", 'skills')} theme={theme} /></MagnifyingItem>
          <MagnifyingItem><ChatPrompt icon={<UserPlus className="w-3.5 h-3.5 text-amber-600" />} label="Contact" onClick={() => onQuery("How can I contact you?", 'general')} theme={theme} /></MagnifyingItem>
        </MagnifyingContainer>

        <div className="w-full relative px-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Ask me anything..." 
            className={`w-full shadow-[0_8px_32px_rgba(0,0,0,0.06)] border rounded-full py-4 pl-6 pr-14 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder-zinc-400 ${
              theme === 'dark' 
                ? 'bg-zinc-900/60 border-zinc-800/80 text-zinc-100' 
                : 'bg-white border-slate-200/60 text-slate-800'
            }`}
          />
          <button 
            onClick={handleSubmit}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ChatPrompt({ icon, label, onClick, theme }: { icon: React.ReactNode, label: string, onClick: () => void, theme?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-1.5 backdrop-blur-md border shadow-sm px-4 py-2.5 rounded-full transition-colors text-[13px] font-semibold h-full whitespace-nowrap cursor-pointer ${
        theme === 'dark' 
          ? 'bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-800/60 text-zinc-300' 
          : 'bg-white/40 border-white/60 hover:bg-white/60 text-slate-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function MagnifyingContainer({ children }: { children: React.ReactNode }) {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div 
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="flex flex-wrap justify-center gap-2 mb-4 h-[38px] items-end pointer-events-auto"
    >
      {React.Children.map(children, (child) => 
        React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<{ mouseX?: MotionValue<number> }>, { mouseX }) : child
      )}
    </motion.div>
  );
}

function MagnifyingItem({ children, mouseX }: { children: React.ReactNode, mouseX?: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const fallbackMouseX = useMotionValue(Infinity);
  const distance = useTransform(mouseX || fallbackMouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const scaleTarget = useTransform(distance, [-150, 0, 150], [1, 1.35, 1]);
  const scale = useSpring(scaleTarget, { stiffness: 400, damping: 25 });
  
  const marginTarget = useTransform(distance, [-150, 0, 150], [0, 10, 0]);
  const margin = useSpring(marginTarget, { stiffness: 400, damping: 25 });
  
  const zIndex = useTransform(distance, [-150, 0, 150], [0, 50, 0]);

  return (
    <motion.div 
      ref={ref} 
      style={{ scale, marginLeft: margin, marginRight: margin, zIndex: zIndex as any }} 
      className="origin-bottom h-full relative"
    >
      {children}
    </motion.div>
  );
}

function InfoModal({ isOpen, onClose, theme }: { isOpen: boolean, onClose: () => void, theme?: string }) {
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
            className={`relative w-full max-w-2xl rounded-[2rem] shadow-2xl p-8 md:p-12 overflow-hidden transition-colors duration-500 ${
              theme === 'dark' ? 'bg-zinc-950 text-zinc-100 border border-zinc-800/80' : 'bg-white text-slate-800'
            }`}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-3xl font-bold tracking-tight transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-50' : 'text-slate-900'}`}>Welcome to AI Portfolio</h2>
              <button 
                onClick={onClose}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className={`space-y-6 text-lg leading-relaxed transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-350' : 'text-slate-600'}`}>
              <div>
                <h3 className={`text-xl font-bold mb-2 transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-100' : 'text-slate-900'}`}>What's this?</h3>
                <p>
                  I'm so excited to present my <strong>brand new AI Portfolio.</strong><br/>
                  Whether you're a recruiter, a friend, family member, or just curious, feel free to ask anything you want!
                </p>
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-2 transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-100' : 'text-slate-900'}`}>Why?</h3>
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
                className={`px-8 py-3.5 rounded-full font-medium hover:scale-105 transition-all mb-6 shadow-md cursor-pointer ${
                  theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
                }`}
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

function MeProfile({ theme }: { theme?: string }) {
  return (
    <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
      {/* Photo */}
      <div className={`w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-[2rem] overflow-hidden shadow-sm border transition-colors duration-500 ${
        theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200/60'
      }`}>
         <ProfileImage className="w-full h-full object-cover" />
      </div>
      
      {/* Details */}
      <div className="flex-1 flex flex-col text-left">
        <h1 className={`text-4xl font-bold mb-2 transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-100' : 'text-slate-900'}`}>Vaibhav Arya</h1>
        <p className={`mb-4 font-medium transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-505'}`}>AI Engineer <span className="mx-2">•</span> India</p>
        
        <p className={`leading-relaxed mb-6 transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>
          Hey 👋<br/>
          I'm Vaibhav, an AI Engineer who builds intelligent products. I enjoy solving real problems, working closely with data and machine learning. I'm especially interested in LLMs, predictive modeling, and modern AI application stacks.
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[13px] font-normal shadow-sm">Machine Learning</span>
          <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[13px] font-normal shadow-sm">FastAPI</span>
          <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[13px] font-normal shadow-sm">React</span>
        </div>
      </div>
    </div>
  );
}

function ProjectsCarousel({ onSelectProject, theme }: { onSelectProject: (p: Project) => void, theme?: string }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col items-center mb-10 relative">
      <div className="w-full text-left mb-6">
        <h2 className={`text-3xl font-bold tracking-tight transition-colors duration-500 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>My Projects</h2>
      </div>
      
      {/* Carousel Container */}
      <div 
        ref={scrollRef}
        className="w-full flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pt-4 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projectsData.map((project) => (
          <div 
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="shrink-0 w-72 h-96 bg-slate-900 rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden cursor-pointer group snap-center shadow-lg transition-all hover:shadow-xl hover:-translate-y-2"
            style={{ isolation: 'isolate' }}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <ProjectImage src={project.thumbnail} fallbackSrc={project.fallbackThumbnail} alt={project.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
              <p className="text-white/80 text-sm font-medium mb-1 tracking-wide">{project.category}</p>
              <h3 className="text-white text-3xl font-bold tracking-tight">{project.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="flex w-full items-center justify-end gap-3 mt-2 pr-4 sm:pr-0">
        <button 
          onClick={() => scroll('left')} 
          className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors shadow-sm cursor-pointer ${
            theme === 'dark'
              ? 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-100 border-slate-800/80'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 border-transparent'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={() => scroll('right')} 
          className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors shadow-sm cursor-pointer ${
            theme === 'dark'
              ? 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-100 border-slate-800/80'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 border-transparent'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose, theme }: { project: Project | null, onClose: () => void, theme?: string }) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 md:p-8 pt-28 md:pt-32">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-3xl max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-10rem)] rounded-[2rem] shadow-2xl overflow-y-auto transition-colors duration-500 ${
              theme === 'dark' ? 'bg-zinc-950 text-zinc-100 border border-zinc-800/80' : 'bg-white text-slate-800'
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className={`absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full transition-colors z-20 cursor-pointer ${
                theme === 'dark' ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-505'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-12">
              <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>{project.category}</p>
              <h2 className={`text-4xl md:text-5xl font-bold tracking-tight mb-10 transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-50' : 'text-slate-900'}`}>{project.title}</h2>
              
              {/* Description */}
              <div className={`rounded-2xl p-6 md:p-8 mb-10 border transition-colors duration-500 ${
                theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800/70' : 'bg-slate-50 border-slate-100'
              }`}>
                <p className={`leading-relaxed text-[17px] mb-8 transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>
                  {project.description}
                </p>
                
                {/* Technologies */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span 
                        key={tech} 
                        className={`px-3 py-1.5 border rounded-md text-sm font-medium shadow-sm transition-colors duration-500 ${
                          theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="mb-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  Links
                </p>
                <div className="flex flex-col gap-2">
                  {project.links.map(link => (
                    <a 
                      key={link.label} 
                      href={link.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className={`flex items-center justify-between p-4 rounded-xl transition-colors group font-medium border ${
                        theme === 'dark' 
                          ? 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 text-zinc-200' 
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-800'
                      }`}
                    >
                      {link.label}
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-650 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Screenshots */}
              <div className="w-full flex flex-col gap-6">
                {project.screenshots.map((img, i) => (
                  <ProjectImage 
                    key={i} 
                    src={img} 
                    fallbackSrc={project.fallbackScreenshots?.[i]} 
                    alt={`${project.title} screenshot ${i+1}`} 
                    className={`w-full rounded-2xl shadow-sm border object-cover ${
                      theme === 'dark' ? 'border-zinc-800' : 'border-slate-100'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SkillsExpertise({ onSelectSkill, theme }: { onSelectSkill?: (skill: string) => void, theme?: string }) {
  return (
    <div className="w-full flex flex-col items-start mb-12 relative z-10 pt-2">
      <div className="w-full text-left mb-10">
        <h2 className={`text-5xl md:text-6xl font-bold tracking-tight transition-colors duration-500 ${
          theme === 'dark' ? 'text-zinc-800' : 'text-slate-300'
        }`}>Skills & Expertise</h2>
      </div>
      
      <div className="w-full flex flex-col gap-10">
        {skillsData.map((category) => (
          <div key={category.title} className="w-full flex flex-col items-start">
            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 transition-colors duration-500 ${
              theme === 'dark' ? 'text-zinc-100' : 'text-slate-900'
            }`}>
              <span className="text-slate-500 font-mono tracking-tighter">{'</>'}</span> {category.title}
            </h3>
            
            <div className="flex flex-wrap gap-2.5">
              {category.skills.map((skill, sIdx) => (
                <motion.button
                  key={skill}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05, backgroundColor: theme === 'dark' ? '#27272A' : '#000000' }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ delay: sIdx * 0.05 }}
                  onClick={() => onSelectSkill?.(skill)}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all cursor-pointer shadow-sm border-0 outline-none ${
                    theme === 'dark' ? 'bg-zinc-900 text-zinc-200' : 'bg-[#1A1A1A] text-white'
                  }`}
                >
                  {skill}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactCard({ theme }: { theme?: string }) {
  const socials = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/vaibhav-arya-737772324' },
    { name: 'Github', url: 'https://github.com/vaibhav-aryaaa' },
    { name: 'Discord', url: 'https://discord.com/users/1014795219830583356' },
    { name: 'X', url: 'https://x.com' },
    { name: 'Instagram', url: 'https://instagram.com/vaibhav.aryaa' }
  ];

  return (
    <div className={`w-full border rounded-3xl p-6 md:p-8 mb-6 shadow-sm flex flex-col items-stretch text-left transition-colors duration-500 ${
      theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800/80 text-zinc-100' : 'bg-[#f8f9fa] border-slate-200/60 text-slate-800'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-100' : 'text-slate-900'}`}>Contacts</h2>
        <span className="text-sm md:text-base text-slate-500 font-medium">@vaibhav.aryaa</span>
      </div>
      
      <hr className={`mb-6 transition-colors duration-500 ${theme === 'dark' ? 'border-zinc-800/60' : 'border-slate-200/80'}`} />
      
      <a 
        href="mailto:vaibhavarya338@gmail.com" 
        className="text-blue-500 hover:text-blue-600 font-normal text-lg md:text-xl mb-6 self-start transition-colors"
      >
        vaibhavarya338@gmail.com
      </a>
      
      <div className="flex flex-wrap gap-2.5">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-blue-650 hover:bg-blue-700 text-white rounded-full text-sm font-normal tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            {social.name}
          </a>
        ))}
      </div>
    </div>
  );
}
