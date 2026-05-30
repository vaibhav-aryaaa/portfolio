import { motion } from 'framer-motion';
import { RefreshCw, Check } from 'lucide-react';
import { experienceData } from '../data/experience';

export default function ExperienceTimeline() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  } as const;

  return (
    <div className="w-full flex flex-col items-center mb-12 relative z-10 pt-2">
      {/* Title */}
      <div className="w-full text-left mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Professional Experience</h2>
      </div>

      {/* Cards Stack */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full flex flex-col gap-6 max-w-2xl"
      >
        {experienceData.map((exp) => (
          <motion.div
            key={exp.id}
            variants={cardVariants}
            whileHover={{ 
              y: -4, 
              boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.12)',
              borderColor: 'rgba(59, 130, 246, 0.4)' // Subtle blue glow on hover
            }}
             className="w-full bg-[#fcfcfc] dark:bg-zinc-900/40 border border-slate-200/80 dark:border-zinc-800/80 rounded-[2rem] p-6 md:p-8 flex flex-col justify-between shadow-sm transition-colors duration-300 relative group overflow-hidden"
          >
            {/* Background Hover Accent */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/20 dark:from-blue-900/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Header Info */}
            <div className="flex justify-between items-start mb-4 relative z-10">
              {/* Date Pill */}
              <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs font-semibold tracking-wide shadow-sm shadow-blue-500/10">
                {exp.period}
              </span>

              {/* Status Circle Badge */}
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-inner transition-all duration-300 ${
                  exp.ongoing 
                    ? 'bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/20 text-blue-500' 
                    : 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/20 text-emerald-500'
                }`}
              >
                {exp.ongoing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <RefreshCw className="w-4 h-4 stroke-[2.5]" />
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Company & Role */}
            <div className="flex flex-col text-left mb-4 relative z-10">
              <span className="text-slate-500 dark:text-slate-400 font-medium text-[14px] md:text-[15px] tracking-wide mb-1">
                {exp.company}
              </span>
              <h3 className="text-slate-850 dark:text-slate-100 font-bold text-lg md:text-xl leading-snug tracking-tight">
                {exp.role}
              </h3>
            </div>

            {/* Bullets List */}
            {exp.bullets && exp.bullets.length > 0 && (
              <ul className="list-disc pl-5 text-slate-650 dark:text-slate-300 text-sm md:text-[14px] space-y-2 mb-6 text-left relative z-10 leading-relaxed font-normal">
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx} className="marker:text-slate-400 dark:marker:text-slate-600 text-slate-655 dark:text-slate-300">
                    {bullet}
                  </li>
                ))}
              </ul>
            )}

            {/* Timeline Slider Graphic */}
            <div className="w-full flex flex-col gap-2 relative z-10 pt-2">
              {/* Horizontal Line and Endpoint Dots */}
              <div className="relative w-full h-[2px] bg-slate-200 dark:bg-zinc-800">
                {/* Left Dot */}
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-800 dark:bg-zinc-300 transition-all duration-300 group-hover:scale-125" />
                {/* Right Dot */}
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-800 dark:bg-zinc-300 transition-all duration-300 group-hover:scale-125" />
                {/* Animated Line Progress on Hover */}
                <motion.div 
                  className="absolute left-0 top-0 h-full bg-blue-500 origin-left"
                  initial={{ width: '0%' }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                />
              </div>

              {/* Month Labels */}
              <div className="w-full flex justify-between text-[11px] md:text-xs font-semibold text-slate-400 dark:text-zinc-500 tracking-wider">
                <span>{exp.startMonth}</span>
                <span>{exp.endMonth}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
