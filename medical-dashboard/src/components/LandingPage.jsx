import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Activity, Shield, MapPin, FileSearch, Scale, HeartPulse, ArrowRight, Database, Server, Code, FileText, Zap } from 'lucide-react';

const MouseTrackingCard = ({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center, clamped to prevent extreme rotation
    const distX = Math.min(Math.max(event.clientX - centerX, -100), 100);
    const distY = Math.min(Math.max(event.clientY - centerY, -100), 100);
    
    x.set(distX);
    y.set(distY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative ${className}`}
    >
      {/* Glossy overlay effect for 3d glass cards */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" style={{ transform: "translateZ(1px)" }}></div>
      {children}
    </motion.div>
  );
};

export default function LandingPage({ handleLogin }) {
  const containerRef = useRef(null);

  // Parallax Setup
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Hero Parallax
  const heroY = useTransform(smoothProgress, [0, 0.2], [0, 120]);
  const heroRotateX = useTransform(smoothProgress, [0, 0.2], [0, -8]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);

  // Tech Stack Parallax
  const stackY = useTransform(smoothProgress, [0.3, 0.6], [50, 0]);

  const features = [
    { 
      icon: <Activity className="text-cyan-400" size={32} />, 
      title: 'AI Symptom Triage', 
      desc: 'Input your symptoms and demographics. Our AI evaluates risk levels (LOW / MODERATE / HIGH) and suggests probable conditions.' 
    },
    { 
      icon: <MapPin className="text-emerald-400" size={32} />, 
      title: 'Hospital Locator', 
      desc: 'Utilizing browser geolocation, we instantly find and recommend three specialized nearby hospitals with direct Google Maps links.' 
    },
    { 
      icon: <FileSearch className="text-cyan-400" size={32} />, 
      title: 'Report Simplification', 
      desc: 'Upload confusing medical PDFs or images. Our AI translates clinical jargon into plain, everyday language with actionable takeaways.' 
    },
    { 
      icon: <Scale className="text-emerald-400" size={32} />, 
      title: 'BMI Calculator', 
      desc: 'Calculate your Body Mass Index and track it against WHO classifications using our visually coded health reference scale.' 
    }
  ];

  const whyChooseUs = [
    { title: 'AI-Powered Analysis', desc: 'Driven by Google Gemini 2.5 Flash for state-of-the-art medical text parsing.', icon: <HeartPulse className="text-emerald-400" /> },
    { title: 'Real-Time Geolocation', desc: 'Finds immediate, localized care options securely in your browser.', icon: <MapPin className="text-cyan-400" /> },
    { title: 'Instant Simplification', desc: 'Stop Googling complex terms. We summarize your reports instantly.', icon: <FileText className="text-emerald-400" /> },
    { title: 'Secure Google Login', desc: 'Frictionless authentication via Firebase SSO. Your data stays private.', icon: <Shield className="text-cyan-400" /> }
  ];

  const steps = [
    { num: '01', title: 'Enter Symptoms', desc: 'Share your age, gender, and how you feel using simple tags.' },
    { num: '02', title: 'Get AI Analysis', desc: 'Receive instant risk assessments and dietary recommendations.' },
    { num: '03', title: 'Find Nearby Care', desc: 'Get matched with local specialists and hospital locations.' }
  ];

  const techStack = [
    { name: 'React + Vite', icon: <Code /> },
    { name: 'Express.js', icon: <Server /> },
    { name: 'Gemini 2.5 AI', icon: <Zap /> },
    { name: 'Firebase SSO', icon: <Shield /> },
    { name: 'SQLite DB', icon: <Database /> },
    { name: 'Tailwind CSS', icon: <FileText /> }
  ];

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-[#040B16] text-slate-200 overflow-x-hidden font-sans" style={{ perspective: '1200px' }}>
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[150px]"></div>
        <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-blue-900/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Disclaimer Banner */}
      <div className="relative z-50 w-full bg-cyan-950/40 border-b border-cyan-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center text-center gap-3">
          <Shield className="text-cyan-400 shrink-0" size={16} />
          <p className="text-xs text-cyan-100 font-medium tracking-wide leading-relaxed">
            <strong className="text-cyan-300">Disclaimer:</strong> MediAssist AI is not a registered medical diagnosis platform. It is designed to provide informative triage and recommendation references. In emergencies, contact local emergency services immediately.
          </p>
        </div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-2xl font-black tracking-tight text-white">
          <Activity className="text-emerald-400" size={32} />
          <span>MediAssist<span className="text-cyan-400">AI</span></span>
        </div>
        <button onClick={handleLogin} className="px-6 py-2.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold text-sm transition-all border border-cyan-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          Portal Login
        </button>
      </nav>

      {/* Hero Section */}
      <motion.div 
        style={{ y: heroY, rotateX: heroRotateX, opacity: heroOpacity, transformStyle: "preserve-3d" }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-8 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          AI Triage System Online
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white max-w-4xl mb-6"
        >
          Take control of your health.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            Understand your body.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12 font-medium"
        >
          Guided by AI, built for you. Bridge the gap between complicated clinical reports and actionable health steps with our intelligent medical triage dashboard.
        </motion.p>

        {/* 3D Spring CTA Card */}
        <motion.div 
          whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative group cursor-pointer"
          onClick={handleLogin}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <button className="relative flex items-center justify-center gap-4 px-10 py-5 rounded-2xl bg-[#091221] border border-cyan-900/50 text-white font-bold text-lg shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
            Continue with Google
            <ArrowRight className="text-cyan-400 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </motion.div>
      </motion.div>

      {/* How it Works Section */}
      <div className="relative z-20 w-full bg-[#06101D] py-28 border-y border-cyan-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">A simple, powerful workflow designed to get you the care information you need in minutes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="relative flex flex-col items-center text-center z-10"
              >
                <div className="w-24 h-24 rounded-full bg-[#091629] border border-cyan-800/50 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.1)] mb-6 backdrop-blur-md">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-emerald-400">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Comprehensive Health Tools</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Leveraging advanced language models to provide precise, actionable, and simplified medical insights.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <MouseTrackingCard key={idx} className="bg-gradient-to-br from-[#091629]/80 to-[#040B16]/80 backdrop-blur-xl border border-cyan-900/40 rounded-3xl p-8 flex flex-col h-full shadow-xl">
              <div className="w-16 h-16 bg-cyan-950/50 rounded-2xl flex items-center justify-center mb-6 border border-cyan-800/50 shadow-inner" style={{ transform: "translateZ(20px)" }}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4" style={{ transform: "translateZ(30px)" }}>{feature.title}</h3>
              <p className="text-base text-slate-400 leading-relaxed mt-auto font-medium" style={{ transform: "translateZ(15px)" }}>{feature.desc}</p>
            </MouseTrackingCard>
          ))}
        </div>
      </div>

      {/* Why Choose Us & Built With */}
      <div className="relative z-20 w-full bg-gradient-to-b from-[#06101D] to-[#040B16] py-32 border-t border-cyan-900/30">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-white text-center mb-16">Why Choose Us</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((item, idx) => (
                <div key={idx} className="bg-[#091629]/50 border border-cyan-900/30 p-6 rounded-2xl hover:bg-[#091629] transition-colors shadow-lg">
                  <div className="mb-4">{item.icon}</div>
                  <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div style={{ y: stackY }} className="text-center bg-[#091629]/30 border border-cyan-900/20 rounded-3xl p-12 backdrop-blur-sm shadow-2xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-500 mb-8">Powered By Cutting-Edge Tech</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {techStack.map((tech, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                  <div className="text-cyan-400">{tech.icon}</div>
                  <span className="font-semibold text-lg">{tech.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 w-full bg-[#02050A] border-t border-cyan-900/30 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-2xl font-black tracking-tight text-white mb-6">
            <Activity className="text-emerald-400" size={28} />
            <span>MediAssist<span className="text-cyan-400">AI</span></span>
          </div>
          <p className="text-slate-500 max-w-md mb-12">Empowering individuals to take informed steps toward health resolution through intelligent triage.</p>
          
          <div className="w-full border-t border-cyan-900/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <p>&copy; {new Date().getFullYear()} MediAssist AI. All rights reserved.</p>
            <p className="max-w-xl text-center md:text-right">
              Not a medical diagnosis platform. Always seek the advice of your physician or other qualified health provider with any questions regarding a medical condition.
            </p>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
