import { motion } from 'motion/react';

export function Skills() {
  const skills = [
    { name: 'Runway Gen-2/3 & Kling AI', percentage: 98 },
    { name: 'Midjourney & Stable Diffusion', percentage: 95 },
    { name: 'Google Gemini & LLMs', percentage: 90 },
    { name: 'Premiere / AE / CapCut', percentage: 98 },
    { name: 'Sony CineLine / Ronin / DJI FPV', percentage: 94 },
    { name: 'Unreal Engine 5 & C4D', percentage: 80 },
  ];

  return (
    <section id="skills" className="max-w-7xl mx-auto px-4 py-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card p-10 lg:p-14"
      >
        <div className="flex justify-between items-center mb-16">
          <h2 className="text-2xl font-medium tracking-widest">技能</h2>
          <span className="font-mono text-xs tracking-widest text-gray-500 uppercase">02 / Tech</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {skills.map((skill, index) => (
            <div key={skill.name} className="flex flex-col gap-3">
              <div className="flex justify-between items-end">
                <span className="text-gray-300 font-mono text-sm tracking-wide">{skill.name}</span>
                <span className="font-mono text-sm text-gray-400">{skill.percentage}%</span>
              </div>
              
              {/* Progress Bar Track */}
              <div className="h-[2px] w-full bg-white/10 relative overflow-hidden">
                {/* Animated Fill */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.percentage}%` }}
                  transition={{ duration: 1.5, delay: index * 0.1, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="absolute top-0 left-0 h-full bg-gray-300"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
