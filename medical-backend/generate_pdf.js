const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Initialize PDF Document with page buffering enabled (for running page numbers)
const doc = new PDFDocument({ margin: 50, bufferPages: true });
const outputFilePath = path.join(__dirname, '..', 'MediAssist_AI_Project_Documentation.pdf');
doc.pipe(fs.createWriteStream(outputFilePath));

// Visual Palette definitions
const colors = {
  dark: '#0B0C10',
  blue: '#2563EB',
  grayText: '#374151',
  lightGray: '#F3F4F6',
  border: '#E5E7EB',
  redBorder: '#EF4444',
  redBg: '#FEE2E2',
  yellowBorder: '#F59E0B',
  yellowBg: '#FEF3C7',
  blueBorder: '#3B82F6',
  blueBg: '#DBEAFE',
  white: '#FFFFFF'
};

// -------------------------------------------------------------
// HELPER DRAWING FUNCTIONS
// -------------------------------------------------------------

function addHeader(title, subtitle) {
  doc.font('Helvetica-Bold').fontSize(14).fillColor(colors.blue).text(title, { lineGap: 2 });
  if (subtitle) {
    doc.font('Helvetica-Oblique').fontSize(10).fillColor(colors.grayText).text(subtitle, { lineGap: 10 });
  }
  doc.moveDown(0.5);
}

function addH1(text) {
  // Ensure we don't page break immediately after a header
  if (doc.y > 680) {
    doc.addPage();
  }
  doc.moveDown(1.5);
  doc.font('Helvetica-Bold').fontSize(20).fillColor(colors.dark).text(text, { lineGap: 4 });
  // Draw an underline bar
  doc.strokeColor(colors.blue).lineWidth(2).moveTo(50, doc.y).lineTo(562, doc.y).stroke();
  doc.moveDown(1);
}

function addH2(text) {
  if (doc.y > 700) {
    doc.addPage();
  }
  doc.moveDown(1.2);
  doc.font('Helvetica-Bold').fontSize(15).fillColor(colors.blue).text(text, { lineGap: 3 });
  doc.moveDown(0.6);
}

function addH3(text) {
  if (doc.y > 720) {
    doc.addPage();
  }
  doc.moveDown(0.8);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(colors.dark).text(text, { lineGap: 2 });
  doc.moveDown(0.4);
}

function addParagraph(text) {
  doc.font('Helvetica').fontSize(10).fillColor(colors.grayText).lineGap(4).text(text, { align: 'justify' });
  doc.moveDown(0.8);
}

function addBullet(text) {
  doc.font('Helvetica').fontSize(10).fillColor(colors.grayText).lineGap(3);
  const indent = 20;
  const bulletSymbol = '•  ';
  doc.text(bulletSymbol + text, {
    indent: -indent,
    paragraphGap: 5,
    align: 'left'
  });
}

function startBulletList() {
  doc.x += 20; // Indent list
}

function endBulletList() {
  doc.x -= 20; // Reset indent
  doc.moveDown(0.8);
}

function addCodeBlock(code) {
  doc.moveDown(0.5);
  const startY = doc.y;
  
  // Calculate text height to draw background
  doc.font('Courier').fontSize(8.5).fillColor(colors.dark).lineGap(2);
  const textHeight = doc.heightOfString(code, { width: 490 });
  const padding = 10;
  
  // Draw background box
  doc.rect(50, startY, 512, textHeight + (padding * 2))
     .fillAndStroke(colors.lightGray, colors.border);
     
  // Draw code text
  doc.fillColor(colors.dark)
     .text(code, 50 + padding, startY + padding, { width: 492 });
     
  doc.x = 50; // reset x margin
  doc.y = startY + textHeight + (padding * 2);
  doc.moveDown(1);
}

function addAlertBlock(text, type = 'NOTE') {
  doc.moveDown(0.5);
  const startY = doc.y;
  
  let borderColor = colors.blueBorder;
  let bgColor = colors.blueBg;
  let title = 'NOTE';
  
  if (type === 'WARNING') {
    borderColor = colors.yellowBorder;
    bgColor = colors.yellowBg;
    title = 'WARNING';
  } else if (type === 'DANGER' || type === 'DISCLAIMER') {
    borderColor = colors.redBorder;
    bgColor = colors.redBg;
    title = 'DISCLAIMER';
  }
  
  doc.font('Helvetica-Bold').fontSize(9).lineGap(3);
  const titleHeight = doc.heightOfString(title, { width: 480 });
  doc.font('Helvetica').fontSize(9.5).lineGap(4);
  const contentHeight = doc.heightOfString(text, { width: 480 });
  
  const boxHeight = titleHeight + contentHeight + 25;
  
  // Draw background box
  doc.rect(50, startY, 512, boxHeight).fill(bgColor);
  
  // Draw left accent bar
  doc.rect(50, startY, 4, boxHeight).fill(borderColor);
  
  // Draw title
  doc.fillColor(colors.dark)
     .font('Helvetica-Bold')
     .fontSize(9)
     .text(title, 65, startY + 10);
     
  // Draw content
  doc.fillColor(colors.grayText)
     .font('Helvetica')
     .fontSize(9.5)
     .text(text, 65, startY + 10 + titleHeight + 5, { width: 480 });
     
  doc.x = 50;
  doc.y = startY + boxHeight;
  doc.moveDown(1.2);
}

// -------------------------------------------------------------
// DOCUMENT CONTENT
// -------------------------------------------------------------

// --- PAGE 1: COVER PAGE ---
doc.rect(0, 0, 612, 792).fill(colors.dark);

// Decorative top gradient or colored strip
doc.rect(0, 0, 612, 20).fill(colors.blue);

// Cover Page Text
doc.fillColor(colors.white);
doc.font('Helvetica-Bold').fontSize(40).text('MediAssist AI', 50, 200, { lineGap: 10 });
doc.font('Helvetica').fontSize(18).fillColor(colors.blue).text('Intelligent Medical Triage & Diagnostics Dashboard', { lineGap: 5 });
doc.rect(50, doc.y + 10, 150, 3).fill(colors.white);

doc.moveDown(3);
doc.font('Helvetica-Bold').fontSize(14).fillColor(colors.white).text('Technical Architecture & System Documentation', { lineGap: 5 });
doc.font('Helvetica').fontSize(11).fillColor('#9CA3AF').text('A comprehensive reference manual detailing features, databases, APIs, code logic, and execution parameters.', { width: 400, lineGap: 4 });

// Cover Footer Metadata
doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.white).text('Prepared by:', 50, 600);
doc.font('Helvetica').fontSize(10).fillColor('#D1D5DB').text('Antigravity AI Coding Assistant', 50, 615);

doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.white).text('Date:', 280, 600);
doc.font('Helvetica').fontSize(10).fillColor('#D1D5DB').text('May 21, 2026', 280, 615);

doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.white).text('Version:', 450, 600);
doc.font('Helvetica').fontSize(10).fillColor('#D1D5DB').text('1.0.0 (Release)', 450, 615);


// --- PAGE 2: TABLE OF CONTENTS & EXECUTIVE SUMMARY ---
doc.addPage();

addH1('Table of Contents');

const tocItems = [
  { num: '1', title: 'Executive Summary & Disclaimer', page: '2' },
  { num: '2', title: 'System Architecture & Directory Map', page: '3' },
  { num: '3', title: 'Frontend Technologies & Animations', page: '4' },
  { num: '4', title: 'AI Symptom Triage & Geolocation Systems', page: '5' },
  { num: '5', title: 'Medical Report Uploads & BMI Calculator', page: '6' },
  { num: '6', title: 'API Endpoints & Integration Schemas', page: '7' },
  { num: '7', title: 'Deployment, Orchestration & Troubleshooting', page: '8' }
];

doc.moveDown(0.5);
tocItems.forEach(item => {
  const dots = '.'.repeat(70 - item.title.length);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.dark).text(item.num + '. ' + item.title, { continued: true });
  doc.font('Helvetica').fillColor('#9CA3AF').text(dots, { continued: true });
  doc.font('Helvetica-Bold').fillColor(colors.blue).text('  Page ' + item.page);
  doc.moveDown(0.8);
});

addH1('1. Executive Summary & Disclaimer');
addParagraph('MediAssist AI is a premium full-stack medical helper designed to guide users through basic health assessments. Built as a dual-component architecture consisting of a React-Vite dashboard and an Express API server, the system harnesses Google Gemini AI for advanced medical analytics, report translation, and healthcare navigation.');
addParagraph('By bridging the gap between complicated clinical report structures and patients, MediAssist AI decreases search fatigue and empowers individuals to take informed steps toward health resolution. It streamlines the initial pre-care stage, suggesting specific doctors and physical clinics based on real-time parameters.');

addAlertBlock(
  'MediAssist AI is not a registered medical diagnosis platform and does not possess professional medical certification. The system is designed to provide informative triage and recommendation references based on patient metrics. In emergency circumstances, contact local emergency services immediately.',
  'DISCLAIMER'
);


// --- PAGE 3: SYSTEM ARCHITECTURE & DIRECTORY MAP ---
doc.addPage();

addH1('2. System Architecture & Directory Map');
addParagraph('The application executes in a clean Client-Server configuration. The React frontend interacts with the Express server via asynchronous HTTP requests. The backend leverages local SQLite databases for persistence and forwards complex natural language processing tasks to Google Generative AI.');

addH2('System Architecture Flow');
const archDiagram = 
`+-------------------------------------------------------------------------+
|                          Unauthenticated Client                         |
|                           [Landing Page Portal]                         |
+------------------------------------|------------------------------------+
                                     | Firebase Google SSO Auth
                                     v
+-------------------------------------------------------------------------+
|                           Authenticated Dashboard                       |
|           [Symptom Triage]   [Report Simplification]   [BMI Calc]       |
+------------------|---------------------|--------------------------------+
                   | HTTP POST           | File Buffer API
                   v                     v
+-------------------------------------------------------------------------+
|                             Express Server                              |
|           [/api/analyze]    [/api/analyze-report]    [/api/find-hospitals]
+------------------|---------------------|-------------------|------------+
                   | SQLite Queries      | Gemini AI Payload | Local Data
                   v                     v                   v
            [medical_data.db]      [gemini-2.5-flash]    [Mock Fallbacks]`;
            
addCodeBlock(archDiagram);

addH2('Project Workspace Directory Structure');
addParagraph('The workspace is structured into active directories for the medical system alongside legacy files from a movie application. The key active locations are detailed below:');

startBulletList();
addBullet('medical-dashboard/: Renders the client-facing UI. This directory features the React modules, CSS system variables, and Firebase initialization scripts.');
addBullet('medical-backend/: Serves the API routes, processes images, holds the SQLite schema, and acts as the gateway to the Gemini AI API endpoints.');
addBullet('medical-backend/server.js: Orchestrates endpoints, manages Multer disk-storage, and registers error/rate-limiting fallback templates.');
addBullet('medical-dashboard/src/App.jsx: Orchestrates state management for symptoms, BMI metrics, location triggers, dashboard view routing, and auth state tracking.');
endBulletList();


// --- PAGE 4: FRONTEND TECHNOLOGIES & ANIMATIONS ---
doc.addPage();

addH1('3. Frontend Technologies & Animations');
addParagraph('The frontend UI emphasizes rich aesthetics, response-triggered micro-animations, and full compatibility. It avoids stock browser components, utilizing customized HSL color maps and border rules to construct a modern workspace.');

addH2('Core Technologies');
startBulletList();
addBullet('Tailwind CSS: Implements grid layouts, color systems, and interactive styles (such as backdrop-blur adjustments).');
addBullet('Lucide React: Supplies lightweight svg iconography.');
addBullet('Firebase SDK: Maintains secure sessions using client credentials, reducing user login friction.');
endBulletList();

addH2('3D Parallax Landing Portal');
addParagraph('The landing page is designed to captivate visitors through high-performance pseudo-3D scroll animations managed by Framer Motion. Using the browser\'s scrolling progress, the layout dynamically transforms visual properties:');
startBulletList();
addBullet('Hero section elements adjust their relative Y-axis and rotate backward (rotateX) as the user scrolls, creating a parallax depth effect.');
addBullet('The main authentication container tilts forward and scales on cursor hover via spring physics.');
addBullet('Cards in the "Why Choose Us" segment dynamically calculate rotation coefficients on mouse move to align with cursor direction.');
endBulletList();

addH2('Firebase Google SSO Integration');
addParagraph('Authentication is fully automated. When a user clicks "Portal Login" or "Continue with Google", the Firebase SDK triggers a secure Google popup window. Once the login succeeds, the profile photo, email, and display name are bound to the client state. App.jsx registers a persistent auth observer:');

addCodeBlock(
`useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setAuthLoading(false);
  });
  return () => unsubscribe();
}, []);`);

addParagraph('This listener guarantees that returning patients automatically bypass the auth screen and immediately access their personal health records upon opening the page.');


// --- PAGE 5: AI SYMPTOM TRIAGE & GEOLOCATION ---
doc.addPage();

addH1('4. AI Symptom Triage & Geolocation Systems');
addParagraph('The diagnostic core of the application centers on the Symptom Triage view. It translates user-described symptoms into structured medical data.');

addH2('Symptom Input & Tagging');
addParagraph('The dashboard provides a dedicated symptom control board where patients register their age, gender, and append multiple symptom strings to a reactive tag array. Users also set a pain severity index from 1 (mild) to 10 (severe) using an styled slider.');

addH2('Prompt Engineering & AI Evaluation');
addParagraph('When the user submits their data, the backend server forwards the patient demographics to the Google Gemini model. It uses detailed developer instructions to enforce strict structure adherence. The prompt mandates that the AI return a structured JSON string matching a predefined format:');

addCodeBlock(
`const prompt = \`You are an expert AI Triage Assistant. Analyze this case:
Demographics: \${age} years old, \${gender}
Pain Level (0-10): \${painLevel}
Symptoms: \${symptoms.join(', ')}

Return response strictly in JSON matching this structure:
{
  "riskLevel": "LOW, MODERATE, or HIGH",
  "alert": "e.g., Immediate Attention Required",
  "analysis": "A detailed 2-paragraph explanatory assessment...",
  "emergencyAdvice": "Short emergency instructions...",
  "probableConditions": [
    { "name": "Condition 1", "percentage": 85, "color": "orange" }
  ],
  "dietaryAdvice": {
    "foodsToEat": ["List of optimal foods..."],
    "foodsToAvoid": ["List of foods to avoid..."]
  },
  "specialist": { "role": "Recommended Specialist Role" }
}\`;`);

addH2('Hospital Locator & Geolocation');
addParagraph('After receiving diagnostic results, the user can click "Find Nearby Hospitals". The application invokes the browser Geolocation API to fetch coordinates:');
startBulletList();
addBullet('If coordinates are granted, they are sent to the backend. If blocked, coordinates default to Hyderabad, India.');
addBullet('The backend forwards coordinates and suspected conditions to Gemini, requesting three specialized physical hospitals nearby.');
addBullet('The dashboard displays the address, specialties, and outputs a clickable link to Google Maps generated using standard URL parameters.');
endBulletList();


// --- PAGE 6: REPORT UPLOADS & BMI CALCULATOR ---
doc.addPage();

addH1('5. Medical Report Uploads & BMI Calculator');
addParagraph('Beyond immediate symptom analysis, MediAssist AI assists with health document processing and vital tracking.');

addH2('Multimodal Report Simplification');
addParagraph('Dense medical jargon in diagnostic reports can cause patient anxiety. To solve this, the application features an AI Report Simplification tool:');
startBulletList();
addBullet('The user uploads a PDF or scan of a report from the sidebar.');
addBullet('The file is captured by the Express backend using Multer disk-storage.');
addBullet('The backend converts the file buffer to a base64 inline data payload and passes it to Gemini along with instructions to "read, simplify, and explain this report to a patient in everyday language."');
addBullet('The simplified text is rendered inside a scrollable glass panel under the "Reports" tab, highlighting primary readings, irregularities, and doctor follow-up items.');
endBulletList();

addH2('Body Mass Index (BMI) Module');
addParagraph('The dashboard provides a lightweight, fully functional BMI calculator. Users enter their height in centimeters and weight in kilograms. The frontend calculates the index and maps it to WHO standard classifications:');

addCodeBlock(
`const heightInMeters = parseFloat(height) / 100;
const bodyWeight = parseFloat(weight);
const bmi = bodyWeight / (heightInMeters * heightInMeters);`);

addParagraph('Results are presented with visual feedback:');
startBulletList();
addBullet('Underweight (< 18.5): Styled in blue; suggests dietary consulting.');
addBullet('Normal (18.5 - 24.9): Styled in emerald; congratulates healthy range.');
addBullet('Overweight (25 - 29.9): Styled in yellow; suggests exercise and balanced diet.');
addBullet('Obese (30+): Styled in red; advises consulting a medical practitioner.');
endBulletList();
addParagraph('A colored reference bar visually demonstrates the user\'s placement along the global BMI index scale.');


// --- PAGE 7: BACKEND API REFERENCE ---
doc.addPage();

addH1('6. API Endpoints & Integration Schemas');
addParagraph('The backend service acts as a robust gateway for the React dashboard. It wraps the Google Generative AI API and provides local data backups.');

addH2('Route: POST /api/analyze');
addParagraph('Evaluates patient demographics, symptoms, and pain metrics.');
addH3('Request Headers');
addCodeBlock('Content-Type: application/json');
addH3('Sample JSON Payload');
addCodeBlock(
`{
  "symptoms": ["cough", "headache", "throat congestion"],
  "age": "32",
  "gender": "Male",
  "painLevel": 3
}`);

addH2('Route: POST /api/analyze-report');
addParagraph('Uploads and interprets documents using multimodal machine learning.');
addH3('Request Headers');
addCodeBlock('Content-Type: multipart/form-data');
addH3('Payload Format');
addCodeBlock('Key: "report" (binary file attachment - PDF, JPG, PNG)');

addH2('Route: POST /api/find-hospitals');
addParagraph('Retrieves geo-mapped clinics specialized in suspected health conditions.');
addH3('Sample JSON Payload');
addCodeBlock(
`{
  "latitude": 17.3850,
  "longitude": 78.4867,
  "conditions": [
    { "name": "Acute Bronchitis", "percentage": 75 }
  ]
}`);

addH2('Robust Fallback System Architecture');
addParagraph('To guarantee system stability, the Express router includes fallback mechanisms. If the Gemini API key is missing or blocked, the endpoints trigger structured fallback responses:');
startBulletList();
addBullet('The triage route falls back to a simulated Moderate Risk viral infection response.');
addBullet('The report analyzer returns a mock report explanation reflecting stable vitals.');
addBullet('The hospital locator outputs Apollo Hospitals (Jubilee Hills), KIMS (Secunderabad), and CARE Hospitals (Banjara Hills) as standard physical care listings in Hyderabad.');
endBulletList();


// --- PAGE 8: DEPLOYMENT & TROUBLESHOOTING ---
doc.addPage();

addH1('7. Deployment, Orchestration & Troubleshooting');
addParagraph('Deploying and maintaining the application requires launching both the React frontend build pipeline and the Node.js Express server.');

addH2('Execution Sequence');
addParagraph('Execute the following steps to start the application. Do not run start_app.bat, as it is legacy configuration code.');

addH3('Step 1: Set Up Backend Server');
addCodeBlock(
`cd medical-backend
npm install
node server.js`);

addH3('Step 2: Set Up Frontend Dashboard');
addParagraph('On Windows PowerShell, use the CMD shell wrapper to start Vite to prevent script restriction blocks:');
addCodeBlock(
`cd medical-dashboard
npm install
cmd /c "npm run dev"`);

addH2('Diagnostics & Troubleshooting Matrix');

doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.dark);
doc.text('Issue', 50, doc.y + 5);
doc.text('Probable Cause', 200, doc.y - 10);
doc.text('Resolution', 380, doc.y - 10);

doc.strokeColor(colors.border).lineWidth(1).moveTo(50, doc.y + 5).lineTo(562, doc.y + 5).stroke();
doc.moveDown(0.8);

const troubleshootingSteps = [
  { issue: 'ERR_CONNECTION_REFUSED', cause: 'Backend server is inactive or occupied.', fix: 'Restart Node using node server.js on port 3000.' },
  { issue: 'PowerShell script block', cause: 'Windows execution policy restriction.', fix: 'Start Vite server via cmd /c "npm run dev".' },
  { issue: 'AI fallback triggering', cause: 'Gemini API limit or missing API key.', fix: 'Verify GEMINI_API_KEY in .env file.' },
  { issue: 'Geolocation failure', cause: 'Browser location access denied by user.', fix: 'Defaults to Hyderabad. Allow location access in browser.' },
  { issue: 'Empty Dashboard State', cause: 'User dashboard accessed without auth.', fix: 'Confirm Firebase config keys; log in via Google SSO.' }
];

troubleshootingSteps.forEach(row => {
  const startY = doc.y;
  doc.font('Helvetica-Bold').fontSize(9).fillColor(colors.blue).text(row.issue, 50, startY, { width: 140 });
  doc.font('Helvetica').fontSize(9).fillColor(colors.grayText).text(row.cause, 200, startY, { width: 170 });
  doc.text(row.fix, 380, startY, { width: 180 });
  doc.moveDown(1.5);
});

addAlertBlock(
  'Ensure the SQLite database (medical_data.db) is preserved within the medical-backend directory. If the database file is deleted or corrupted, execute "node seed.js" to reinitialize templates.',
  'WARNING'
);

// -------------------------------------------------------------
// POST-PROCESSING: HEADERS, FOOTERS & PAGE NUMBERS
// -------------------------------------------------------------
const range = doc.bufferedPageRange();
for (let i = 1; i < range.count; i++) {
  doc.switchToPage(i);
  
  // Running Header
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#9CA3AF').text('MEDLASSIST AI - SYSTEM ARCHITECTURE DOCUMENTATION', 50, 30);
  doc.strokeColor(colors.border).lineWidth(0.5).moveTo(50, 42).lineTo(562, 42).stroke();
  
  // Running Footer
  doc.strokeColor(colors.border).lineWidth(0.5).moveTo(50, 750).lineTo(562, 750).stroke();
  doc.font('Helvetica').fontSize(8.5).fillColor('#9CA3AF').text('Confidential - Reference Manual', 50, 758);
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(colors.blue).text(`Page ${i + 1} of ${range.count}`, 500, 758, { align: 'right' });
}

// Finalize the PDF document
doc.end();
console.log('PDF Document successfully compiled and written to:', outputFilePath);
