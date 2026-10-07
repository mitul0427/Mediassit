import React, { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal, Cloud, Bell, Search, Grid, RefreshCw, Camera, PenTool, Video, Brush, Layout as LayoutIcon, Box,
  GraduationCap, Briefcase, Activity, AlertTriangle, Stethoscope, PhoneCall, Star, Plus, X, MapPin
} from "lucide-react";
import Chatbot from "./components/Chatbot";
import LandingPage from "./components/LandingPage";
import { auth, provider } from "./firebase.config";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Analysis");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Medical State
  const [painLevel, setPainLevel] = useState(0);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [reportAnalysis, setReportAnalysis] = useState("");
  const fileInputRef = useRef(null);

  const [riskData, setRiskData] = useState(null);

  const [hospitals, setHospitals] = useState(null);
  const [isFindingHospitals, setIsFindingHospitals] = useState(false);

  // BMI State
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [bmiMessage, setBmiMessage] = useState("");

  const calculateBMI = (e) => {
    e.preventDefault();
    if (!height || !weight) return;

    const heightInMeters = parseFloat(height) / 100;
    const bodyWeight = parseFloat(weight);

    const bmi = bodyWeight / (heightInMeters * heightInMeters);
    setBmiResult(bmi.toFixed(1));

    if (bmi < 18.5) {
      setBmiCategory("Underweight");
      setBmiMessage("Your BMI is lower than the healthy range. Consider consulting a physician or dietitian.");
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      setBmiCategory("Normal");
      setBmiMessage("Great job! Your BMI is within the healthy weight range for your height.");
    } else if (bmi >= 25 && bmi <= 29.9) {
      setBmiCategory("Overweight");
      setBmiMessage("Your BMI is slightly above the healthy range. A balanced diet and regular exercise can help.");
    } else {
      setBmiCategory("Obese");
      setBmiMessage("Your BMI indicates obesity. We highly recommend consulting a healthcare provider for a personalized health plan.");
    }
  };

  const handleSymptomDetected = (data) => {
    const newSymptoms = [...new Set([...symptoms, ...data.symptoms])];
    setSymptoms(newSymptoms);

    if (newSymptoms.length === 0) {
      setRiskData(null);
    } else {
      setRiskData({
        riskLevel: data.riskLevel,
        alert: data.alert,
        probableConditions: data.probableConditions,
        analysis: data.analysis,
        emergencyAdvice: data.emergencyAdvice,
        dietaryAdvice: data.dietaryAdvice,
        specialist: data.specialist
      });
    }
  };

  const analyzeSymptoms = async () => {
    console.log("Analyze Symptoms Clicked. Current symptoms:", symptoms);
    if (symptoms.length === 0) {
      console.log("No symptoms available. Returning early.");
      return;
    }
    setIsAnalyzing(true);
    setHospitals(null);
    console.log("Starting analysis fetch to backend...");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: symptoms,
          age: age,
          gender: gender,
          painLevel: painLevel
        })
      });

      const data = await response.json();
      console.log("Data received from backend:", data);

      if (!response.ok || data.error) {
        throw new Error(data.error || "The AI backend encountered a parsing error.");
      }

      setRiskData({
        riskLevel: data.riskLevel,
        alert: data.alert,
        probableConditions: data.probableConditions,
        analysis: data.analysis,
        emergencyAdvice: data.emergencyAdvice,
        dietaryAdvice: data.dietaryAdvice,
        specialist: data.specialist
      });
      console.log("Response states successfully updated!");
    } catch (error) {
      console.error("Error fetching analysis in App.jsx:", error);
      alert(`Error fetching analysis: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
      console.log("Analysis workflow finished.");
    }
  };

  const findNearbyHospitals = async () => {
    if (!riskData || !riskData.probableConditions) return;

    setIsFindingHospitals(true);

    const fetchHospitals = async (lat, lng) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/find-hospitals`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: lat,
            longitude: lng,
            conditions: riskData.probableConditions,
          }),
        });

        if (!response.ok) throw new Error("Failed to search nearby hospitals.");

        const data = await response.json();
        setHospitals(data);
      } catch (error) {
        console.error("Error finding hospitals:", error);
        alert(error.message);
      } finally {
        setIsFindingHospitals(false);
      }
    };

    if (!navigator.geolocation) {
      alert("Geolocation is not supported. Using default location (Hyderabad).");
      fetchHospitals(17.3850, 78.4867);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchHospitals(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn("Location access denied or failed. Defaulting to Hyderabad.", error);
        fetchHospitals(17.3850, 78.4867);
      }
    );
  };

  const addSymptom = (e) => {
    e.preventDefault();
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      const newSymptoms = [...symptoms, currentSymptom.trim()];
      setSymptoms(newSymptoms);
      setCurrentSymptom("");
    }
  };

  const removeSymptom = (symptomToRemove) => {
    const newSymptoms = symptoms.filter(s => s !== symptomToRemove);
    setSymptoms(newSymptoms);
    if (newSymptoms.length === 0) {
      setRiskData(null);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("report", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/analyze-report`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.analysis) {
        setReportAnalysis(data.analysis);
        setActiveTab("Reports");
      }
    } catch (err) {
      console.error("Error uploading report:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Firebase Login Error: " + error.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
  };

  if (authLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0B0C10]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage handleLogin={handleLogin} />;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center p-8">

      {/* Main Glass Window */}
      <div className="w-full max-w-7xl h-full max-h-[850px] glass-panel rounded-2xl flex overflow-hidden text-white relative">

        {/* SIDEBAR */}
        <div className="w-64 glass-sidebar h-full flex flex-col flex-shrink-0">



          <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">

            <div className="mb-6">
              <div className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-3 px-3">Triage</div>
              <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/10 text-sm font-medium text-slate-100 cursor-pointer transition-colors shadow-inner">
                <Grid size={16} /> All Assessments
              </div>
            </div>

            <div className="mb-6">
              <div className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-3 px-3">Medical Records</div>
              <div className="flex flex-col gap-3 px-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf, image/*"
                />
                <button
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-sm font-medium transition-colors border border-blue-500/30 w-full justify-center shadow-inner disabled:opacity-50"
                >
                  {isUploading ? <RefreshCw size={16} className="animate-spin" /> : <Cloud size={16} />}
                  {isUploading ? "Processing AI..." : "Upload Report"}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* MAIN CONTENT DIV */}
        <div className="flex-1 flex flex-col h-full bg-[#181920]/40 relative">

          {/* Top Header Navigation */}
          <div className="flex items-center justify-between h-16 px-8 border-b border-white/5 bg-[#181920]/20">
            <div className="flex items-center gap-3">
              <h1 className="font-semibold tracking-wide text-lg">Medical Triage Dashboard</h1>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative cursor-pointer text-slate-400 hover:text-white transition-colors">
                <Bell size={18} />
              </div>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-7 h-7 rounded-full object-cover border border-white/20" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-400 to-indigo-500 border border-white/20"></div>
                )}
                <span className="text-sm font-medium text-slate-200">{user.displayName || "Patient"}</span>
                <button onClick={handleLogout} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-rose-400 ml-2 transition-colors">Logout</button>
              </div>
            </div>
          </div>

          {/* Scrolling Content Area */}
          <div className="flex-1 overflow-y-auto p-8 relative z-0">

            {/* Sub-Header Tabs */}
            <div className="flex gap-6 border-b border-white/5 pb-0 mb-8">
              {["Analysis", "History", "Specialists", "Reports", "BMI Calculator"].map((subtab) => (
                <div
                  key={subtab}
                  onClick={() => setActiveTab(subtab)}
                  className={`pb-3 text-sm font-medium cursor-pointer relative ${activeTab === subtab ? "text-white" : "text-slate-400 hover:text-slate-200 transition-colors"}`}
                >
                  {subtab}
                  {activeTab === subtab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-t-sm shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                  )}
                </div>
              ))}
            </div>

            {activeTab === "Analysis" && (
              <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 h-full p-8 overflow-y-auto">

                {/* Left Panel: Symptoms */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="glass-card p-6 h-full flex flex-col relative overflow-hidden rounded-xl">
                    <h2 className="text-md font-semibold text-slate-200 mb-6 flex items-center gap-2">
                      <Activity className="text-blue-400" size={18} />
                      Symptoms Input
                    </h2>

                    <div className="flex-1 flex flex-col">
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Age</p>
                          <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="e.g. 35"
                            className="w-full px-4 py-2 text-sm rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-blue-500/50 text-white placeholder-slate-500 transition-all font-medium"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Gender</p>
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-4 py-2 text-sm rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-blue-500/50 text-white placeholder-slate-500 transition-all font-medium appearance-none"
                          >
                            <option value="">Select...</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 border-t border-white/5 pt-5">Add symptom</p>

                      <form onSubmit={addSymptom} className="mb-5 flex gap-2">
                        <input
                          type="text"
                          value={currentSymptom}
                          onChange={(e) => setCurrentSymptom(e.target.value)}
                          placeholder="e.g., Nausea"
                          className="flex-1 px-4 py-2 text-sm rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-blue-500/50 text-white placeholder-slate-500 transition-all font-medium"
                        />
                        <button
                          type="submit"
                          disabled={!currentSymptom.trim()}
                          className="bg-blue-600 text-white p-2 rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus size={18} />
                        </button>
                      </form>

                      <div className="space-y-2 mb-8 max-h-[180px] overflow-y-auto pr-1">
                        {symptoms.length === 0 ? (
                          <p className="text-slate-500 text-xs italic text-center py-4 bg-white/5 rounded-lg border border-white/5">No symptoms added.</p>
                        ) : (
                          symptoms.map((symptom, idx) => (
                            <div key={idx} className="p-2.5 px-4 rounded-lg flex justify-between items-center bg-white/5 border border-white/5 hover:bg-white/10 transition-all group shadow-sm">
                              <span className="font-medium text-slate-200 text-sm">{symptom}</span>
                              <button
                                onClick={() => removeSymptom(symptom)}
                                className="text-slate-500 hover:text-red-400 rounded-full hover:bg-red-400/10 p-1 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="mb-8">
                        <div className="flex justify-between mb-3">
                          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Pain Severity</span>
                          <span className="text-xs font-bold text-red-400">{painLevel}/10</span>
                        </div>
                        <div className="relative pt-1">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={painLevel}
                            onChange={(e) => setPainLevel(parseInt(e.target.value))}
                            className="w-full h-8 rounded-lg appearance-none cursor-pointer"
                            style={{ background: "transparent" }}
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mt-2 px-1">
                            <span>Mild</span>
                            <span>Moderate</span>
                            <span>Severe</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          console.log("Button explicit click fired.");
                          analyzeSymptoms();
                        }}
                        disabled={isAnalyzing || symptoms.length === 0}
                        className="w-full mt-auto py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group border border-blue-500/50 disabled:opacity-50"
                      >
                        {isAnalyzing ? <RefreshCw size={18} className="animate-spin text-white" /> : "Next Step (Analyze)"}
                      </button>

                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 flex flex-col gap-6 h-full overflow-y-auto">

                  {!riskData ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-60 m-auto text-center h-full w-full">
                      <Activity size={64} className="text-blue-500 mb-6 animate-pulse" />
                      <h3 className="text-2xl font-bold text-slate-200 mb-3">Awaiting Symptoms</h3>
                      <p className="text-slate-400 max-w-md mx-auto">
                        Please enter your current symptoms using the panel on the left and click "Next Step (Analyze)" to get a clinical evaluation and dietary suggestions.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col lg:grid lg:grid-cols-8 gap-6 h-full p-8 overflow-y-auto">
                      <div className="lg:col-span-5 flex flex-col gap-4">

                        {/* Alert Banner */}
                        <div className={`rounded-xl p-6 text-white relative overflow-hidden shadow-xl border border-white/10 group ${riskData.riskLevel === "HIGH" ? "bg-gradient-to-br from-red-600/80 to-rose-700/80" : riskData.riskLevel === "MODERATE" ? "bg-gradient-to-br from-orange-500/80 to-red-500/80" : "bg-gradient-to-br from-emerald-600/80 to-teal-700/80"}`}>
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
                          <div className="flex flex-col relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="animate-pulse opacity-80" size={20} />
                              <span className="text-white/80 font-bold tracking-widest text-[10px] uppercase">Alert Level</span>
                            </div>
                            <h2 className="text-3xl font-extrabold tracking-tight mb-1 drop-shadow-lg">{riskData.riskLevel} RISK</h2>
                            <p className="text-sm text-white/90 font-medium">{riskData.alert}</p>
                          </div>
                        </div>

                        {/* Conditions Card */}
                        <div className="glass-card p-6 rounded-xl flex-1">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 border-b border-white/5 pb-3">Probable Conditions</h3>
                          <div className="space-y-5">
                            {riskData.probableConditions.length === 0 ? (
                              <p className="text-sm text-slate-400 italic">Submit symptoms to view condition probabilities.</p>
                            ) : riskData.probableConditions.map((condition, idx) => (
                              <div key={idx}>
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="font-semibold text-slate-200">{condition.name}</span>
                                </div>
                                <div className="w-full bg-black/40 rounded-full h-2.5 flex items-center relative overflow-hidden border border-white/5">
                                  <div className={`bg-${condition.color}-500 h-2.5 rounded-full relative z-10 transition-all duration-1000 shadow-lg`} style={{ width: `${condition.percentage}%` }}></div>
                                  <span className="absolute right-0 top-0 bottom-0 text-[9px] items-center flex font-bold pr-2 z-20 text-white" style={{ left: `calc(${condition.percentage}% - 30px)` }}>{condition.percentage}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Analysis Summary */}
                        <div className="glass-card p-5 rounded-xl relative overflow-hidden bg-white/5 border border-white/10">
                          <h3 className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2 flex items-center gap-2">
                            Clinical Analysis
                          </h3>
                          <p className="text-slate-300 leading-relaxed font-medium text-[13px]">
                            {riskData.analysis}
                          </p>
                        </div>

                        {/* Dietary Advice */}
                        {riskData.dietaryAdvice && (
                          <div className="glass-card p-5 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                            <h3 className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-4 flex items-center gap-2">
                              Dietary Suggestions
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                                <h4 className="text-emerald-400 text-[10px] font-bold uppercase mb-2 tracking-wider">Recommended</h4>
                                <ul className="text-slate-300 text-xs space-y-1.5">
                                  {riskData.dietaryAdvice.foodsToEat?.map((food, i) => (
                                    <li key={i} className="flex items-start gap-1.5"><span className="text-emerald-500 font-bold">?</span> <span className="mt-0.5">{food}</span></li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                <h4 className="text-red-400 text-[10px] font-bold uppercase mb-2 tracking-wider">Limit / Avoid</h4>
                                <ul className="text-slate-300 text-xs space-y-1.5">
                                  {riskData.dietaryAdvice.foodsToAvoid?.map((food, i) => (
                                    <li key={i} className="flex items-start gap-1.5"><span className="text-red-500 font-bold">?</span> <span className="mt-0.5">{food}</span></li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Right Panel */}
                      <div className="lg:col-span-3 flex flex-col gap-4">

                        {/* Specialist Card */}
                        <div className="glass-card p-6 flex flex-col items-center bg-white/5 rounded-xl text-center border border-white/10">
                          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-6 w-full text-left">Specialist</h3>

                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500/30 mb-4 shadow-lg shadow-blue-500/20">
                            <Stethoscope size={28} className="text-blue-400" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-100 mb-1">Recommended Care:</h4>
                          <p className="text-blue-400 font-extrabold text-lg mb-6 tracking-wide drop-shadow-md">{riskData.specialist?.role || "General Medical Professional"}</p>

                          <button
                            onClick={(e) => { e.preventDefault(); findNearbyHospitals(); }}
                            disabled={isFindingHospitals}
                            className="w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/30 transition-all border border-blue-500/50 flex items-center justify-center gap-2"
                          >
                            {isFindingHospitals ? <RefreshCw size={14} className="animate-spin" /> : <MapPin size={14} />}
                            {isFindingHospitals ? "Scanning Local Area..." : "Find Nearby Hospitals"}
                          </button>

                          {/* Hospital Results */}
                          {hospitals && hospitals.length > 0 && (
                            <div className="mt-6 w-full text-left space-y-3">
                              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 pb-2">Top Local Matches</h4>
                              {hospitals.map((hospital, idx) => (
                                <div key={idx} className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                                  <h5 className="text-xs font-bold text-slate-200 mb-1">{hospital.name}</h5>
                                  <p className="text-[10px] text-slate-400 mb-1 leading-snug">{hospital.specialty}</p>
                                  <div className="flex justify-between items-center mt-3">
                                    <span className="text-[10px] text-blue-400 font-semibold">{hospital.distanceStr}</span>
                                    <a
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.mapsQuery)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[10px] font-bold text-white bg-blue-500/20 hover:bg-blue-500/40 px-2 py-1 rounded border border-blue-500/30 transition-colors"
                                    >
                                      View Map
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Emergency Advice Card */}
                        <div className="glass-card p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 flex flex-col mt-auto">
                          <div className="flex items-center gap-2 mb-3">
                            <PhoneCall size={16} className="text-red-400" />
                            <h3 className="text-[11px] font-bold uppercase text-red-200 tracking-wider">Emergency Advice</h3>
                          </div>
                          <p className="text-slate-300 font-medium text-xs leading-relaxed border-l-2 border-red-500/50 pl-3">
                            {riskData.emergencyAdvice}
                          </p>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === "History" && (
              <div className="flex flex-col items-center justify-center py-20 opacity-60">
                <Box size={48} className="text-slate-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No past history found.</h3>
                <p className="text-sm text-slate-400">Complete an assessment to log it here.</p>
              </div>
            )}

            {/* Specialists Tab */}
            {activeTab === "Specialists" && (
              <div className="flex flex-col items-center justify-center py-20 opacity-60">
                <Stethoscope size={48} className="text-slate-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">Specialist Directory</h3>
                <p className="text-sm text-slate-400">Directory access requires a completed clinical assessment.</p>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "Reports" && (
              <div className="flex flex-col items-center justify-center py-10 w-full h-full overflow-hidden">
                {reportAnalysis ? (
                  <div className="w-full max-w-4xl h-full max-h-[600px] glass-card p-8 rounded-2xl relative overflow-y-auto bg-white/5 border border-white/10 text-left">
                    <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2 sticky top-0 bg-[#181920]/80 backdrop-blur-md pb-4 pt-1 z-10">
                      <Cloud className="text-blue-400" size={24} />
                      AI Simplification Results
                    </h3>
                    <div className="text-slate-300 leading-relaxed font-medium text-sm whitespace-pre-wrap">
                      {reportAnalysis}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center opacity-60">
                    <Cloud size={48} className="text-slate-500 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">No Reports Analyzed</h3>
                    <p className="text-sm text-slate-400">Upload a report from the sidebar to view AI analysis.</p>
                  </div>
                )}
              </div>
            )}

            {/* BMI Calculator Tab */}
            {activeTab === "BMI Calculator" && (
              <div className="flex flex-col items-center justify-start py-10 w-full h-full overflow-y-auto">
                <div className="w-full max-w-lg glass-card p-8 rounded-2xl relative bg-white/5 border border-white/10 text-left shadow-2xl mb-10">

                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Activity size={24} className="text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-100 tracking-wide">BMI Calculator</h3>
                      <p className="text-xs text-slate-400">Determine your healthy body mass index.</p>
                    </div>
                  </div>

                  <form onSubmit={calculateBMI} className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Gender</p>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full px-2 py-3 text-sm rounded-xl bg-black/30 border border-white/10 focus:outline-none focus:border-blue-500/50 text-white placeholder-slate-600 transition-all font-medium text-center appearance-none"
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Height (cm)</p>
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder="175"
                          required
                          className="w-full px-4 py-3 text-lg rounded-xl bg-black/30 border border-white/10 focus:outline-none focus:border-blue-500/50 text-white placeholder-slate-600 transition-all font-medium text-center"
                        />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Weight (kg)</p>
                        <input
                          type="number"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="70"
                          required
                          className="w-full px-4 py-3 text-lg rounded-xl bg-black/30 border border-white/10 focus:outline-none focus:border-blue-500/50 text-white placeholder-slate-600 transition-all font-medium text-center"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!height || !weight}
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-500/30 transition-all border border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Calculate BMI
                    </button>
                  </form>

                  {/* Results Section */}
                  {bmiResult && (
                    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-1">Your Result</p>

                      <div className="flex items-end gap-2 mb-2">
                        <span className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">{bmiResult}</span>
                      </div>

                      <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-md mb-4 ${bmiCategory === "Underweight" ? "bg-blue-500/10 border-blue-500/30 text-blue-400" :
                        bmiCategory === "Normal" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                          bmiCategory === "Overweight" ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" :
                            "bg-red-500/10 border-red-500/30 text-red-400"
                        }`}>
                        {bmiCategory}
                      </div>

                      <p className="text-center text-[13px] font-medium text-slate-300 leading-relaxed px-4 border-t border-white/5 pt-4 mb-6">
                        {bmiMessage}
                      </p>

                      {/* BMI Scale Reference */}
                      <div className="w-full p-4 rounded-xl bg-black/20 border border-white/5 mt-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">BMI Scale Reference</h4>
                        <div className="flex w-full h-2 rounded-full overflow-hidden mb-2">
                          <div className="bg-blue-400 h-full" style={{ width: '25%' }}></div>
                          <div className="bg-emerald-400 h-full" style={{ width: '35%' }}></div>
                          <div className="bg-yellow-400 h-full" style={{ width: '20%' }}></div>
                          <div className="bg-red-400 h-full" style={{ width: '20%' }}></div>
                        </div>
                        <div className="flex justify-between text-[9px] font-bold text-slate-500">
                          <span className="text-blue-400/80">&lt; 18.5</span>
                          <span className="text-emerald-400/80">18.5 - 24.9</span>
                          <span className="text-yellow-400/80">25 - 29.9</span>
                          <span className="text-red-400/80">30+</span>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              </div>
            )}

          </div>

        </div>
      </div>
      <Chatbot onSymptomDetected={handleSymptomDetected} />
    </div>
  );
}

export default App;
