import { motion } from 'motion/react';

export function Works() {
  return (
    <section id="works" className="max-w-7xl mx-auto px-4 py-8">
      {/* Container holding the work items */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16">
        
        {/* Work Item 1 */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative group w-full md:w-[45%] h-64 md:h-80 rounded-[20px] overflow-hidden bg-black cursor-pointer border border-white/5"
        >
          {/* We'll use an unsplash placeholder representing horizon/radar/landscape */}
          <img 
             src="https://images.unsplash.com/photo-1541888048227-2dc04a2be8a3?q=80&w=800&auto=format&fit=crop" 
             alt="雷达地平线" 
             className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
            <h3 className="text-2xl font-medium tracking-widest text-white mb-2">雷达地平线</h3>
            <p className="text-xs text-gray-400 tracking-wide">商业视觉项目 V.</p>
            <p className="text-[10px] text-gray-500 mt-1">艺术创作</p>
          </div>
        </motion.div>

        {/* MORE card */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass-card w-full md:w-[45%] h-64 md:h-80 flex items-center justify-center cursor-pointer group hover:bg-white/5 transition-colors relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[#00E5FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h3 className="text-4xl font-mono tracking-[0.3em] text-gray-400 group-hover:text-white transition-colors z-10 relative left-[0.15em]">
            MORE
          </h3>
        </motion.div>
        
      </div>
      
      {/* Pagination dots */}
      <div className="flex justify-center items-center gap-3 mt-12">
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]"></div>
      </div>
    </section>
  );
}
