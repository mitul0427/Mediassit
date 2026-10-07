export const SYMPTOM_DATABASE = {
    "chest pain": {
        riskLevel: "HIGH",
        probableConditions: [
            { name: "Acute Coronary Syndrome", percentage: 75, color: "red" },
            { name: "Panic Attack", percentage: 15, color: "orange" },
            { name: "GERD", percentage: 10, color: "blue" }
        ],
        alert: "Urgent Care Required",
        specialist: {
            name: "Dr. Sarah Mitchell",
            role: "Cardiologist",
            experience: "15+ Years Experience",
            rating: 4.8,
            img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150&h=150"
        },
        emergencyAdvice: "Seek immediate medical attention. Call 911 or go to the nearest ER.",
        analysis: "Based on reported chest pain, there is a high-likelihood of Acute Coronary Syndrome requiring immediate attention."
    },
    "headache": {
        riskLevel: "MODERATE",
        probableConditions: [
            { name: "Migraine", percentage: 60, color: "orange" },
            { name: "Tension Headache", percentage: 30, color: "blue" },
            { name: "Dehydration", percentage: 10, color: "green" }
        ],
        alert: "Monitor Symptoms",
        specialist: {
            name: "Dr. James Wilson",
            role: "Neurologist",
            experience: "12+ Years Experience",
            rating: 4.9,
            img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150"
        },
        emergencyAdvice: "If headache is sudden and severe (thunderclap), accompanied by fever or stiff neck, seek emergency care.",
        analysis: "A persistent headache often indicates a migraine or tension issue. Hydration and rest are recommended while monitoring."
    },
    "shortness of breath": {
        riskLevel: "HIGH",
        probableConditions: [
            { name: "Asthma Exacerbation", percentage: 50, color: "orange" },
            { name: "Pulmonary Embolism", percentage: 30, color: "red" },
            { name: "Anxiety", percentage: 20, color: "blue" }
        ],
        alert: "Urgent Care Required",
        specialist: {
            name: "Dr. Emily Chen",
            role: "Pulmonologist",
            experience: "10+ Years Experience",
            rating: 4.7,
            img: "https://images.unsplash.com/photo-1594824436998-dd40d41be29c?auto=format&fit=crop&q=80&w=150&h=150"
        },
        emergencyAdvice: "If breathing difficulty is severe or accompanied by chest pain, seek immediate emergency care.",
        analysis: "Shortness of breath can be a critical primary symptom of respiratory or cardiac distress."
    }
};

export const detectSymptoms = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    const detected = [];

    Object.keys(SYMPTOM_DATABASE).forEach(symptom => {
        if (lowerInput.includes(symptom)) {
            detected.push(symptom);
        }
    });

    return detected;
};

export const aggregateSymptomData = (symptomKeys) => {
    if (!symptomKeys || symptomKeys.length === 0) return null;

    // For simplicity, we'll base the primary analysis on the most "severe" symptom
    // or just the first one matched.
    let primarySymptom = symptomKeys[0];

    // Prioritize HIGH risk symptoms
    for (const key of symptomKeys) {
        if (SYMPTOM_DATABASE[key].riskLevel === "HIGH") {
            primarySymptom = key;
            break;
        }
    }

    return SYMPTOM_DATABASE[primarySymptom];
};
