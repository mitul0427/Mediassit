import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, CalendarDays, CheckCircle2 } from 'lucide-react';

const INITIAL_MESSAGE = {
    id: 1,
    text: "Hello, I am MediAssist AI. How can I help you today? Please describe any symptoms you are experiencing.",
    sender: 'ai',
    timestamp: new Date().toISOString()
};

export default function Chatbot({ onSymptomDetected }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [bookingState, setBookingState] = useState(null); // 'prompted' | 'confirmed'
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI processing time
        setTimeout(() => {
            processUserMessage(userMessage.text);
        }, 1200);
    };

    const processUserMessage = async (text) => {
        setIsTyping(false);
        const lowerText = text.toLowerCase();

        // Handle Booking flow
        if (bookingState === 'prompted' && (lowerText.includes('yes') || lowerText.includes('book') || lowerText.includes('sure'))) {
            setBookingState('confirmed');
            addAiMessage("Great. I have booked an appointment with the recommended specialist for tomorrow at 10:00 AM. 📅");
            return;
        }

        if (lowerText.includes('appointment') || lowerText.includes('book') || lowerText.includes('doctor')) {
            setBookingState('prompted');
            addAiMessage("Would you like me to schedule an appointment with the recommended specialist for you?");
            return;
        }

        // Basic symptom keyword extraction for the API
        const commonSymptoms = ["headache", "chest pain", "shortness of breath", "dizziness", "nausea", "cough", "fever", "fatigue", "muscle aches", "heartburn", "chest tightness"];
        const detected = commonSymptoms.filter(s => lowerText.includes(s));

        if (detected.length > 0) {
            setIsTyping(true);
            try {
                // Fetch analysis from our SQLite-backed Express Server
                const response = await fetch('http://localhost:3000/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ symptoms: detected })
                });

                const diagnosisData = await response.json();
                setIsTyping(false);

                if (diagnosisData.error || diagnosisData.probableConditions.length === 0) {
                    addAiMessage("I've carefully noted your symptoms, but I cannot definitively map them to a specific condition right now. Please monitor your health closely and consult a real doctor if they persist.");
                    return;
                }

                // Pass data up to alter the main dashboard
                if (onSymptomDetected) {
                    onSymptomDetected({
                        symptoms: detected,
                        ...diagnosisData
                    });
                }

                addAiMessage(`I've noted that you are experiencing: ${detected.join(', ')}. ${diagnosisData?.analysis || ''} ${diagnosisData?.riskLevel === 'HIGH' ? '⚠️ ' + diagnosisData.emergencyAdvice : ''}`);

                setTimeout(() => {
                    addAiMessage("I've updated your dashboard with a detailed preliminary analysis and specialist recommendation. Let me know if you would like me to book an appointment for you.");
                }, 1500);

            } catch (error) {
                setIsTyping(false);
                console.error("Failed to fetch from backend:", error);
                addAiMessage("I'm currently having trouble connecting to my medical database. Please try again later.");
            }

        } else {
            addAiMessage("I’m sorry, I didn't quite catch any specific symptoms in your message. Could you please provide more details like 'I have a headache' or 'experiencing chest pain'?");
        }
    };

    const addAiMessage = (text) => {
        setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            text,
            sender: 'ai',
            timestamp: new Date().toISOString()
        }]);
    }

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 w-16 h-16 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-blue-700 hover:scale-105 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <MessageSquare size={28} />
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-6 right-6 w-full max-w-[380px] h-[580px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right z-50 border border-slate-100 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex justify-between items-center text-white shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Bot size={22} />
                        </div>
                        <div>
                            <h3 className="font-bold text-[15px]">MediAssist AI</h3>
                            <p className="text-blue-100 text-xs flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.sender === 'user' ? 'bg-slate-200 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>
                                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>

                                <div className={`p-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${msg.sender === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-sm'
                                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex gap-2 max-w-[85%]">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-blue-100 text-blue-600">
                                    <Bot size={16} />
                                </div>
                                <div className="p-4 rounded-2xl bg-white border border-slate-100 rounded-tl-sm flex gap-1 items-center">
                                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Action Chips (Booking Confirmed state indicator) */}
                {bookingState === 'confirmed' && (
                    <div className="px-4 py-2 bg-green-50 border-t border-green-100 flex items-center gap-2 text-green-700 text-xs font-semibold">
                        <CheckCircle2 size={16} className="text-green-500" /> Appointment Confirmed
                    </div>
                )}

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your symptoms..."
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-[14px] text-slate-700 placeholder-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isTyping}
                        className="w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={18} className="ml-0.5" />
                    </button>
                </form>
            </div>
        </>
    );
}
