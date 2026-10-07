const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'medical_data.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

const runSchema = async () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // 1. Conditions Table
            db.run(`CREATE TABLE IF NOT EXISTS Conditions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        riskLevel TEXT NOT NULL,
        alert TEXT NOT NULL,
        analysis TEXT NOT NULL,
        emergencyAdvice TEXT NOT NULL
    )`);

            // 2. Specialists Table
            db.run(`CREATE TABLE IF NOT EXISTS Specialists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conditionId INTEGER,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        experience TEXT NOT NULL,
        rating REAL,
        img TEXT,
        FOREIGN KEY (conditionId) REFERENCES Conditions(id)
    )`);

            // 3. Symptoms Table
            db.run(`CREATE TABLE IF NOT EXISTS Symptoms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
    )`);

            // 4. ConditionSymptoms Junction Table (associates symptoms to conditions with a typical percentage weight)
            db.run(`CREATE TABLE IF NOT EXISTS ConditionSymptoms (
        conditionId INTEGER,
        symptomId INTEGER,
        percentage INTEGER,
        color TEXT,
        FOREIGN KEY (conditionId) REFERENCES Conditions(id),
        FOREIGN KEY (symptomId) REFERENCES Symptoms(id),
        PRIMARY KEY (conditionId, symptomId)
    )`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
};

const insertData = () => {
    // Sample Data to preload
    const conditions = [
        {
            name: "Acute Coronary Syndrome",
            riskLevel: "HIGH",
            alert: "Urgent Care Required",
            analysis: "Based on symptoms like chest pain, there is a high-likelihood of an acute cardiac event requiring immediate attention.",
            emergencyAdvice: "Seek immediate medical attention. Call 911 or go to the nearest ER.",
            specialist: { name: "Dr. Sarah Mitchell", role: "Cardiologist", experience: "15+ Years Experience", rating: 4.8, img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150&h=150" },
            symptoms: [
                { name: "chest pain", percentage: 85, color: "red" },
                { name: "shortness of breath", percentage: 60, color: "orange" },
                { name: "dizziness", percentage: 40, color: "yellow" }
            ]
        },
        {
            name: "Migraine",
            riskLevel: "MODERATE",
            alert: "Monitor Symptoms",
            analysis: "A persistent, severe headache often indicates a migraine. Rest in a dark, quiet room is recommended.",
            emergencyAdvice: "If headache is sudden and maximum severity (thunderclap), seek emergency care.",
            specialist: { name: "Dr. James Wilson", role: "Neurologist", experience: "12+ Years Experience", rating: 4.9, img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150" },
            symptoms: [
                { name: "headache", percentage: 90, color: "orange" },
                { name: "nausea", percentage: 50, color: "yellow" },
                { name: "dizziness", percentage: 30, color: "blue" }
            ]
        },
        {
            name: "Asthma Exacerbation",
            riskLevel: "HIGH",
            alert: "Urgent Care Required",
            analysis: "Severe breathing difficulty suggests an asthma attack or respiratory distress.",
            emergencyAdvice: "Use prescribed rescue inhaler. If breathing does not improve, seek immediate emergency care.",
            specialist: { name: "Dr. Emily Chen", role: "Pulmonologist", experience: "10+ Years Experience", rating: 4.7, img: "https://images.unsplash.com/photo-1594824436998-dd40d41be29c?auto=format&fit=crop&q=80&w=150&h=150" },
            symptoms: [
                { name: "shortness of breath", percentage: 80, color: "red" },
                { name: "cough", percentage: 65, color: "orange" },
                { name: "chest tightness", percentage: 50, color: "yellow" }
            ]
        },
        {
            name: "Gastroesophageal Reflux Disease (GERD)",
            riskLevel: "LOW",
            alert: "Routine Checkup Suggested",
            analysis: "Symptoms suggest acid reflux or GERD. Dietary modifications may be necessary.",
            emergencyAdvice: "If pain radiates to the arm or jaw, or is accompanied by severe sweating, rule out cardiac issues immediately.",
            specialist: { name: "Dr. Alan Roberts", role: "Gastroenterologist", experience: "20+ Years Experience", rating: 4.6, img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150&h=150" },
            symptoms: [
                { name: "chest pain", percentage: 40, color: "blue" },
                { name: "heartburn", percentage: 85, color: "orange" },
                { name: "nausea", percentage: 30, color: "green" }
            ]
        },
        {
            name: "Influenza (Flu)",
            riskLevel: "MODERATE",
            alert: "Monitor Symptoms",
            analysis: "A combination of fever, fatigue, and muscle aches strongly points to a viral illness such as the flu.",
            emergencyAdvice: "If experiencing severe difficulty breathing or ongoing chest pressure, seek emergency care.",
            specialist: { name: "Dr. Maria Garcia", role: "General Practitioner", experience: "8+ Years Experience", rating: 4.7, img: "https://images.unsplash.com/photo-1594824436998-dd40d41be29c?auto=format&fit=crop&q=80&w=150&h=150" },
            symptoms: [
                { name: "fever", percentage: 85, color: "orange" },
                { name: "fatigue", percentage: 70, color: "yellow" },
                { name: "muscle aches", percentage: 60, color: "blue" },
                { name: "cough", percentage: 50, color: "green" }
            ]
        }
    ];

    conditions.forEach(cond => {
        db.run(`INSERT OR IGNORE INTO Conditions (name, riskLevel, alert, analysis, emergencyAdvice) VALUES (?, ?, ?, ?, ?)`,
            [cond.name, cond.riskLevel, cond.alert, cond.analysis, cond.emergencyAdvice], function (err) {
                if (err) return console.error(err.message);
                const conditionId = this.lastID || '(SELECT id FROM Conditions WHERE name = ?)';

                let cid = this.lastID;

                // If it was ignored (already exists), we need to get the ID.
                if (cid === 0) {
                    db.get(`SELECT id FROM Conditions WHERE name = ?`, [cond.name], (err, row) => {
                        if (row) {
                            insertSpecialistAndSymptoms(row.id, cond);
                        }
                    });
                } else {
                    insertSpecialistAndSymptoms(cid, cond);
                }
            });
    });
};

const insertSpecialistAndSymptoms = (conditionId, cond) => {
    // Insert Specialist
    db.run(`INSERT INTO Specialists (conditionId, name, role, experience, rating, img) VALUES (?, ?, ?, ?, ?, ?)`,
        [conditionId, cond.specialist.name, cond.specialist.role, cond.specialist.experience, cond.specialist.rating, cond.specialist.img]
    );

    // Insert Symptoms & Link them
    cond.symptoms.forEach(sym => {
        db.run(`INSERT OR IGNORE INTO Symptoms (name) VALUES (?)`, [sym.name], function (err) {
            db.get(`SELECT id FROM Symptoms WHERE name = ?`, [sym.name], (err, row) => {
                if (row) {
                    db.run(`INSERT OR IGNORE INTO ConditionSymptoms (conditionId, symptomId, percentage, color) VALUES (?, ?, ?, ?)`,
                        [conditionId, row.id, sym.percentage, sym.color]);
                }
            });
        });
    });
};

const seedDatabase = async () => {
    console.log("Setting up database schema...");
    await runSchema();
    console.log("Inserting seed data...");
    insertData();
    console.log("Database seeded successfully!");

    // Close DB after a short delay to ensure async inserts finish
    setTimeout(() => {
        db.close();
    }, 2000);
}

seedDatabase();
