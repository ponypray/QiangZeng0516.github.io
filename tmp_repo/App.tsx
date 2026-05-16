import React, { useState, useEffect, useRef } from 'react';
import { Language, ExperienceItem, TechSkill } from './types';
import BackgroundCanvas from './components/BackgroundCanvas';
import Guestbook from './components/Guestbook';

// --- DATA ---

const experienceData: ExperienceItem[] = [
  {
    id: 'exp1',
    companyCn: '吉利汽车研究院 (Geely Auto)',
    companyEn: 'Geely Auto Research Institute',
    titleCn: '大数据产品策划主管工程师',
    titleEn: 'Big Data Product Planning Supervisor',
    period: '2025.03 - PRESENT',
    descCn: [
      '核心职责：负责 AIGC 技术在品牌营销端的落地应用，搭建智能化内容生产管线。',
      'AIGC 工作流架构设计：主导开发企业级 AI 模型及工具，部署 AI 数字人与自动化脚本，实现广告视频规模化生产。',
      'AI 创意矩阵构建：利用 Gemini, Runway, Midjourney 等工具批量产出高视觉冲击力创意视频。',
      '技术赋能营销：推动从“传统拍摄”向“智能生成”转型。'
    ],
    descEn: [
      'Core Responsibility: Lead the application of AIGC technology in brand marketing.',
      'AIGC Workflow Design: Led development of enterprise AI models/tools, deployed AI Digital Humans.',
      'AI Creative Matrix: Utilized Gemini, Runway, Midjourney for mass-production of high-impact videos.',
      'Tech-Driven Marketing: Drove the transition to intelligent generation.'
    ]
  },
  {
    id: 'exp2',
    companyCn: '吉利雷达 (Geely Radar)',
    companyEn: 'Geely Radar',
    titleCn: '视觉内容专家 & 导演',
    titleEn: 'Visual Content Expert & Director',
    period: '2023.03 - 2025.03',
    descCn: [
      '品牌视觉定义：主导策划拍摄《超级皮卡》系列战役。',
      '高端用户叙事：负责用户纪录片制作，挖掘情感，提升品牌人文温度。',
      '全案执行与品控：作为导演/摄影/剪辑核心主创，统筹跨部门协作。'
    ],
    descEn: [
      'Brand Visual Identity: Led the "Super Pickup" campaign.',
      'User Storytelling: Produced user documentaries to mine emotional connections.',
      'Execution & Quality Control: Served as lead Director/DP/Editor.'
    ]
  },
  {
    id: 'exp3',
    companyCn: '中天模型 (Zhongtian Models)',
    companyEn: 'Zhongtian Models',
    titleCn: '新媒体内容运营经理',
    titleEn: 'New Media Content Operation Manager',
    period: '2021.08 - 2023.02',
    descCn: [
      '增长黑客：全权负责官方抖音账号运营，单平台单月涨粉 1.7W+。',
      '产品内容化：将硬核产品说明转化为高互动创意视频。'
    ],
    descEn: [
      'Growth Hacking: Managed official TikTok (Douyin) accounts with significant follower growth.',
      'Product Contentization: Transformed hardcore product specs into interactive videos.'
    ]
  },
  {
    id: 'exp4',
    companyCn: '零跑汽车 (Leapmotor)',
    companyEn: 'Leapmotor',
    titleCn: '视觉传播主管',
    titleEn: 'Visual Communication Supervisor',
    period: '2018.03 - 2021.02',
    descCn: [
      '爆款事件营销：ChinaJoy 期间策划现场短视频，抖音斩获 12万+ 播放。',
      '供应商管理与 QC：把控 TVC 及 UGC 内容质量。'
    ],
    descEn: [
      'Viral Event Marketing: Planned on-site short videos during ChinaJoy.',
      'Supplier Management & QC: Controlled quality for TVC and UGC content.'
    ]
  },
  {
    id: 'exp5',
    companyCn: '早期经历 (浙江文广 / 一典文化)',
    companyEn: 'Early Career (ZMG / Yidian)',
    titleCn: '核心主创 / 广电编导',
    titleEn: 'Core Creator / TV Director',
    period: '2013.02 - 2018.03',
    descCn: [
      '代表作《完美男人——入殓师》实现全网播放量破亿。',
      '为“弹个车”制作广告片单日播放超 42 万。'
    ],
    descEn: [
      'Representative work "The Perfect Man" achieved 100M+ views.',
      'Created ads for "Tan Ge Che" with high daily engagement.'
    ]
  }
];

const skillsData: TechSkill[] = [
  { name: 'Runway Gen-2/3 & Kling AI', level: 98, highlight: true, category: 'AI' },
  { name: 'Midjourney & Stable Diffusion', level: 95, highlight: true, category: 'AI' },
  { name: 'Google Gemini & LLMs', level: 90, highlight: false, category: 'AI' },
  { name: 'Premiere / AE / CapCut', level: 98, highlight: false, category: 'PRO' },
  { name: 'Sony CineLine / Ronin / DJI FPV', level: 94, highlight: false, category: 'PRO' },
  { name: 'Unreal Engine 5 & C4D', level: 80, highlight: false, category: 'PRO' }
];

const workItemsOriginal = [
  { id: 'p35X-kv1ek4', titleCn: '极氪009光辉版AIGC视频-塔克拉玛干篇', titleEn: 'ZEEKR 009 Radiant Edition AIGC Video - Desert Chapter', statsCn: 'AIGC 全流程', statsEn: 'AIGC Full Process', descCn: '利用 Gemini, Runway, Midjourney 打造。', descEn: 'Created with Gemini, Runway, Midjourney.' },
  { id: 'fMoDHmxzzM4', titleCn: '极氪009光辉版AIGC视频-喜马拉雅篇', titleEn: 'ZEEKR 009 Radiance Edition AIGC Video - Himalaya Chapter', statsCn: 'AIGC 自动化', statsEn: 'AIGC Workflow', descCn: '探索极端环境下的视觉呈现。', descEn: 'Exploring visual presentation in extreme environments.' },
  { id: '817C7H8Tjm8', titleCn: '吉利银河A7 AIGC视频 - For the journey within', titleEn: 'Geely Galaxy A7 AIGC Video', statsCn: '探索之旅', statsEn: 'Journey Within', descCn: '探索内在之旅 - 概念创意。', descEn: 'Exploring the Inner Journey - Concept.' },
  { id: 'HHsxlZnsQv8', titleCn: '商业视觉项目展示 I', titleEn: 'Commercial Visual I', statsCn: '全流程主创', statsEn: 'Full Creator', descCn: '负责策划、拍摄、剪辑及后期。', descEn: 'Planning, shooting, and post-production.' },
  { id: 'cf46s1C6Wfo', titleCn: '商业视觉项目展示 II', titleEn: 'Commercial Visual II', statsCn: '导演/摄影', statsEn: 'Dir/DP', descCn: '深度参与视觉呈现与镜头语言。', descEn: 'Visual presentation and camera language.' },
  { id: 'XjO9hTzDBWY', titleCn: '商业视觉项目展示 III', titleEn: 'Commercial Visual III', statsCn: '策划执行', statsEn: 'Planning & Exec', descCn: '精准传达品牌理念。', descEn: 'Accurately conveying brand philosophy.' },
  { id: 'Lafpc0y6eQ0', titleCn: '商业视觉项目展示 IV', titleEn: 'Commercial Visual IV', statsCn: '视觉叙事', statsEn: 'Storytelling', descCn: '实拍与后期特效结合。', descEn: 'Combining live-action with VFX.' },
  { id: 'Vbm-42Z7gEk', titleCn: '商业视觉项目展示 V', titleEn: 'Commercial Visual V', statsCn: '艺术创作', statsEn: 'Cinematic Art', descCn: '探索光影与构图的极致。', descEn: 'Exploring light and composition.' },
  { id: 'more', titleCn: 'MORE', titleEn: 'MORE', statsCn: '第二视界', statsEn: 'Second Horizon', descCn: '进入第二视界 探索更多', descEn: 'Enter Second Horizon for more.' }
];

const secondHorizonImages = [
  "https://i.ibb.co/nMZ2prKH/compressed.jpg",
  "https://i.ibb.co/93nwyjFQ/compressed.jpg",
  "https://i.ibb.co/RG4dYTdP/compressed-1.jpg",
  "https://i.ibb.co/fGySmPft/compressed-seedream-4-high-res-fal-b-A-black-car-is-parke.jpg",
  "https://i.ibb.co/4wKBKND5/compressed-see-dream4.jpg",
  "https://i.ibb.co/b5yYTFGs/compressed-retouch-2024093020205305.jpg",
  "https://i.ibb.co/23C3hBB1/compressed-retouch-2024093020202954.jpg",
  "https://i.ibb.co/q3vLt0wh/compressed-retouch-2024093020200828.jpg",
  "https://i.ibb.co/8g5Brh73/compressed-retouch-2024093020185078.jpg",
  "https://i.ibb.co/ycKpBcwy/compressed-retouch-2024041023271366.jpg",
  "https://i.ibb.co/fGxVVgq2/compressed-retouch-2024030112544775.jpg"
];

// --- Typewriter Component ---
const Typewriter: React.FC<{ text: string }> = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    
    useEffect(() => {
        let timeout: any;
        
        const animate = () => {
            setDisplayedText(prev => {
                if (isDeleting) {
                    if (prev.length === 0) {
                        setIsDeleting(false);
                        return '';
                    }
                    return prev.slice(0, -1);
                } else {
                    if (prev.length === text.length) {
                        // Pause at end
                        timeout = setTimeout(() => setIsDeleting(true), 2000);
                        return prev;
                    }
                    return text.slice(0, prev.length + 1);
                }
            });
            
            if (!isDeleting && displayedText.length === text.length) return; // Wait for the timeout set above
            
            const speed = isDeleting ? 30 : 100;
            timeout = setTimeout(animate, speed);
        };

        timeout = setTimeout(animate, 100);
        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, text]);

    return (
        <span className="text-brand-cyan font-mono text-sm tracking-widest uppercase">
            {displayedText}
            <span className="inline-block w-[2px] h-[1em] bg-brand-cyan ml-1 align-bottom animate-typewriter"></span>
        </span>
    );
};


// --- 3D Carousel Component ---
const Carousel3D: React.FC<{ language: Language; onMoreClick: () => void }> = ({ language, onMoreClick }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);

    const updateCards = () => {
        const container = containerRef.current;
        if (!container) return;
        const center = container.scrollLeft + container.clientWidth / 2;
        const cards = container.querySelectorAll('.carousel-card');
        let closestIndex = 0;
        let minDistance = Infinity;
        
        cards.forEach((card, index) => {
            const el = card as HTMLElement;
            const cardCenter = el.offsetLeft + el.offsetWidth / 2;
            const dist = (center - cardCenter) / (el.offsetWidth * 0.75); 
            const absDist = Math.abs(dist);

            if (absDist < minDistance) {
                minDistance = absDist;
                closestIndex = index;
            }
            
            const scale = Math.max(0.85, 1 - absDist * 0.2);
            const rotateY = dist * -30;
            const zIndex = 100 - Math.round(absDist * 10);
            const opacity = Math.max(0.4, 1 - absDist * 0.7);
            
            el.style.transform = `perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`;
            el.style.zIndex = `${zIndex}`;
            el.style.opacity = `${opacity}`;
            
            if (absDist < 0.35) {
                el.classList.add('is-center');
                el.style.filter = 'grayscale(0%)';
            } else {
                el.classList.remove('is-center');
                el.style.filter = 'grayscale(100%)';
            }
        });
        setCurrentIndex(closestIndex);
    };

    const scrollToItem = (index: number) => {
        const container = containerRef.current;
        if (!container) return;
        const cards = container.querySelectorAll('.carousel-card');
        const targetCard = cards[index] as HTMLElement;
        if (targetCard) {
             const scrollLeft = targetCard.offsetLeft - container.clientWidth / 2 + targetCard.offsetWidth / 2;
             container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const handleScroll = () => requestAnimationFrame(updateCards);
        container.addEventListener('scroll', handleScroll);
        updateCards();
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative w-full py-12 group/carousel select-none scroll-mt-24 grayscale hover:grayscale-0 transition-all duration-500" id="work">
             <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
             <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>

             <div 
                ref={containerRef}
                className="flex gap-8 overflow-x-auto py-10 px-[40%] scrollbar-hide cursor-grab active:cursor-grabbing"
                onMouseUp={() => {
                  const center = containerRef.current!.scrollLeft + containerRef.current!.clientWidth / 2;
                  const cards = containerRef.current!.querySelectorAll('.carousel-card');
                  let bestIdx = 0; let minDist = Infinity;
                  cards.forEach((c, i) => {
                    const d = Math.abs(center - ((c as HTMLElement).offsetLeft + c.clientWidth/2));
                    if(d < minDist) { minDist = d; bestIdx = i; }
                  });
                  scrollToItem(bestIdx);
                }}
             >
                {workItemsOriginal.map((item, index) => {
                    const isMore = item.id === 'more';
                    const isPlaying = playingIndex === index;
                    return (
                        <div 
                            key={index}
                            onClick={() => isMore ? onMoreClick() : scrollToItem(index)}
                            className="carousel-card relative flex-shrink-0 w-[400px] md:w-[600px] aspect-video rounded-xl overflow-hidden glass-card transition-all duration-500 ease-out border border-white/5 bg-black"
                        >
                            {isMore ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md">
                                    <h2 className="text-6xl md:text-8xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-widest uppercase">MORE</h2>
                                </div>
                            ) : (
                                <>
                                    {!isPlaying ? (
                                        <>
                                            <img src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} className="absolute inset-0 w-full h-full object-cover transition-all duration-500" />
                                            <div onClick={(e) => { e.stopPropagation(); setPlayingIndex(index); }} className="absolute inset-0 z-30 flex items-center justify-center cursor-pointer group/play">
                                                <div className="w-16 h-16 bg-brand-cyan/20 backdrop-blur-md rounded-full flex items-center justify-center border border-brand-cyan/50 opacity-0 group-hover/play:opacity-100 transition-opacity">
                                                    <svg className="w-8 h-8 text-brand-cyan ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${item.id}?autoplay=1`} frameBorder="0" allow="autoplay; encrypted-media" className="absolute inset-0 w-full h-full"></iframe>
                                    )}
                                </>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent z-40 pointer-events-none">
                                <h4 className="text-white font-mono text-lg">{language === 'cn' ? item.titleCn : item.titleEn}</h4>
                                <span className="text-[10px] text-brand-cyan font-mono uppercase tracking-widest">{language === 'cn' ? item.statsCn : item.statsEn}</span>
                            </div>
                        </div>
                    );
                })}
             </div>

             <div className="flex justify-center gap-2 mt-4">
                {workItemsOriginal.map((_, i) => (
                    <button key={i} onClick={() => scrollToItem(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-brand-cyan scale-125' : 'bg-gray-600'}`}></button>
                ))}
             </div>
        </div>
    );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('cn');
  const [currentPage, setCurrentPage] = useState<'home' | 'second'>('home');
  const [showEmail, setShowEmail] = useState(false);
  const [showWeChat, setShowWeChat] = useState(false);
  const [expandedExp, setExpandedExp] = useState<string[]>(['exp1']);

  useEffect(() => {
    const move = (e: MouseEvent) => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const toggleExp = (id: string) => {
    setExpandedExp(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAllExp = () => {
    if (expandedExp.length === experienceData.length) {
        setExpandedExp([]);
    } else {
        setExpandedExp(experienceData.map(e => e.id));
    }
  };

  const copyToClip = (text: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    const btn = e.currentTarget;
    const original = btn.innerHTML;
    btn.innerHTML = '<span class="text-[8px] text-green-400">COPIED</span>';
    setTimeout(() => btn.innerHTML = original, 1500);
  };

  return (
    <>
      <BackgroundCanvas />
      <div className="global-glow"></div>

      {/* Language Toggle */}
      <button onClick={() => setLang(l => l==='cn'?'en':'cn')} className="fixed top-8 right-8 z-50 glass-card px-4 py-1.5 rounded-full border-brand-cyan/20 animate-pulse-glow hover:scale-105 transition-transform cursor-pointer">
        <span className="text-[10px] font-mono tracking-widest text-brand-cyan font-bold uppercase">{lang === 'cn' ? 'EN' : '中文'}</span>
      </button>

      {currentPage === 'home' ? (
        <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-24">
            {/* Dynamic Island Nav */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-40 flex justify-center">
                <div className="dynamic-island px-4 py-2 rounded-full flex gap-4 text-[10px] font-mono font-bold text-gray-400">
                    <a href="#hero" className="hover:text-white transition-colors">{lang === 'cn' ? 'Pony' : 'Pony'}</a>
                    <a href="#core" className="hover:text-white transition-colors">{lang === 'cn' ? '理念' : 'CORE'}</a>
                    <a href="#skill" className="hover:text-white transition-colors">{lang === 'cn' ? '技能' : 'SKILL'}</a>
                    <a href="#exp" className="hover:text-white transition-colors">{lang === 'cn' ? '经历' : 'EXP'}</a>
                    <a href="#work" className="hover:text-white transition-colors">{lang === 'cn' ? '作品' : 'WORK'}</a>
                    <a href="#awards" className="hover:text-white transition-colors">{lang === 'cn' ? '荣誉' : 'AWARDS'}</a>
                    <a href="#contact" className="text-brand-cyan/80 hover:text-brand-cyan transition-colors">{lang === 'cn' ? '联系' : 'LINK'}</a>
                </div>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Hero */}
                <section id="hero" className="md:col-span-12 flex justify-center mb-16 float-anim-1">
                    <div className="glass-card p-12 rounded-3xl text-center max-w-3xl border-white/5">
                        <div className="relative w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden border border-white/10">
                            <img src="https://i.ibb.co/Q7y4ctpJ/image.png" className="w-full h-full object-cover" />
                            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                        </div>
                        <h1 className="text-6xl font-bold font-mono text-white mb-2">
                            {lang === 'cn' ? '曾 强' : 'QIANG ZENG'}
                        </h1>
                        <div className="h-6 mb-4 flex items-center justify-center">
                            <Typewriter text={lang === 'cn' ? 'AIGC 视觉专家 | 视频导演' : 'AIGC VISUAL EXPERT | DIRECTOR'} />
                        </div>
                        <p className="text-gray-400 font-mono text-sm max-w-xl mx-auto">
                            {lang === 'cn' ? '以工业级的严谨，重构 AI 时代的视觉叙事。' : 'Restructuring visual narratives in the AI Era with industrial rigor.'}
                        </p>
                    </div>
                </section>

                {/* Core / Summary */}
                <div id="core" className="md:col-span-8 glass-card p-8 rounded-2xl float-anim-2 scroll-mt-24 grayscale hover:grayscale-0 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20 text-brand-cyan">
                         <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    </div>
                    <h3 className="text-2xl font-mono text-white mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-cyan/10 flex items-center justify-center border border-brand-cyan/30 shadow-[0_0_10px_rgba(0,242,255,0.2)]">
                            <svg className="w-4 h-4 text-brand-cyan" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                        </div>
                        {lang === 'cn' ? '个人总结' : 'Summary'}
                    </h3>
                    <p className="text-gray-400 text-sm leading-loose">
                        {lang === 'cn' ? (
                            <>
                            拥有 12 年+ <span className="text-brand-cyan font-bold">全链路影像制作与营销经验</span>，曾深耕广电及新能源汽车赛道。作为一名<span className="text-brand-cyan font-bold">"视觉工程师"</span>，我精通从商业脚本、拍摄执导到后期特效的全流程管理，并擅长利用数据驱动策略打造病毒式内容。现专注于 <span className="text-brand-cyan font-bold">AIGC 企业级落地</span> 与 <span className="text-brand-cyan font-bold">AI+视频自动化工作流构建</span>，致力于用技术实现视觉审美的<span className="text-brand-cyan font-bold">极致降本增效</span>。
                            </>
                        ) : '12+ years of full-stack visual production & marketing experience. Expert in TV broadcasting & NEV sectors. Visual Engineer mastering the full pipeline from commercial scripts to VFX. Focused on enterprise AIGC implementation & AI-driven video automation workflows.'}
                    </p>
                </div>

                {/* Tags / Stats */}
                <div className="md:col-span-4 glass-card p-8 rounded-2xl flex flex-col justify-center items-center text-center relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                     <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/10 to-transparent opacity-50"></div>
                    <h2 className="text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-cyan mb-2">100M+</h2>
                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em]">{lang==='cn' ? '全网播放量破亿' : 'TOTAL VIEWS WORLDWIDE'}</p>
                    <div className="mt-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-500">VIRAL CREATOR</div>
                </div>

                {/* Skills */}
                <div id="skill" className="md:col-span-12 glass-card p-8 rounded-2xl scroll-mt-24 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-mono text-white">SKILLS</h3>
                        <span className="text-[10px] text-gray-600 font-mono">02 / TECH</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {skillsData.map(s => (
                            <div key={s.name}>
                                <div className="flex justify-between text-[10px] font-mono text-gray-500 mb-1">
                                    <span>{s.name}</span><span className={s.highlight?'text-brand-cyan':''}>{s.level}%</span>
                                </div>
                                <div className="h-[1px] bg-gray-900 w-full overflow-hidden">
                                    <div className={`h-full ${s.highlight?'bg-brand-cyan shadow-[0_0_10px_#00F2FF]':'bg-white'}`} style={{width: `${s.level}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Experience */}
                <div id="exp" className="md:col-span-7 glass-card p-8 rounded-2xl scroll-mt-24 grayscale hover:grayscale-0 transition-all duration-500 boolean-pattern relative">
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="text-lg font-mono text-white">EXPERIENCE</h3>
                        <button onClick={toggleAllExp} className="text-[10px] font-mono text-brand-cyan border border-brand-cyan/30 px-3 py-1 rounded hover:bg-brand-cyan/10 transition-colors">
                            {expandedExp.length === experienceData.length ? (lang === 'cn' ? '[ 收起全部 ]' : '[ FOLD ALL ]') : (lang === 'cn' ? '[ 展开全部 ]' : '[ EXPAND ALL ]')}
                        </button>
                    </div>
                    <div className="space-y-4 relative z-10">
                        {experienceData.map(item => (
                            <div key={item.id} onClick={() => toggleExp(item.id)} className={`pl-4 border-l transition-colors cursor-pointer ${expandedExp.includes(item.id)?'border-brand-cyan':'border-gray-800'}`}>
                                <div className="flex justify-between mb-1">
                                    <h4 className="text-white text-sm font-bold group-hover:text-brand-cyan transition-colors">{lang==='cn'?item.companyCn:item.companyEn}</h4>
                                    <span className="text-[10px] font-mono text-gray-500">{item.period}</span>
                                </div>
                                <div className="text-xs text-gray-400 mb-2">{lang==='cn'?item.titleCn:item.titleEn}</div>
                                {expandedExp.includes(item.id) && (
                                    <ul className="mt-2 space-y-1 animate-in fade-in slide-in-from-left-2">
                                        {(lang==='cn'?item.descCn:item.descEn).map((d, i) => (
                                            <li key={i} className="text-[10px] text-gray-500 list-disc list-inside">{d}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Education & Awards */}
                <div id="awards" className="md:col-span-5 glass-card p-8 rounded-2xl flex flex-col justify-between scroll-mt-24 grayscale hover:grayscale-0 transition-all duration-500">
                    <div>
                        <h3 className="text-lg font-mono text-white mb-6">EDU & AWARDS</h3>
                        <div className="space-y-4">
                            <div className="border-l border-brand-cyan/50 pl-4">
                                <h4 className="text-white text-xs font-bold">{lang === 'cn' ? '亚洲微电影大赛“金海棠奖”' : 'Asian Micro-film "Golden Begonia"'}</h4>
                                <p className="text-[10px] text-gray-500">Asian Micro-film "Golden Begonia"</p>
                            </div>
                            <div className="border-l border-gray-700 pl-4">
                                <h4 className="text-white text-xs font-bold">{lang === 'cn' ? 'LiblibAI 认证“Lib 原创者”' : 'LiblibAI Certified Creator'}</h4>
                                <p className="text-[10px] text-gray-500">Certified Creator</p>
                            </div>
                            <div className="border-l border-gray-700 pl-4">
                                <h4 className="text-white text-xs font-bold">{lang === 'cn' ? '浙江传媒学院 (ZJICM)' : 'Zhejiang Univ. of Media & Comm'}</h4>
                                <p className="text-[10px] text-gray-500">Broadcasting & Hosting Art</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex gap-2">
                         <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-500 border border-white/5">🏆 Gold Award</span>
                         <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-500 border border-white/5">🎓 Bachelor</span>
                    </div>
                </div>

                {/* 3D Carousel Work Section */}
                <div className="md:col-span-12">
                    <Carousel3D language={lang} onMoreClick={() => setCurrentPage('second')} />
                </div>

                {/* Contact Card */}
                <div id="contact" className="md:col-span-5 glass-card p-8 rounded-2xl relative scroll-mt-24 grayscale hover:grayscale-0 transition-all duration-500 flex flex-col justify-center">
                    <div className="absolute top-4 left-4 text-[10px] font-mono text-gray-500">CONTACT</div>
                    <div className="flex flex-col gap-4 mt-8">
                        <div className="relative">
                            <button onClick={() => setShowEmail(!showEmail)} className="w-full py-4 rounded-xl border border-gray-800 text-xs font-mono uppercase text-gray-400 hover:border-brand-cyan hover:text-brand-cyan transition-all flex items-center justify-center gap-2">
                                <span>EMAIL</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"></path></svg>
                            </button>
                            {showEmail && (
                                <div className="absolute bottom-full left-0 w-full mb-2 bg-black/95 border border-brand-cyan/20 p-4 rounded-xl backdrop-blur-xl z-50 text-[10px] font-mono animate-in zoom-in fade-in">
                                    <div className="flex justify-between items-center mb-2 text-gray-400 hover:text-white group/item">
                                        <span>Overseas: zengqiang5@gmail.com</span>
                                        <button onClick={(e) => copyToClip('zengqiang5@gmail.com', e)} className="text-brand-cyan hover:scale-110 transition-transform"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="2"></path></svg></button>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-400 hover:text-white group/item">
                                        <span>Domestic: ponydawu@qq.com</span>
                                        <button onClick={(e) => copyToClip('ponydawu@qq.com', e)} className="text-brand-cyan hover:scale-110 transition-transform"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="2"></path></svg></button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <button onMouseEnter={() => setShowWeChat(true)} onMouseLeave={() => setShowWeChat(false)} className="w-full py-4 rounded-xl border border-gray-800 text-xs font-mono uppercase text-gray-400 hover:border-brand-cyan hover:text-brand-cyan transition-all flex items-center justify-center gap-2">
                                <span>WECHAT</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" strokeWidth="2"></path></svg>
                            </button>
                            {showWeChat && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-white p-1 rounded-xl z-50 animate-in zoom-in fade-in">
                                    <img src="https://i.ibb.co/jkGzR2pV/20251220134418-115-75.jpg" className="w-full h-auto rounded-lg" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Guestbook */}
                <div className="md:col-span-7">
                    <div className="h-full grayscale hover:grayscale-0 transition-all duration-500">
                        <Guestbook language={lang} />
                    </div>
                </div>
            </div>
            
            <footer className="mt-32 text-center text-[10px] font-mono text-gray-700 tracking-[0.5em] uppercase">
                QIANG ZENG © 2025 ALL RIGHTS RESERVED
            </footer>
        </main>
      ) : (
        /* Second Horizon Page */
        <main className="relative z-10 w-full min-h-screen max-w-[1400px] mx-auto px-6 py-32 animate-in fade-in duration-500">
            <button onClick={() => setCurrentPage('home')} className="fixed top-8 left-8 z-50 glass-card px-4 py-2 rounded-full border border-white/10 text-xs font-mono text-brand-cyan flex items-center gap-2 hover:bg-white/5 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth="2"></path></svg>
                BACK
            </button>
            <div className="text-center mb-16">
                <h2 className="text-4xl font-mono font-bold tracking-[0.3em] text-white">SECOND HORIZON</h2>
                <p className="text-gray-500 font-mono text-xs mt-4">Exploring the unseen narratives through AIGC</p>
            </div>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                {secondHorizonImages.map((img, i) => (
                    <div key={i} className="break-inside-avoid glass-card rounded-xl overflow-hidden group">
                        <img src={img} className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700" loading="lazy" />
                    </div>
                ))}
            </div>
        </main>
      )}
    </>
  );
};

export default App;