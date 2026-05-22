import React, { useState } from 'react';
import { ArrowRight, Info, Briefcase, Code2, Smile, UserPlus, User, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, type MotionValue } from 'framer-motion';
import { projectsData, type Project } from './data/projects';
import { skillsData } from './data/skills';
import { useRef } from 'react';
import FluidCursor from './components/FluidCursor';

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

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-[15vw] font-black text-slate-200/40 tracking-tighter whitespace-nowrap leading-none select-none">
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
              className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white via-white/95 to-transparent -z-10 pointer-events-none"
            />
          )}
        </AnimatePresence>
        <div className="flex-1">
          <AnimatePresence>
            {viewState === 'landing' && (
              <motion.a 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/50 transition-all text-slate-700 pointer-events-auto"
              >
                <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center shadow-inner">
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
        
        <div className="flex-1 flex justify-end pointer-events-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2.5 rounded-full hover:bg-black/5 transition-colors border border-transparent hover:border-slate-200 backdrop-blur-xl"
          >
            <Info className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </header>

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
              onSelectProject={setSelectedProject}
            />
          )}
        </AnimatePresence>
      </main>
      
      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}

function LandingView({ onQuery }: { onQuery: (q: string, t: ChatMessage['type']) => void }) {
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
          <h2 className="text-3xl font-serif italic text-slate-700 mb-3">Hey, I'm Vaibhav 👋</h2>
          <h1 className="text-7xl md:text-8xl font-serif font-bold tracking-tight text-slate-900">AI Engineer</h1>
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
    </>
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

function ChatView({ 
  history, 
  activeIndex, 
  onQuery, 
  isTyping, 
  onSelectProject 
}: { 
  history: ChatMessage[], 
  activeIndex: number, 
  setActiveIndex: any, 
  onQuery: any, 
  isTyping: boolean,
  onSelectProject: (p: Project) => void
}) {
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
              <div className="flex items-center gap-1.5 px-5 py-4 bg-slate-100 shadow-sm rounded-2xl rounded-bl-sm w-fit">
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
              {activeMessage?.type === 'projects' && <ProjectsCarousel onSelectProject={onSelectProject} />}
              {activeMessage?.type === 'skills' && <SkillsExpertise />}
              {activeMessage?.type === 'contact' && <ContactCard />}

              {activeMessage?.ai_text ? (
                <div className="w-full flex justify-start mb-6">
                  <div className="bg-slate-100 text-slate-800 px-6 py-4 rounded-2xl rounded-bl-sm shadow-sm text-[15px] max-w-[85%] border border-slate-200/50 leading-relaxed">
                    {activeMessage?.ai_text}
                  </div>
                </div>
              ) : (
                activeMessage?.type !== 'me' && activeMessage?.type !== 'projects' && activeMessage?.type !== 'skills' && activeMessage?.type !== 'contact' && (
                  <div className="w-full flex flex-col items-center">
                    <div className="w-full text-left mb-6">
                      <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{activeMessage?.title}</h2>
                    </div>
                    
                    <div className="w-full h-[22rem] bg-slate-50/50 rounded-[2rem] border border-slate-200 flex flex-col items-center justify-center text-slate-500 shadow-sm mb-8">
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
          <MagnifyingItem><ChatPrompt icon={<User className="w-3.5 h-3.5 text-teal-600" />} label="Me" onClick={() => onQuery("Tell me about yourself.", 'me')} /></MagnifyingItem>
          <MagnifyingItem><ChatPrompt icon={<Briefcase className="w-3.5 h-3.5 text-emerald-600" />} label="Projects" onClick={() => onQuery("Show me your projects.", 'projects')} /></MagnifyingItem>
          <MagnifyingItem><ChatPrompt icon={<Code2 className="w-3.5 h-3.5 text-indigo-600" />} label="Skills" onClick={() => onQuery("What are your skills?", 'skills')} /></MagnifyingItem>
          <MagnifyingItem><ChatPrompt icon={<Smile className="w-3.5 h-3.5 text-pink-600" />} label="Fun" onClick={() => onQuery("Tell me a fun fact.", 'general')} /></MagnifyingItem>
          <MagnifyingItem><ChatPrompt icon={<UserPlus className="w-3.5 h-3.5 text-amber-600" />} label="Contact" onClick={() => onQuery("How can I contact you?", 'general')} /></MagnifyingItem>
        </MagnifyingContainer>

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
      className="flex items-center gap-1.5 bg-white/40 backdrop-blur-md border border-white/60 shadow-sm px-4 py-2.5 rounded-full hover:bg-white/60 transition-colors text-[13px] font-semibold text-slate-700 h-full whitespace-nowrap"
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
         <ProfileImage className="w-full h-full object-cover" />
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
          <span className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-[13px] font-normal shadow-sm">Machine Learning</span>
          <span className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-[13px] font-normal shadow-sm">FastAPI</span>
          <span className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-[13px] font-normal shadow-sm">React</span>
        </div>
      </div>
    </div>
  );
}

function ProjectsCarousel({ onSelectProject }: { onSelectProject: (p: Project) => void }) {
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
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">My Projects</h2>
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
        <button onClick={() => scroll('left')} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors shadow-sm">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => scroll('right')} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors shadow-sm">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project | null, onClose: () => void }) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 md:p-8 pt-28 md:pt-32">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-10rem)] bg-white rounded-[2rem] shadow-2xl overflow-y-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-12">
              <p className="text-slate-500 text-sm font-medium mb-2">{project.category}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-10">{project.title}</h2>
              
              {/* Description */}
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 mb-10">
                <p className="text-slate-700 leading-relaxed text-[17px] mb-8">
                  {project.description}
                </p>
                
                {/* Technologies */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span key={tech} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium shadow-sm">
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
                    <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group text-slate-800 font-medium border border-slate-100">
                      {link.label}
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Screenshots */}
              <div className="w-full flex flex-col gap-6">
                {project.screenshots.map((img, i) => (
                  <ProjectImage key={i} src={img} fallbackSrc={project.fallbackScreenshots?.[i]} alt={`${project.title} screenshot ${i+1}`} className="w-full rounded-2xl shadow-sm border border-slate-100 object-cover" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SkillsExpertise() {
  return (
    <div className="w-full flex flex-col items-start mb-12 relative z-10 pt-2">
      <div className="w-full text-left mb-10">
        <h2 className="text-5xl md:text-6xl font-bold text-slate-300 tracking-tight">Skills & Expertise</h2>
      </div>
      
      <div className="w-full flex flex-col gap-10">
        {skillsData.map((category) => (
          <div key={category.title} className="w-full flex flex-col items-start">
            <h3 className="text-xl font-bold mb-4 text-slate-900 flex items-center gap-2">
              <span className="text-slate-500 font-mono tracking-tighter">{'</>'}</span> {category.title}
            </h3>
            
            <div className="flex flex-wrap gap-2.5">
              {category.skills.map((skill, sIdx) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sIdx * 0.05 }}
                  className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white rounded-full text-[13px] font-medium tracking-wide transition-colors cursor-default shadow-sm"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactCard() {
  const socials = [
    { name: 'LinkedIn', url: 'https://linkedin.com/in/vaibhav-arya' },
    { name: 'Github', url: 'https://github.com/vaibhav-aryaaa' },
    { name: 'Discord', url: 'https://discord.gg' },
    { name: 'X', url: 'https://x.com' },
    { name: 'Youtube', url: 'https://youtube.com' },
    { name: 'Instagram', url: 'https://instagram.com/vaibhav.aryaa' }
  ];

  return (
    <div className="w-full bg-[#f8f9fa] border border-slate-200/60 rounded-3xl p-6 md:p-8 mb-6 shadow-sm flex flex-col items-stretch text-left">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Contacts</h2>
        <span className="text-sm md:text-base text-slate-500 font-medium">@vaibhav.aryaa</span>
      </div>
      
      <hr className="border-slate-200/80 mb-6" />
      
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
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-normal tracking-wide transition-all shadow-sm active:scale-95"
          >
            {social.name}
          </a>
        ))}
      </div>
    </div>
  );
}
