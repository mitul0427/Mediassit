import React, { useState } from 'react';
import {
  Info,
  UserCircle,
  ChevronRight,
  Activity,
  AlertTriangle,
  Stethoscope,
  PhoneCall,
  SquareActivity,
  Star,
  Plus,
  X
} from 'lucide-react';
import Chatbot from './components/Chatbot';

function App() {
  const [painLevel, setPainLevel] = useState(8);
  const [symptoms, setSymptoms] = useState(['Chest Pain', 'Shortness of Breath', 'Dizziness']);
  const [currentSymptom, setCurrentSymptom] = useState('');

  // Default state to match the prompt's initial design
  const [riskData, setRiskData] = useState({
    riskLevel: "HIGH",
    alert: "Urgent Care Required",
    probableConditions: [
      { name: "Acute Coronary Syndrome", percentage: 75, color: "red" },
      { name: "Panic Attack", percentage: 15, color: "orange" },
      { name: "GERD", percentage: 10, color: "blue" }
    ],
    analysis: "Based on reported chest pain, shortness of breath, and dizziness, there is a high-likelihood of Acute Coronary Syndrome requiring immediate attention.",
    emergencyAdvice: "Seek immediate medical attention. Call 911 or go to the nearest ER.",
    specialist: {
      name: "Dr. Sarah Mitchell",
      role: "Cardiologist",
      experience: "15+ Years Experience",
      rating: 4.8,
      img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150&h=150"
    }
  });

  const handleSymptomDetected = (data) => {
    // Add new symptoms securely
    const newSymptoms = [...new Set([...symptoms, ...data.symptoms])];
    setSymptoms(newSymptoms);

    // Update dashboard risk data
    setRiskData({
      riskLevel: data.riskLevel,
      alert: data.alert,
      probableConditions: data.probableConditions,
      analysis: data.analysis,
      emergencyAdvice: data.emergencyAdvice,
      specialist: data.specialist
    });
  };

  const addSymptom = (e) => {
    e.preventDefault();
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (symptomToRemove) => {
    setSymptoms(symptoms.filter(s => s !== symptomToRemove));
  };

  return (
    <div className="min-h-screen pb-12 font-sans relative">
      {/* Navbar */}
      <nav className="neumorphic-card rounded-none border-t-0 border-l-0 border-r-0 py-4 px-6 md:px-12 flex justify-between items-center z-10 relative bg-white/70 backdrop-blur-md mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
            <SquareActivity size={24} />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">MTT</span>
        </div>

        <div className="hidden md:flex flex-col items-center">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Medical Triage and Risk Stratification Platform</h1>
          <div className="flex space-x-8 mt-2">
            <button className="text-blue-600 font-medium px-1 border-b-2 border-blue-600">Home</button>
            <button className="text-slate-500 hover:text-slate-800 font-medium px-1 transition-colors">Assessments</button>
            <button className="text-slate-500 hover:text-slate-800 font-medium px-1 transition-colors">Appointments</button>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-slate-500">
          <button className="hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-slate-100"><Info size={24} /></button>
          <button className="hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-slate-100"><UserCircle size={28} /></button>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">

        {/* Left Panel: Symptoms */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="neumorphic-card p-6 h-full flex flex-col relative overflow-hidden">
            {/* Subtle bg decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-16 -mt-16 z-0"></div>

            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2 z-10">
              <Activity className="text-blue-500" size={20} />
              Symptoms Analysis
            </h2>

            <div className="z-10 flex-1">
              <p className="text-sm font-medium text-slate-500 mb-3">What symptoms are you experiencing?</p>

              <form onSubmit={addSymptom} className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={currentSymptom}
                  onChange={(e) => setCurrentSymptom(e.target.value)}
                  placeholder="e.g., Headache, Nausea"
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium text-slate-700 placeholder-slate-400 bg-white"
                />
                <button
                  type="submit"
                  disabled={!currentSymptom.trim()}
                  className="bg-blue-600 text-white p-2 px-4 rounded-xl shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={20} />
                </button>
              </form>

              <div className="space-y-3 mb-8 max-h-[200px] overflow-y-auto pr-1">
                {symptoms.length === 0 ? (
                  <p className="text-slate-400 text-sm italic text-center py-4 bg-slate-50 rounded-xl border border-slate-100">No symptoms added yet. Please add your symptoms above.</p>
                ) : (
                  symptoms.map((symptom, idx) => (
                    <div key={idx} className="glass-pill p-3 px-4 rounded-xl flex justify-between items-center bg-white border border-slate-100 hover:border-blue-200 transition-all group shadow-sm">
                      <span className="font-medium text-slate-700">{symptom}</span>
                      <button
                        onClick={() => removeSymptom(symptom)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                        title="Remove symptom"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-500">Pain Severity</span>
                  <span className="text-sm font-bold text-red-500">{painLevel}/10</span>
                </div>
                <div className="relative pt-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={painLevel}
                    onChange={(e) => setPainLevel(parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 font-medium mt-3 px-1">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-sm font-medium text-slate-500 mb-3 block">Symptom Duration</span>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors shadow-sm">1 Day</button>
                  <button className="flex-1 py-2 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors shadow-sm">1 Week</button>
                  <button className="flex-1 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all">Over 2 Weeks</button>
                </div>
              </div>
            </div>

            <button className="w-full mt-auto py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group z-10">
              Next Step
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Center Panel: Risk Analysis */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-[20px] p-6 text-white relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 shadow-xl shadow-red-500/20 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>

            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="animate-pulse" size={24} />
                  <span className="text-red-100 font-medium tracking-wider text-sm">ALERT LEVEL</span>
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight mb-2 drop-shadow-md">{riskData.riskLevel} RISK</h2>
                <p className="text-lg text-red-100 font-medium">{riskData.alert}</p>
              </div>
            </div>
          </div>

          <div className="neumorphic-card p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-5 border-b border-slate-100 pb-4">Probable Conditions</h3>
            <div className="space-y-5">
              {riskData.probableConditions.map((condition, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-700">{condition.name}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 flex items-center relative overflow-hidden">
                    <div className={`bg-${condition.color}-500 h-3 rounded-full relative z-10 transition-all duration-1000`} style={{ width: `${condition.percentage}%` }}></div>
                    <span className="absolute right-0 top-0 bottom-0 text-[10px] items-center flex font-bold pr-2 z-20" style={{ left: `calc(${condition.percentage}% - 35px)`, color: 'white' }}>{condition.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="neumorphic-card p-6 bg-gradient-to-br from-white to-slate-50 relative overflow-hidden border-blue-50">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-blue-600">
              <Stethoscope size={80} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2 relative z-10">
              Clinical Analysis
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium text-[15px] relative z-10 py-1">
              {riskData.analysis}
            </p>
          </div>
        </div>

        {/* Right Panel: Staff & Advice */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="neumorphic-card p-6 flex flex-col h-full border-blue-50">
            <h3 className="text-lg font-semibold text-slate-800 mb-5">Recommended Specialist</h3>

            <div className="flex flex-col items-center bg-slate-50/50 rounded-2xl p-5 border border-slate-100/50 mb-auto">
              <div className="relative mb-4">
                <img
                  src={riskData.specialist.img}
                  alt={riskData.specialist.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <h4 className="text-lg font-bold text-slate-800">{riskData.specialist.name}</h4>
              <p className="text-blue-600 font-medium text-sm mb-1">{riskData.specialist.role}</p>
              <p className="text-slate-500 text-xs mb-3">{riskData.specialist.experience}</p>

              <div className="flex items-center gap-1 mb-5 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold text-yellow-700">{riskData.specialist.rating} Rating</span>
              </div>

              <button className="w-full py-3 rounded-xl bg-blue-50 text-blue-600 font-semibold text-sm hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/20 transform transition-all flex items-center justify-center gap-2 border border-blue-100 hover:border-blue-600">
                Book Appointment
              </button>
            </div>
          </div>

          <div className="neumorphic-card p-6 bg-gradient-to-br from-red-50 to-white border-red-100 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2.5 rounded-full text-red-600 shadow-inner">
                <PhoneCall size={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Emergency Advice</h3>
            </div>

            <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
              <p className="text-slate-700 font-medium text-[15px] leading-relaxed relative z-10 pl-2">
                {riskData.emergencyAdvice}
              </p>
            </div>
          </div>

        </div>

      </div>

      <Chatbot onSymptomDetected={handleSymptomDetected} />
    </div>
  );
}

export default App;
