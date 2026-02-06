import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// ============================================
// ALEXRENEW WASTEWATER OPERATOR SIMULATOR v8.0
// Complete Stardew-Style Training Experience
// Holland Lane Campus - Accurate Layout
// ============================================

const GAME_VERSION = "8.0.0";

// ============================================
// PIXEL ART CONSTANTS
// ============================================

const TILE = 32;
const PIXEL_SCALE = 2;

// Color Palette - Industrial Stardew
const C = {
  // Floors
  concrete: '#6B7280',
  concreteLight: '#9CA3AF',
  concreteDark: '#4B5563',
  grate: '#374151',
  tile: '#60A5FA',
  tileDark: '#3B82F6',
  grass: '#22C55E',
  water: '#0EA5E9',
  waterDark: '#0369A1',
  
  // Walls
  wall: '#1F2937',
  wallLight: '#374151',
  wallAccent: '#4B5563',
  
  // Equipment
  pump: '#6366F1',
  pumpLight: '#818CF8',
  tank: '#14B8A6',
  tankLight: '#2DD4BF',
  pipe: '#78716C',
  pipeLight: '#A8A29E',
  panel: '#1E40AF',
  screen: '#22D3EE',
  screenGlow: '#67E8F9',
  digester: '#92400E',
  digesterLight: '#B45309',
  blower: '#7C3AED',
  filter: '#059669',
  uv: '#FBBF24',
  
  // Characters
  player: '#3B82F6',
  playerSkin: '#FBBF24',
  playerHat: '#EF4444',
  playerVest: '#F97316',
  npc: '#10B981',
  npcSkin: '#FCD34D',
  
  // UI
  hazardRed: '#EF4444',
  warningYellow: '#F59E0B',
  safeGreen: '#22C55E',
  xpBlue: '#3B82F6',
  energyGreen: '#10B981',
  
  // BG
  bgDark: '#0F172A',
  bgMid: '#1E293B',
  bgLight: '#334155',
  textLight: '#F1F5F9',
  textMuted: '#94A3B8',
};

// ============================================
// SEASONS & WEATHER
// ============================================

const SEASONS = {
  spring: { name: "Spring", icon: "🌸", color: "#22C55E", tip: "I&I season - watch for high flows!" },
  summer: { name: "Summer", icon: "☀️", color: "#F59E0B", tip: "Peak tourism. VIP tours incoming!" },
  fall: { name: "Fall", icon: "🍂", color: "#EA580C", tip: "Leaves clog screens. Stay vigilant." },
  winter: { name: "Winter", icon: "❄️", color: "#3B82F6", tip: "Cold weather ops. Watch for Microthrix!" }
};

const WEATHER = {
  clear: { icon: "☀️", name: "Clear", flowMod: 1.0 },
  cloudy: { icon: "☁️", name: "Cloudy", flowMod: 1.0 },
  rain: { icon: "🌧️", name: "Rain", flowMod: 1.3 },
  storm: { icon: "⛈️", name: "Storm", flowMod: 1.8 },
  fog: { icon: "🌫️", name: "Fog", flowMod: 1.0 },
  snow: { icon: "🌨️", name: "Snow", flowMod: 0.8 }
};

// ============================================
// SHIFTS
// ============================================

const SHIFTS = {
  days: { 
    name: "Day Shift", 
    startHour: 6, endHour: 18,
    hours: "6:00 AM - 6:00 PM", 
    supervisor: "marcus",
    color: "#F59E0B",
    greeting: "Morning! Let's have a safe, productive day."
  },
  evenings: { 
    name: "Evening Shift", 
    startHour: 14, endHour: 22,
    hours: "2:00 PM - 10:00 PM", 
    supervisor: "brian",
    color: "#8B5CF6",
    greeting: "Hey there! Quiet afternoon so far... you know how that goes."
  },
  nights: { 
    name: "Night Shift", 
    startHour: 22, endHour: 6,
    hours: "10:00 PM - 6:00 AM", 
    supervisor: "andy",
    color: "#1E293B",
    greeting: "Welcome to the night crew. It's just us and the bugs."
  }
};

// ============================================
// SECTIONS (For daily assignment)
// ============================================

const SECTIONS = {
  preliminary: { 
    name: "Preliminary/Primary", 
    icon: "🔩", 
    color: "#6B7280",
    areas: ["headworks", "grit", "primary"],
    tasks: ["checkScreens", "emptyGrit", "walkPSTs", "checkScum"]
  },
  bnr: { 
    name: "BNR/Secondary", 
    icon: "🦠", 
    color: "#22C55E",
    areas: ["bnrBasins", "blowers", "secondary"],
    tasks: ["checkDO", "adjustBlowers", "checkBlanket", "collectMLSS"]
  },
  tertiary: { 
    name: "Tertiary/Filters", 
    icon: "💎", 
    color: "#3B82F6",
    areas: ["buildingG", "uv"],
    tasks: ["checkFilters", "runBackwash", "checkUV", "checkEffluent"]
  },
  solids: { 
    name: "Solids/Digestion", 
    icon: "🥚", 
    color: "#92400E",
    areas: ["buildingL", "digestion"],
    tasks: ["checkDigesters", "checkThickening", "checkDewatering", "checkPolymer"]
  },
  lab: { 
    name: "Lab Duty", 
    icon: "🔬", 
    color: "#8B5CF6",
    areas: ["laboratory"],
    tasks: ["collectSamples", "runSettleability", "microscopy", "logResults"]
  }
};

// ============================================
// COMPLETE STAFF ROSTER (~28 operators + support)
// ============================================

const STAFF = {
  // ========== SUPERVISORS ==========
  marcus: { 
    name: "Marcus", role: "Day Shift Supervisor", icon: "👨‍💼", shift: "days",
    personality: "By-the-book, 20 years at AlexRenew. Former Navy.",
    location: "controlRoom", team: "supervision"
  },
  brian: { 
    name: "Brian", role: "Evening Shift Supervisor", icon: "👨‍🔧", shift: "evenings",
    personality: "Dad joke champion. Great mentor. Kids love his tours.",
    location: "controlRoom", team: "supervision"
  },
  andy: { 
    name: "Andy", role: "Night Shift Supervisor", icon: "🦉", shift: "nights",
    personality: "Night owl. Speaks softly. Will quiz you randomly.",
    location: "controlRoom", team: "supervision"
  },

  // ========== DAY SHIFT OPERATORS (~10) ==========
  daryl: {
    name: "Daryl", role: "Team 1 Lead", icon: "👷", shift: "days",
    personality: "~45, funny but serious when needed. Runs a tight ship.",
    location: "headworks", team: "team1"
  },
  lou: {
    name: "Lou", role: "Team 2 Lead", icon: "📖", shift: "days",
    personality: "~55, does Word of the Day at morning meetings. Great humor.",
    location: "bnrBasins", team: "team2",
    special: "wordOfTheDay"
  },
  jeff: {
    name: "Jeff", role: "Op Tech III", icon: "🎖️", shift: "days",
    personality: "Grumpy military vet exterior, deeply empathetic inside.",
    location: "digestion", team: "team2"
  },
  isaac: {
    name: "Isaac", role: "Op Tech III", icon: "😎", shift: "days",
    personality: "Unshakeable. Highly intelligent. Nothing fazes him.",
    location: "secondary", team: "team1"
  },
  nick: {
    name: "Nick", role: "Op Tech II", icon: "👓", shift: "days",
    personality: "Conspiracy theorist, takes time to trust. Short, glasses.",
    location: "filters", team: "team1"
  },
  adam: {
    name: "Adam", role: "Op Tech II", icon: "🦒", shift: "days",
    personality: "Tall and lanky. Friends with Nick.",
    location: "filters", team: "team1"
  },
  noel: {
    name: "Noel", role: "Op Tech II", icon: "🏆", shift: "days",
    personality: "Started as apprentice. Longest tenure in ops. Very smart, quiet.",
    location: "peps", team: "team2"
  },
  q: {
    name: "Q", role: "Op Tech II", icon: "🏈", shift: "days",
    personality: "Football coach energy. Always has a joke ready.",
    location: "headworks", team: "team1"
  },
  lamar: {
    name: "Lamar", role: "Op Tech II", icon: "🎸", shift: "days",
    personality: "Sweet, understanding. Family man. Has gigs on weekends.",
    location: "bnrBasins", team: "team2"
  },
  antione: {
    name: "Antione", role: "Op Tech II", icon: "📋", shift: "days",
    personality: "Calls people out. Holds everyone to high standards.",
    location: "laboratory", team: "team1"
  },

  // ========== EVENING SHIFT OPERATORS (~8) ==========
  nickJ: {
    name: "Nick J.", role: "Team 1 Lead", icon: "👷", shift: "evenings",
    personality: "Evening team lead. Reliable and steady.",
    location: "controlRoom", team: "team1"
  },
  joeyM: {
    name: "Joey McVery", role: "Team 2 Lead", icon: "🤝", shift: "evenings",
    personality: "Your good friend. Supportive mentor-friend.",
    location: "bnrBasins", team: "team2"
  },
  andrew: {
    name: "Andrew", role: "Op Tech II", icon: "👥", shift: "evenings",
    personality: "Quiet. Always with Will. Reliable pair.",
    location: "secondary", team: "team1"
  },
  will: {
    name: "Will", role: "Op Tech II", icon: "👥", shift: "evenings",
    personality: "Quiet. Always with Andrew. Great team.",
    location: "secondary", team: "team1"
  },
  littleJoey: {
    name: "Little Joey", role: "Op Tech II", icon: "⚡", shift: "evenings",
    personality: "One of the most industrious people ever. Smart and fast.",
    location: "headworks", team: "team2"
  },
  delante: {
    name: "DeLante", role: "Op Tech I", icon: "👀", shift: "evenings",
    personality: "Hard worker. Notices things. Eager to learn.",
    location: "grit", team: "team2"
  },
  allison: {
    name: "Allison", role: "Op Tech I", icon: "🐕", shift: "evenings",
    personality: "Kind, loves animals. Asks lots of questions.",
    location: "filters", team: "team1"
  },
  yo: {
    name: "Yo", role: "Op Tech II", icon: "🌍", shift: "evenings",
    personality: "From the Middle East. Works with evening Team 1.",
    location: "uv", team: "team1"
  },

  // ========== NIGHT SHIFT OPERATORS (~6) ==========
  john: {
    name: "John", role: "Op Tech III", icon: "🐢", shift: "nights",
    personality: "One speed machine. Steady and reliable.",
    location: "controlRoom", team: "team1"
  },
  brandon: {
    name: "Brandon", role: "Op Tech II", icon: "🔧", shift: "nights",
    personality: "Mechanical genius. 'Just an operator' but knows more than most mechanics.",
    location: "peps", team: "team1"
  },
  chris: {
    name: "Chris", role: "Op Tech II", icon: "⚡", shift: "nights",
    personality: "Energetic. Keeps the night shift moving.",
    location: "bnrBasins", team: "team2"
  },
  cecil: {
    name: "Cecil", role: "Op Tech II", icon: "😂", shift: "nights",
    personality: "Always has a joke ready. Really listens to people.",
    location: "secondary", team: "team2"
  },
  jerry: {
    name: "Jerry", role: "Senior Op Tech", icon: "😴", shift: "nights",
    personality: "*yawns* Been here since '98. Seen it all.",
    location: "controlRoom", team: "team1"
  },
  haley: {
    name: "Haley", role: "Op Tech I", icon: "👩", shift: "nights",
    personality: "Best friends with Heather from before AlexRenew.",
    location: "laboratory", team: "team2"
  },

  // ========== SUPPORT STAFF ==========
  heather: { 
    name: "Heather", role: "Technical Trainer", icon: "👩‍🏫", shift: "days",
    personality: "Created CLEARpath. Passionate about operator development.",
    location: "trainingRoom", team: "training",
    special: "trainer"
  },
  paul: { 
    name: "Paul", role: "Executive O&M Advisor", icon: "🧑‍🔧", shift: "days",
    personality: "Digestion guru. Can diagnose an upset from across the plant.",
    location: "digestion", team: "leadership",
    special: "digesterExpert"
  },
  chuck: { 
    name: "Chuck", role: "Chief Operator", icon: "👔", shift: "days",
    personality: "Ultimate responsibility. Fun but professional. Buck stops here.",
    location: "adminOffice", team: "leadership"
  },
  dennis: { 
    name: "Dennis", role: "Maintenance Manager", icon: "🔧", shift: "days",
    personality: "Fun, funny, kind. Almost the same person as Chuck!",
    location: "maintenanceShop", team: "maintenance"
  },
  carlos: { 
    name: "Carlos", role: "Maintenance Lead", icon: "🛠️", shift: "days",
    personality: "Can fix anything. Has tools older than some operators.",
    location: "maintenanceShop", team: "maintenance"
  },
  josh: { 
    name: "Josh", role: "Contractor Projects", icon: "📋", shift: "days",
    personality: "Runs contractor projects. Always near maintenance bays.",
    location: "maintenanceBays", team: "maintenance"
  },
  alex: { 
    name: "Alex", role: "Safety Specialist", icon: "🦺", shift: "days",
    personality: "Our safety guy. Takes it seriously but keeps it real.",
    location: "safetyOffice", team: "safety"
  },
  tony: { 
    name: "Tony", role: "Lab Tech", icon: "🔬", shift: "days",
    personality: "Precision is his middle name. Microscopy expert.",
    location: "laboratory", team: "lab"
  },
  monica: { 
    name: "Monica", role: "Process Specialist", icon: "📚", shift: "days",
    personality: "Loveable nerd. Masters in Microbiology. Always has a book.",
    location: "laboratory", team: "process",
    special: "microbeExpert"
  },
  christian: { 
    name: "Christian", role: "Process Specialist", icon: "💪", shift: "days",
    personality: "Gym rat, in a band. Expert at BRB DO control.",
    location: "bnrBasins", team: "process",
    special: "doExpert"
  },
  ken: { 
    name: "Ken", role: "Plant Historian", icon: "📜", shift: "days",
    personality: "35 years at the plant. Walking encyclopedia of plant history.",
    location: "controlRoom", team: "leadership",
    special: "historian"
  },
  esther: { 
    name: "Esther", role: "Lab Manager", icon: "☕", shift: "days",
    personality: "NO COFFEE IN THE LAB. Period. Runs a tight ship.",
    location: "laboratory", team: "lab"
  }
};

// ============================================
// SKILLS & XP
// ============================================

const SKILLS = {
  process: { name: "Process Operations", icon: "⚙️", color: "#3B82F6" },
  lab: { name: "Laboratory", icon: "🔬", color: "#8B5CF6" },
  maintenance: { name: "Maintenance", icon: "🔧", color: "#F59E0B" },
  safety: { name: "Safety", icon: "🦺", color: "#EF4444" },
  troubleshooting: { name: "Troubleshooting", icon: "⚡", color: "#FBBF24" }
};

const calcLevel = (xp) => {
  let level = 1, needed = 100, total = 0;
  while (total + needed <= xp && level < 20) {
    total += needed;
    level++;
    needed = Math.floor(100 * Math.pow(1.5, level - 1));
  }
  return { level, current: xp - total, needed };
};

// ============================================
// QUIZ QUESTIONS (40 from v5)
// ============================================

const QUIZ_QUESTIONS = [
  { id: 1, category: "Fundamentals", question: "What is the volume of 1 cubic foot of water?", options: ["8.34 gallons", "62.4 gallons", "92.84 gallons", "7.48 gallons"], correct: 3, explanation: "1 ft³ = 7.48 gallons" },
  { id: 2, category: "Fundamentals", question: "What does 1 ft³ of water weigh?", options: ["7.48 lb", "8.34 lb", "3.14 lb", "62.4 lb"], correct: 3, explanation: "1 ft³ water = 62.4 lb" },
  { id: 3, category: "Fundamentals", question: "What is considered a neutral pH?", options: ["6.5", "14.0", "10.0", "7.0"], correct: 3, explanation: "pH 7.0 is neutral" },
  { id: 4, category: "Fundamentals", question: "What is 1 MGD in GPM?", options: ["694.4 GPM", "1,000 GPM", "1,440 GPM", "448.83 GPM"], correct: 0, explanation: "1 MGD = 694.4 GPM" },
  { id: 5, category: "Collections", question: "Minimum velocity to prevent solids deposition?", options: ["1.0 ft/sec", "2.0 ft/sec", "3.0 ft/sec", "4.0 ft/sec"], correct: 1, explanation: "2.0 ft/sec scouring velocity" },
  { id: 6, category: "Collections", question: "Water seeping INTO a sewer is called?", options: ["Exfiltration", "Infiltration", "Inflow", "Percolation"], correct: 1, explanation: "Infiltration = groundwater entering through defects" },
  { id: 7, category: "Collections", question: "Crown corrosion is caused by?", options: ["Sulfuric acid", "Hydrochloric acid", "Nitric acid", "Acetic acid"], correct: 0, explanation: "H2S → sulfuric acid → crown corrosion" },
  { id: 8, category: "Process", question: "Conventional activated sludge F/M ratio?", options: ["0.05-0.15", "0.2-0.5", "0.5-1.0", "1.0-2.0"], correct: 1, explanation: "0.2-0.5 lb BOD/lb MLVSS/day" },
  { id: 9, category: "Process", question: "SVI of 180 mL/g indicates?", options: ["Good settling", "Excellent settling", "Potential bulking", "No problems"], correct: 2, explanation: "SVI >150 = potential bulking" },
  { id: 10, category: "Process", question: "DO needed for nitrification?", options: ["0.5 mg/L", "1.0 mg/L", "1.5-2.0 mg/L", "4.0 mg/L"], correct: 2, explanation: "Nitrification needs 1.5-2.0 mg/L DO" },
  { id: 11, category: "Process", question: "Alkalinity consumed per mg/L NH3-N oxidized?", options: ["3.57 mg/L", "7.14 mg/L", "50-100 mg/L", "150 mg/L"], correct: 1, explanation: "7.14 mg/L alk per mg/L NH3-N" },
  { id: 12, category: "BNR", question: "BOD:P ratio for biological P removal?", options: ["5:1", "10:1", "20-40:1", "50:1"], correct: 2, explanation: "EBPR needs 20-40:1 BOD:P" },
  { id: 13, category: "BNR", question: "PAOs store phosphorus as?", options: ["Volatile acids", "Polyphosphate", "Glycogen", "Proteins"], correct: 1, explanation: "PAOs store polyphosphate granules" },
  { id: 14, category: "Digestion", question: "Optimal mesophilic digester temp?", options: ["75-85°F", "95-99°F", "122-131°F", "150°F"], correct: 1, explanation: "Mesophilic = 95-99°F" },
  { id: 15, category: "Digestion", question: "Typical digester gas composition?", options: ["90% CH4", "70% CH4, 30% CO2", "50% CH4, 50% CO2", "100% CH4"], correct: 1, explanation: "60-70% CH4, 30-40% CO2" },
  { id: 16, category: "Digestion", question: "VA:Alk ratio indicating upset?", options: [">0.1", ">0.2", ">0.34", ">0.5"], correct: 2, explanation: "VA:Alk >0.34 = upset" },
  { id: 17, category: "Safety", question: "OSHA PEL ceiling for H2S?", options: ["10 ppm", "20 ppm", "50 ppm", "100 ppm"], correct: 1, explanation: "20 ppm ceiling, 50 ppm peak (10 min)" },
  { id: 18, category: "Safety", question: "H2S olfactory fatigue level?", options: ["10 ppm", "50 ppm", "100 ppm", "200 ppm"], correct: 2, explanation: "At 100 ppm, can't smell H2S" },
  { id: 19, category: "Safety", question: "IDLH for H2S?", options: ["20 ppm", "35 ppm", "50 ppm", "100 ppm"], correct: 2, explanation: "IDLH = 50 ppm" },
  { id: 20, category: "Safety", question: "Safe O2 range for confined space?", options: ["16-19%", "19.5-23.5%", "21-25%", "23-25%"], correct: 1, explanation: "19.5-23.5% is safe" },
  { id: 21, category: "Safety", question: "LEL alarm setpoint?", options: ["5%", "10%", "25%", "50%"], correct: 1, explanation: "Alarm at 10% LEL" },
  { id: 22, category: "Safety", question: "Confined space testing order?", options: ["Toxics, O2, LEL", "LEL, O2, Toxics", "O2, LEL, Toxics", "O2, Toxics, LEL"], correct: 2, explanation: "O2 → LEL → Toxics" },
  { id: 23, category: "Lab", question: "TSS drying temperature?", options: ["50-55°C", "75-80°C", "103-105°C", "150°C"], correct: 2, explanation: "TSS dried at 103-105°C" },
  { id: 24, category: "Lab", question: "VSS ignition temperature?", options: ["300°C", "450°C", "550°C", "650°C"], correct: 2, explanation: "VSS ignited at 550°C" },
  { id: 25, category: "Lab", question: "Settleability test device?", options: ["Secchi disk", "Imhoff cone", "Van Dorn bottle", "Kemmerer"], correct: 1, explanation: "Imhoff cone for settleability" },
  { id: 26, category: "Lab", question: "BOD incubation period?", options: ["1 day", "3 days", "5 days", "7 days"], correct: 2, explanation: "BOD5 = 5-day test" },
  { id: 27, category: "Virginia", question: "Class I-III CPE hours per cycle?", options: ["10 hours", "16 hours", "20 hours", "24 hours"], correct: 2, explanation: "20 CPE hours per 2-year cycle" },
  { id: 28, category: "Virginia", question: "ENR Total Nitrogen limit?", options: ["1 mg/L", "3 mg/L", "8 mg/L", "10 mg/L"], correct: 1, explanation: "ENR TN = 3 mg/L" },
  { id: 29, category: "Virginia", question: "ENR Total Phosphorus limit?", options: ["0.1 mg/L", "0.3 mg/L", "1.0 mg/L", "2.0 mg/L"], correct: 1, explanation: "ENR TP = 0.3 mg/L" },
  { id: 30, category: "Virginia", question: "Virginia license expiration?", options: ["Dec 31", "Feb 28 even years", "June 30", "Birthday"], correct: 1, explanation: "Last day of February, even years" },
  { id: 31, category: "Calculations", question: "1% solids = how many mg/L?", options: ["1,000", "5,000", "10,000", "100,000"], correct: 2, explanation: "1% = 10,000 mg/L" },
  { id: 32, category: "Calculations", question: "lb/day = mg/L × MGD × ?", options: ["7.48", "8.34", "62.4", "1.547"], correct: 1, explanation: "Pounds formula: × 8.34" },
  { id: 33, category: "Calculations", question: "SVI formula?", options: ["MLSS / Settled", "(Settled × 1000) / MLSS", "Settled × MLSS", "MLSS × 1000"], correct: 1, explanation: "SVI = (mL/L × 1000) ÷ MLSS" },
  { id: 34, category: "Biosolids", question: "Class A fecal coliform limit?", options: ["<100 MPN/g", "<1,000 MPN/g", "<10,000 MPN/g", "<2,000,000 MPN/g"], correct: 1, explanation: "Class A: <1,000 MPN/g" },
  { id: 35, category: "Biosolids", question: "Class B fecal coliform limit?", options: ["<100 MPN/g", "<1,000 MPN/g", "<2,000,000 MPN/g", "<10,000,000 MPN/g"], correct: 2, explanation: "Class B: <2,000,000 MPN/g" },
  { id: 36, category: "Biosolids", question: "VAR volatile solids reduction?", options: ["25%", "38%", "50%", "60%"], correct: 1, explanation: "VAR = 38% VS reduction" },
  { id: 37, category: "AlexRenew", question: "AlexRenew average daily flow?", options: ["18 MGD", "38 MGD", "54 MGD", "116 MGD"], correct: 1, explanation: "~38 MGD avg, 116 MGD wet weather" },
  { id: 38, category: "AlexRenew", question: "How many RSPs at AlexRenew?", options: ["4", "5", "6", "8"], correct: 2, explanation: "6 Raw Sewage Pumps" },
  { id: 39, category: "AlexRenew", question: "AlexRenew P removal efficiency?", options: ["85%", "95%", "97.5%", "99.5%"], correct: 3, explanation: "99.5% phosphorus removal" },
  { id: 40, category: "AlexRenew", question: "Biogas powers what % of plant?", options: ["25%", "50%", "75%", "100%"], correct: 1, explanation: "~50% from digester biogas" }
];

// ============================================
// MICROBES
// ============================================

const MICROBES = [
  { name: "Vorticella", type: "good", category: "Stalked Ciliate", image: "🔔", description: "Bell-shaped. Good DO, stable process.", indicator: "Good settling, healthy sludge age" },
  { name: "Opercularia", type: "good", category: "Stalked Ciliate", image: "🎪", description: "Colonial stalked ciliate.", indicator: "Healthy activated sludge" },
  { name: "Aspidisca", type: "good", category: "Crawling Ciliate", image: "🚀", description: "Crawling ciliate. Older sludge.", indicator: "Good nitrification, high SRT" },
  { name: "Arcella", type: "good", category: "Amoeba", image: "🟤", description: "Shelled amoeba.", indicator: "Stable conditions" },
  { name: "Rotifer", type: "good", category: "Metazoa", image: "🛞", description: "Multi-celled. High sludge age.", indicator: "High SRT, older sludge" },
  { name: "Nematode", type: "good", category: "Metazoa", image: "🪱", description: "Roundworm. Very old sludge.", indicator: "Extended aeration" },
  { name: "Nocardia", type: "problem", category: "Filamentous", image: "🟫", description: "Branching filament. Brown foam.", indicator: "Brown foam, high MCRT - reduce SRT" },
  { name: "Microthrix", type: "problem", category: "Filamentous", image: "⚪", description: "Thin coiled filament. Cold weather.", indicator: "White foam, grease, low temps" },
  { name: "Type 021N", type: "problem", category: "Filamentous", image: "🔵", description: "Large sheathed filament.", indicator: "Sulfide/septicity, low DO" },
  { name: "Thiothrix", type: "problem", category: "Filamentous", image: "⬜", description: "Sulfur-storing filament.", indicator: "Sulfide, septicity" },
  { name: "Sphaerotilus", type: "problem", category: "Filamentous", image: "🟡", description: "Sheathed bacteria.", indicator: "High organic loading, low DO" },
  { name: "Type 1701", type: "problem", category: "Filamentous", image: "🔘", description: "Attached growth filament.", indicator: "Low DO, low F/M" }
];

// ============================================
// BUILDING & ROOM SYSTEM (Simplified for rendering)
// ============================================

const AREAS = {
  // Starting area
  lockerRoom: {
    name: "Locker Room", icon: "🚿", color: C.bgMid,
    description: "Start here. Grab PPE and 4-gas monitor.",
    connections: ["maintenanceShop", "controlRoom"],
    actions: ["getGear", "bumpTest", "storeGear"],
    hazards: []
  },
  maintenanceShop: {
    name: "Maintenance Shop", icon: "🔧", color: "#64748B",
    description: "Tools, work orders. Dennis and Carlos's domain.",
    connections: ["lockerRoom", "maintenanceBays"],
    npcs: ["dennis", "carlos"],
    actions: ["getTool", "submitWorkOrder"],
    hazards: []
  },
  maintenanceBays: {
    name: "Maintenance Bays", icon: "🚗", color: "#475569",
    description: "Vehicle/equipment maintenance. Josh runs contractors here.",
    connections: ["maintenanceShop", "yard"],
    npcs: ["josh"],
    hazards: []
  },
  
  // Control & Admin
  controlRoom: {
    name: "Control Room", icon: "🖥️", color: "#1E40AF",
    description: "SCADA hub. 6 workstations, 6 wall screens.",
    connections: ["lockerRoom", "trainingRoom", "laboratory", "breakRoom", "yard"],
    actions: ["checkSCADA", "readNotes", "checkAlarms", "logReadings"],
    hazards: []
  },
  breakRoom: {
    name: "Break Room", icon: "☕", color: "#78716C",
    description: "Coffee, fridge, microwave. Recharge here!",
    connections: ["controlRoom"],
    actions: ["rest", "getCoffee"],
    hazards: []
  },
  trainingRoom: {
    name: "Training Room", icon: "📚", color: "#059669",
    description: "Heather's domain. CLEARpath headquarters.",
    connections: ["controlRoom", "safetyOffice"],
    npcs: ["heather"],
    actions: ["takeQuiz", "lotoTraining", "confinedSpaceTraining"],
    hazards: []
  },
  safetyOffice: {
    name: "Safety Office", icon: "🦺", color: "#DC2626",
    description: "Alex's office. Safety training and compliance.",
    connections: ["trainingRoom"],
    npcs: ["alex"],
    actions: ["reviewJSA", "scheduleSafetyTraining"],
    hazards: []
  },
  laboratory: {
    name: "Laboratory", icon: "🔬", color: "#7C3AED",
    description: "BOD, TSS, pH, microscopy. Tony, Monica, Esther's domain.",
    connections: ["controlRoom"],
    npcs: ["tony", "monica", "esther"],
    actions: ["microscopy", "runSettleability", "collectSamples", "runBOD"],
    hazards: []
  },
  adminOffice: {
    name: "Admin Office", icon: "👔", color: "#334155",
    description: "Chief Operator office and management.",
    connections: ["controlRoom"],
    npcs: ["chuck"],
    hazards: []
  },
  
  // Yard (outdoor connection hub)
  yard: {
    name: "Plant Yard", icon: "🏭", color: "#22C55E",
    description: "Central outdoor area connecting all process buildings.",
    connections: ["controlRoom", "maintenanceBays", "headworks", "grit", "primary", "peps", "bnrBasins", "secondary", "filters", "uv", "digestion", "tunnel"],
    hazards: [],
    isOutdoor: true
  },
  
  // Process Areas
  headworks: {
    name: "Headworks (Bldg A)", icon: "🔩", color: "#DC2626",
    description: "Coarse screens, 6 RSPs. First treatment step. 60 MGD per channel.",
    connections: ["yard", "grit"],
    equipment: ["CoarseScreen-1", "CoarseScreen-2", "RSP-1", "RSP-2", "RSP-3", "RSP-4", "RSP-5", "RSP-6"],
    actions: ["checkScreens", "clearRags", "checkPumps", "checkWetWell"],
    hazards: ["h2s", "confinedSpace"]
  },
  grit: {
    name: "Grit Removal (Bldg K)", icon: "🏖️", color: "#F59E0B",
    description: "Fine screens, vortex grit separators. 40 MGD per channel.",
    connections: ["headworks", "primary", "yard"],
    equipment: ["FineScreen-1", "FineScreen-2", "FineScreen-3", "FineScreen-4", "Grit-1", "Grit-2", "Grit-3", "Grit-4"],
    actions: ["checkFineScreens", "emptyGrit", "checkCyclones"],
    hazards: ["h2s"]
  },
  primary: {
    name: "Primary Settling Tanks", icon: "🏊", color: "#14B8A6",
    description: "8 PSTs. 419,300 gal each. 50-65% TSS removal.",
    connections: ["grit", "peps", "yard"],
    equipment: ["PST-1", "PST-2", "PST-3", "PST-4", "PST-5", "PST-6", "PST-7", "PST-8"],
    actions: ["walkTanks", "checkScum", "checkCollectors", "checkSludge"],
    hazards: [],
    isOutdoor: true
  },
  peps: {
    name: "PEPS Building", icon: "⬆️", color: "#8B5CF6",
    description: "6 Primary Effluent Pumps. 24 MGD each. 120 MGD total.",
    connections: ["primary", "bnrBasins", "yard"],
    equipment: ["PEP-1", "PEP-2", "PEP-3", "PEP-4", "PEP-5", "PEP-6"],
    actions: ["checkPEPS", "checkWetWell", "adjustFlow"],
    hazards: ["confinedSpace", "h2s"]
  },
  bnrBasins: {
    name: "BNR Basins (BRB 1-6)", icon: "🦠", color: "#22C55E",
    description: "6 Biological Reactor Basins. Step-feed BNR. 1.5-2.0 mg/L DO target.",
    connections: ["peps", "blowers", "secondary", "yard"],
    equipment: ["BRB-1", "BRB-2", "BRB-3", "BRB-4", "BRB-5", "BRB-6", "MLR-Pumps"],
    npcs: ["christian"],
    actions: ["checkDO", "adjustAeration", "collectMLSS", "checkMLR"],
    hazards: [],
    isOutdoor: true
  },
  blowers: {
    name: "Blower Building (Bldg F)", icon: "💨", color: "#64748B",
    description: "Process air blowers for BNR aeration.",
    connections: ["bnrBasins", "yard"],
    equipment: ["Blower-1", "Blower-2", "Blower-3", "Blower-4", "Blower-5"],
    actions: ["checkBlowers", "adjustOutput"],
    hazards: ["noise", "hot"]
  },
  secondary: {
    name: "Secondary Settling (SST 1-6)", icon: "🔵", color: "#3B82F6",
    description: "6 SSTs. 30 MGD each. 1.9 MG volume. 11.5 ft depth.",
    connections: ["bnrBasins", "ips", "yard"],
    equipment: ["SST-1", "SST-2", "SST-3", "SST-4", "SST-5", "SST-6", "RAS-Pumps", "WAS-Pumps"],
    actions: ["checkBlanket", "checkClarity", "adjustRAS", "wasteWAS"],
    hazards: [],
    isOutdoor: true
  },
  ips: {
    name: "IPS Building", icon: "⬆️", color: "#6366F1",
    description: "4 Intermediate Pumps. 37 MGD each.",
    connections: ["secondary", "filters", "yard"],
    equipment: ["IPS-1", "IPS-2", "IPS-3", "IPS-4"],
    actions: ["checkIPS", "checkWetWell"],
    hazards: ["confinedSpace", "noise"]
  },
  filters: {
    name: "Filter Building (Bldg G)", icon: "📲", color: "#0EA5E9",
    description: "22 Dual Media Filters. 127 MGD. Tertiary settling + rapid mix + floc.",
    connections: ["ips", "uv", "yard", "tunnelG"],
    equipment: ["DMF-1 to DMF-22", "TST-1", "TST-2", "TST-3", "TST-4", "RapidMix", "Floc"],
    actions: ["checkHeadloss", "runBackwash", "checkTurbidity", "checkTSTs"],
    hazards: []
  },
  uv: {
    name: "UV Disinfection (Bldg N)", icon: "☀️", color: "#FBBF24",
    description: "6 UV channels. 23 MGD each. 40 mJ/cm² min dose. Post-aeration.",
    connections: ["filters", "outfall", "yard"],
    equipment: ["UV-1", "UV-2", "UV-3", "UV-4", "UV-5", "UV-6", "PostAer-1", "PostAer-2"],
    actions: ["checkUVDose", "cleanSleeves", "checkLamps", "checkPostAer"],
    hazards: ["uvLight"]
  },
  outfall: {
    name: "Outfall", icon: "🌊", color: "#06B6D4",
    description: "Final effluent to Hunting Creek → Potomac River.",
    connections: ["uv"],
    actions: ["collectSample", "checkFlow", "checkQuality"],
    hazards: [],
    isOutdoor: true
  },
  
  // Solids & Digestion
  digestion: {
    name: "Digestion Complex (Bldg 20)", icon: "🔥", color: "#B45309",
    description: "4 digesters, 1.5 MG each. 95-99°F mesophilic. Powers 50% of plant.",
    connections: ["yard", "solidsHandling"],
    equipment: ["DIG-1", "DIG-2", "DIG-3", "DIG-4", "GasHolder", "Flare", "CHP-1", "CHP-2"],
    npcs: ["paul"],
    actions: ["checkTemps", "checkVAAlk", "checkGas", "checkFlare"],
    hazards: ["h2s", "lel", "hot", "confinedSpace"]
  },
  solidsHandling: {
    name: "Solids Handling (Bldg L)", icon: "🗜️", color: "#78716C",
    description: "Thickening, dewatering, chemical storage. FIFO!",
    connections: ["digestion", "yard"],
    equipment: ["ThickCent-1", "ThickCent-2", "DewaterCent-1", "DewaterCent-2", "PolymerTanks", "BiosolidsSilo"],
    actions: ["checkThickening", "checkDewatering", "adjustPolymer", "rotateFIFO"],
    hazards: ["chemical", "noise"]
  },
  
  // Tunnel System
  tunnel: {
    name: "Utility Tunnel (Main)", icon: "🚇", color: "#1E293B",
    description: "Underground corridors. Pipes, electrical, steam. CONFINED SPACE.",
    connections: ["yard", "tunnelWest", "tunnelEast"],
    actions: ["exploreTunnel", "checkPipes", "checkElectrical"],
    hazards: ["confinedSpace", "oxygenDeficient"],
    isTunnel: true
  },
  tunnelWest: {
    name: "Tunnel (West)", icon: "🚇", color: "#1E293B",
    description: "Runs under digestion. Hot pipes, steam.",
    connections: ["tunnel", "digestion"],
    hazards: ["confinedSpace", "oxygenDeficient", "hot"],
    isTunnel: true
  },
  tunnelEast: {
    name: "Tunnel (East)", icon: "🚇", color: "#1E293B",
    description: "Runs toward UV and outfall.",
    connections: ["tunnel", "uv"],
    hazards: ["confinedSpace", "oxygenDeficient"],
    isTunnel: true
  },
  tunnelG: {
    name: "Tunnel (Bldg G)", icon: "🚇", color: "#1E293B",
    description: "Under Building G. Access to pipe gallery.",
    connections: ["filters", "tunnel"],
    hazards: ["confinedSpace", "oxygenDeficient"],
    isTunnel: true
  }
};

// ============================================
// DAILY TASKS
// ============================================

const TASK_TEMPLATES = [
  { id: "bumpTest", name: "Bump Test 4-Gas", section: "any", xp: 10, skill: "safety", time: 5, required: true },
  { id: "rounds", name: "Complete Rounds", section: "assigned", xp: 20, skill: "process", time: 30 },
  { id: "logReadings", name: "Log SCADA Readings", section: "any", xp: 15, skill: "process", time: 15 },
  { id: "checkScreens", name: "Clear Screen Rags", section: "preliminary", xp: 25, skill: "process", time: 30 },
  { id: "checkGrit", name: "Empty Grit Container", section: "preliminary", xp: 20, skill: "process", time: 20 },
  { id: "walkPSTs", name: "Walk Primary Tanks", section: "preliminary", xp: 25, skill: "process", time: 45 },
  { id: "checkDO", name: "Verify DO Levels", section: "bnr", xp: 30, skill: "process", time: 20 },
  { id: "adjustRAS", name: "Adjust RAS Rates", section: "bnr", xp: 25, skill: "process", time: 15 },
  { id: "checkFilters", name: "Monitor Filter Headloss", section: "tertiary", xp: 20, skill: "process", time: 20 },
  { id: "checkUV", name: "Verify UV Dose", section: "tertiary", xp: 20, skill: "process", time: 15 },
  { id: "checkDigesters", name: "Check Digester Temps", section: "solids", xp: 30, skill: "process", time: 25 },
  { id: "collectSamples", name: "Collect Permit Samples", section: "lab", xp: 40, skill: "lab", time: 45 },
  { id: "microscopy", name: "Microscopy Check", section: "lab", xp: 35, skill: "lab", time: 30 },
  { id: "settleability", name: "Run Settleability", section: "lab", xp: 25, skill: "lab", time: 35 }
];

// ============================================
// RANDOM EVENTS
// ============================================

const EVENTS = [
  { id: "highFlow", name: "⛈️ High Flow Alert", desc: "Storm incoming! Bring additional units online.", urgency: "high", xp: 50, skill: "process" },
  { id: "permitSample", name: "📋 Permit Sample Due", desc: "Time-sensitive compliance sample. Collect within 2 hours.", urgency: "high", xp: 40, skill: "lab" },
  { id: "blowerAlarm", name: "🔔 Blower Alarm", desc: "Blower 2 high temp. Investigate and determine if safe to restart.", urgency: "medium", xp: 30, skill: "troubleshooting" },
  { id: "chemDelivery", name: "🚚 Chemical Delivery", desc: "Polymer truck arriving. Verify FIFO rotation!", urgency: "low", xp: 20, skill: "process" },
  { id: "safetyDrill", name: "🚨 Safety Drill", desc: "Surprise confined space rescue drill! Report to Training.", urgency: "medium", xp: 60, skill: "safety" },
  { id: "vipTour", name: "👔 VIP Tour", desc: "City council visiting in 1 hour. Make your area presentable.", urgency: "low", xp: 15, skill: "process" },
  { id: "filaments", name: "🦠 Filamentous Outbreak", desc: "SVI elevated to 180. Need microscopy to identify organism.", urgency: "medium", xp: 45, skill: "lab" },
  { id: "pumpFail", name: "⬆️ Pump Failure", desc: "RSP-3 tripped on overload. Investigate and reset.", urgency: "high", xp: 40, skill: "troubleshooting" },
  { id: "foaming", name: "🫧 Digester Foaming", desc: "Digester 2 foam buildup. Check VA:Alk and feeding.", urgency: "medium", xp: 35, skill: "process" },
  { id: "h2sAlarm", name: "☠️ H2S Alarm", desc: "H2S at 15 ppm in headworks! Evacuate and ventilate.", urgency: "critical", xp: 75, skill: "safety" },
  { id: "radioCall", name: "📻 Radio Call", desc: "Control room needs you to check something in your area.", urgency: "low", xp: 10, skill: "process" }
];

// ============================================
// WORD OF THE DAY (Lou's special)
// ============================================

const WORDS_OF_THE_DAY = [
  { word: "Salubrious", definition: "Health-giving; healthy. 'Let's keep our effluent salubrious!'", category: "adjective" },
  { word: "Turbidity", definition: "Cloudiness in water from suspended particles. We keep ours low!", category: "wastewater" },
  { word: "Perspicacious", definition: "Having keen insight. 'That was a perspicacious observation about the SVI.'", category: "adjective" },
  { word: "Flocculation", definition: "When particles clump together. Essential for treatment!", category: "wastewater" },
  { word: "Ebullient", definition: "Cheerful and full of energy. Like our best operators!", category: "adjective" },
  { word: "Supernatant", definition: "The liquid above settled solids. Crystal clear is the goal!", category: "wastewater" },
  { word: "Efficacious", definition: "Successful in producing a desired result. Our treatment is highly efficacious!", category: "adjective" },
  { word: "Denitrification", definition: "Converting nitrate to nitrogen gas. Key to meeting ENR!", category: "wastewater" },
  { word: "Sanguine", definition: "Optimistic or positive. Stay sanguine, even during high flows!", category: "adjective" },
  { word: "Anoxic", definition: "Without oxygen. Where our denitrification happens!", category: "wastewater" }
];

// ============================================
// INITIAL STATE
// ============================================

const INITIAL_STATE = {
  // Player
  playerName: "",
  shift: null,
  assignedSection: null,
  operatorLevel: 1,
  
  // Time
  gameTime: 6 * 60, // Minutes from midnight
  day: 1,
  season: "spring",
  weather: "clear",
  
  // Resources
  energy: 100,
  reputation: 50,
  
  // Location
  currentArea: "lockerRoom",
  
  // Skills & XP
  skills: { process: 1, lab: 1, maintenance: 1, safety: 1, troubleshooting: 1 },
  xp: { process: 0, lab: 0, maintenance: 0, safety: 0, troubleshooting: 0 },
  
  // Inventory & Equipment
  inventory: [],
  hasFourGas: false,
  hasPPE: false,
  fourGasBumpTested: false,
  hasRadio: false,
  hasFlashlight: false,
  hasKeys: false,
  
  // Social
  friendships: {},
  
  // Tasks
  tasksAssigned: [],
  tasksCompleted: 0,
  
  // Stats
  shiftsCompleted: 0,
  daysWorked: 0,
  quizCorrect: 0,
  quizTotal: 0,
  microbesIdentified: 0,
  bumpTestsCompleted: 0,
  
  // Events
  activeEvent: null,
  wordOfTheDay: null,
  
  // Flags
  attendedMeeting: false,
  readShiftNotes: false,
  metSupervisor: false,
  
  // UI
  notifications: [],
  gameLog: [],
  
  // Plant Status
  plantStatus: {
    influent: { flow: 38, bod: 220, tss: 250 },
    effluent: { tn: 2.8, tp: 0.25, tss: 3, bod: 5 },
    doLevels: { brb1: 1.8, brb2: 1.9, brb3: 1.7, brb4: 2.0, brb5: 1.8, brb6: 1.9 },
    digesterTemps: { dig1: 97, dig2: 96, dig3: 98, dig4: 97 },
    vaAlk: 0.28,
    svi: 120
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatTime = (mins) => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getStaffOnShift = (shift) => Object.entries(STAFF).filter(([_, s]) => s.shift === shift || s.shift === "days").map(([id, s]) => ({ id, ...s }));

// ============================================
// COMPONENTS
// ============================================

// HUD Component
function GameHUD({ state, onEndShift }) {
  const season = SEASONS[state.season];
  const weather = WEATHER[state.weather];
  const shift = SHIFTS[state.shift];
  const timeLeft = shift ? (shift.endHour * 60 - state.gameTime + (shift.endHour < shift.startHour ? 24 * 60 : 0)) : 0;
  
  return (
    <div style={styles.hud}>
      <div style={styles.hudLeft}>
        <span style={styles.hudItem}>👷 {state.playerName}</span>
        <span style={styles.hudItem}>{season?.icon} Day {state.day}</span>
        <span style={{...styles.hudItem, color: shift?.color}}>{shift?.name}</span>
        {state.assignedSection && (
          <span style={styles.hudItem}>📍 {SECTIONS[state.assignedSection]?.name}</span>
        )}
      </div>
      <div style={styles.hudCenter}>
        <span style={styles.time}>🕐 {formatTime(state.gameTime)}</span>
        <span style={styles.weather}>{weather?.icon} {weather?.name}</span>
        {timeLeft > 0 && <span style={styles.timeLeft}>{Math.floor(timeLeft / 60)}h {timeLeft % 60}m left</span>}
      </div>
      <div style={styles.hudRight}>
        <div style={styles.energyContainer}>
          <div style={styles.energyBar}>
            <div style={{...styles.energyFill, width: `${state.energy}%`}} />
          </div>
          <span style={styles.energyText}>⚡ {Math.round(state.energy)}</span>
        </div>
        <span style={styles.repText}>⭐ {state.reputation}</span>
        <button style={styles.endShiftBtn} onClick={onEndShift}>🏠 End Shift</button>
      </div>
    </div>
  );
}

// Notification System
function Notifications({ notifications, onDismiss }) {
  return (
    <div style={styles.notifArea}>
      {notifications.map((n, i) => (
        <div 
          key={n.id || i} 
          style={{
            ...styles.notif,
            backgroundColor: n.type === 'critical' ? '#7C3AED' : 
                            n.type === 'warning' ? '#DC2626' : 
                            n.type === 'success' ? '#059669' : '#3B82F6'
          }}
          onClick={() => onDismiss(n.id)}
        >
          {n.msg}
          <span style={styles.notifClose}>✕</span>
        </div>
      ))}
    </div>
  );
}

// Skill Panel
function SkillPanel({ state }) {
  return (
    <div style={styles.skillPanel}>
      <h3 style={styles.panelTitle}>📊 Skills</h3>
      {Object.entries(SKILLS).map(([id, skill]) => {
        const { level, current, needed } = calcLevel(state.xp[id]);
        return (
          <div key={id} style={styles.skillRow}>
            <span style={{color: skill.color}}>{skill.icon}</span>
            <span style={styles.skillName}>{skill.name}</span>
            <span style={styles.skillLevel}>Lv.{level}</span>
            <div style={styles.skillBar}>
              <div style={{...styles.skillFill, width: `${(current/needed)*100}%`, backgroundColor: skill.color}} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Task Panel
function TaskPanel({ tasks, state }) {
  const completed = tasks.filter(t => t.completed);
  const pending = tasks.filter(t => !t.completed);
  
  return (
    <div style={styles.taskPanel}>
      <h3 style={styles.panelTitle}>📋 Tasks ({completed.length}/{tasks.length})</h3>
      <div style={styles.taskList}>
        {pending.map((t, i) => (
          <div key={i} style={styles.taskItem}>
            <span style={styles.taskCheck}>☐</span>
            <div style={styles.taskInfo}>
              <span style={styles.taskName}>{t.name}</span>
              <span style={styles.taskMeta}>+{t.xp} XP • {t.time}min</span>
            </div>
          </div>
        ))}
        {completed.map((t, i) => (
          <div key={i} style={{...styles.taskItem, opacity: 0.5}}>
            <span style={{...styles.taskCheck, color: '#22C55E'}}>☑</span>
            <span style={{textDecoration: 'line-through'}}>{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Area View
function AreaView({ area, state, onAction, onMove, onNPCTalk }) {
  const areaData = AREAS[area];
  if (!areaData) return null;
  
  const staffHere = Object.entries(STAFF)
    .filter(([_, s]) => s.location === area && (s.shift === state.shift || s.shift === "days" || !s.shift))
    .map(([id, s]) => ({ id, ...s }));
  
  return (
    <div style={styles.areaView}>
      {/* Header */}
      <div style={styles.areaHeader}>
        <h2 style={{...styles.areaTitle, color: areaData.color}}>
          {areaData.icon} {areaData.name}
        </h2>
        {areaData.isOutdoor && <span style={styles.outdoorBadge}>🌳 Outdoor</span>}
        {areaData.isTunnel && <span style={styles.tunnelBadge}>🚇 Tunnel</span>}
      </div>
      
      {/* Hazards */}
      {areaData.hazards?.length > 0 && (
        <div style={styles.hazardBanner}>
          ⚠️ HAZARDS: {areaData.hazards.map(h => h.toUpperCase()).join(', ')}
          {areaData.hazards.includes('h2s') && !state.fourGasBumpTested && (
            <span style={styles.hazardWarning}> — BUMP TEST REQUIRED!</span>
          )}
        </div>
      )}
      
      {/* Description */}
      <p style={styles.areaDesc}>{areaData.description}</p>
      
      {/* Equipment */}
      {areaData.equipment?.length > 0 && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>🔧 Equipment</h4>
          <div style={styles.equipGrid}>
            {areaData.equipment.slice(0, 8).map((eq, i) => (
              <span key={i} style={styles.equipTag}>{eq}</span>
            ))}
            {areaData.equipment.length > 8 && (
              <span style={styles.moreTag}>+{areaData.equipment.length - 8} more</span>
            )}
          </div>
        </div>
      )}
      
      {/* Staff Present */}
      {staffHere.length > 0 && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>👥 People Here</h4>
          <div style={styles.npcGrid}>
            {staffHere.map(npc => (
              <button key={npc.id} style={styles.npcCard} onClick={() => onNPCTalk(npc)}>
                <span style={styles.npcIcon}>{npc.icon}</span>
                <span style={styles.npcName}>{npc.name}</span>
                <span style={styles.npcRole}>{npc.role}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Actions */}
      {areaData.actions?.length > 0 && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>📋 Actions</h4>
          <div style={styles.actionGrid}>
            {areaData.actions.map((action, i) => (
              <button key={i} style={styles.actionBtn} onClick={() => onAction(action)}>
                {action}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>🚪 Go To</h4>
        <div style={styles.navGrid}>
          {areaData.connections?.map(conn => {
            const dest = AREAS[conn];
            return (
              <button key={conn} style={styles.navBtn} onClick={() => onMove(conn)}>
                {dest?.icon} {dest?.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Morning Meeting Component
function MorningMeeting({ state, onComplete }) {
  const [step, setStep] = useState(0);
  const shift = SHIFTS[state.shift];
  const supervisor = STAFF[shift?.supervisor];
  const wordOfDay = getRandom(WORDS_OF_THE_DAY);
  const sections = Object.entries(SECTIONS);
  const [selectedSection, setSelectedSection] = useState(null);
  
  const steps = [
    // Step 0: Supervisor greeting
    <div key={0} style={styles.meetingStep}>
      <div style={styles.meetingSpeaker}>
        <span style={styles.speakerIcon}>{supervisor?.icon}</span>
        <span style={styles.speakerName}>{supervisor?.name} - {shift?.name} Supervisor</span>
      </div>
      <p style={styles.meetingText}>{shift?.greeting}</p>
      <p style={styles.meetingText}>Let's go over today's assignments and any carryover from last shift.</p>
      <button style={styles.meetingBtn} onClick={() => setStep(1)}>Continue →</button>
    </div>,
    
    // Step 1: Lou's Word of the Day (if day shift)
    state.shift === 'days' ? (
      <div key={1} style={styles.meetingStep}>
        <div style={styles.meetingSpeaker}>
          <span style={styles.speakerIcon}>📖</span>
          <span style={styles.speakerName}>Lou - Team 2 Lead</span>
        </div>
        <p style={styles.meetingText}>*clears throat* Today's Word of the Day is...</p>
        <div style={styles.wordCard}>
          <span style={styles.wordTitle}>{wordOfDay.word}</span>
          <span style={styles.wordDef}>{wordOfDay.definition}</span>
        </div>
        <button style={styles.meetingBtn} onClick={() => setStep(2)}>Continue →</button>
      </div>
    ) : (
      <div key={1} style={styles.meetingStep}>
        <div style={styles.meetingSpeaker}>
          <span style={styles.speakerIcon}>{supervisor?.icon}</span>
          <span style={styles.speakerName}>{supervisor?.name}</span>
        </div>
        <p style={styles.meetingText}>Here's the carryover from the previous shift:</p>
        <ul style={styles.meetingList}>
          <li>Flow is running at {state.plantStatus.influent.flow} MGD</li>
          <li>All digesters holding at temp</li>
          <li>No major alarms</li>
        </ul>
        <button style={styles.meetingBtn} onClick={() => setStep(2)}>Continue →</button>
      </div>
    ),
    
    // Step 2: Section Assignment
    <div key={2} style={styles.meetingStep}>
      <div style={styles.meetingSpeaker}>
        <span style={styles.speakerIcon}>{supervisor?.icon}</span>
        <span style={styles.speakerName}>{supervisor?.name}</span>
      </div>
      <p style={styles.meetingText}>Alright, {state.playerName}, you're assigned to:</p>
      <div style={styles.sectionGrid}>
        {sections.map(([id, sec]) => (
          <button
            key={id}
            style={{
              ...styles.sectionCard,
              borderColor: selectedSection === id ? '#F59E0B' : sec.color,
              backgroundColor: selectedSection === id ? sec.color : 'transparent'
            }}
            onClick={() => setSelectedSection(id)}
          >
            <span style={styles.sectionIcon}>{sec.icon}</span>
            <span style={styles.sectionName}>{sec.name}</span>
          </button>
        ))}
      </div>
      <button 
        style={{...styles.meetingBtn, opacity: selectedSection ? 1 : 0.5}} 
        disabled={!selectedSection}
        onClick={() => onComplete(selectedSection, wordOfDay)}
      >
        ✅ Accept Assignment
      </button>
    </div>
  ];
  
  return (
    <div style={styles.meetingOverlay}>
      <div style={styles.meetingBox}>
        <h2 style={styles.meetingTitle}>☀️ Morning Meeting</h2>
        {steps[step]}
      </div>
    </div>
  );
}

// Dialogue Component
function Dialogue({ npc, state, onClose }) {
  const getDialogue = () => {
    // Special dialogues based on NPC
    if (npc.special === 'digesterExpert') {
      const va = state.plantStatus.vaAlk;
      return va > 0.34 
        ? `*frowns* VA:Alk is at ${va.toFixed(2)}. That's getting into upset territory. Check the feeding schedule.`
        : `Digesters looking good. VA:Alk at ${va.toFixed(2)}. Keep it below 0.34 and we're golden.`;
    }
    if (npc.special === 'doExpert') {
      const dos = state.plantStatus.doLevels;
      const avg = ((dos.brb1 + dos.brb2 + dos.brb3 + dos.brb4 + dos.brb5 + dos.brb6) / 6).toFixed(1);
      return `*checking DO probe* Average DO across basins is ${avg} mg/L. We want 1.5-2.0 for good nitrification.`;
    }
    if (npc.special === 'microbeExpert') {
      const svi = state.plantStatus.svi;
      return svi > 150 
        ? `SVI is ${svi}... that's elevated. Want to take a look under the scope? Could be filaments.`
        : `*looks up from book* Oh hi! SVI is ${svi}, looking healthy. Want to see what's under the scope?`;
    }
    if (npc.special === 'historian') {
      return getRandom([
        "You know, this used to be where the carbon columns were back in '92...",
        "I remember when we first brought the digesters online. What a day!",
        "Did you know this plant serves over 300,000 people? Biggest responsibility there is.",
        "The ENR upgrade was a game-changer. Our bay discharges have never been cleaner."
      ]);
    }
    if (npc.special === 'trainer') {
      return "Welcome! Ready for some CLEARpath training? I've got quiz games, LOTO training, and more.";
    }
    
    // Default dialogues by personality
    const defaults = [
      `Hi, I'm ${npc.name}. ${npc.personality}`,
      `How's your shift going? Need any help out there?`,
      `Stay safe out there. And remember - if you see something, say something.`
    ];
    return getRandom(defaults);
  };
  
  return (
    <div style={styles.dialogueOverlay} onClick={onClose}>
      <div style={styles.dialogueBox} onClick={e => e.stopPropagation()}>
        <div style={styles.dialogueSpeaker}>
          <span style={styles.dialogueIcon}>{npc.icon}</span>
          <div>
            <span style={styles.dialogueName}>{npc.name}</span>
            <span style={styles.dialogueRole}>{npc.role}</span>
          </div>
        </div>
        <p style={styles.dialogueText}>{getDialogue()}</p>
        <p style={styles.dialogueHint}>(Click anywhere to close)</p>
      </div>
    </div>
  );
}

// Quiz Mini-Game
function QuizGame({ onComplete, onExit }) {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [questions] = useState(() => [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5));
  
  const q = questions[qIndex];
  
  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === q.correct) setScore(s => s + 1);
  };
  
  const next = () => {
    if (qIndex >= questions.length - 1) {
      onComplete(score + (selected === q.correct ? 1 : 0), questions.length);
    } else {
      setQIndex(i => i + 1);
      setSelected(null);
      setShowResult(false);
    }
  };
  
  return (
    <div style={styles.miniGame}>
      <div style={styles.miniHeader}>
        <button style={styles.exitBtn} onClick={onExit}>✕</button>
        <h2>❓ FlowState Quiz</h2>
        <span>Q{qIndex + 1}/{questions.length} • Score: {score}</span>
      </div>
      <div style={styles.quizCard}>
        <span style={styles.quizCategory}>{q.category}</span>
        <p style={styles.quizQuestion}>{q.question}</p>
        <div style={styles.quizOptions}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              style={{
                ...styles.quizOption,
                backgroundColor: selected === null ? C.bgLight : 
                  i === q.correct ? '#059669' : 
                  i === selected ? '#DC2626' : C.bgLight,
                borderColor: selected === null ? C.bgMid : 
                  i === q.correct ? '#059669' : 
                  i === selected ? '#DC2626' : C.bgMid
              }}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
            >
              {opt}
            </button>
          ))}
        </div>
        {showResult && (
          <div style={styles.quizResult}>
            <p style={{color: selected === q.correct ? '#22C55E' : '#EF4444', fontWeight: 'bold'}}>
              {selected === q.correct ? '✅ Correct!' : '❌ Incorrect'}
            </p>
            <p style={styles.quizExplanation}>{q.explanation}</p>
            <button style={styles.nextBtn} onClick={next}>
              {qIndex >= questions.length - 1 ? '🏁 Finish' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Microbe Mini-Game
function MicrobeGame({ onComplete, onExit }) {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [microbe, setMicrobe] = useState(() => getRandom(MICROBES));
  const [feedback, setFeedback] = useState(null);
  
  const handleAnswer = (answer) => {
    const correct = (answer === 'good' && microbe.type === 'good') || 
                   (answer === 'problem' && microbe.type === 'problem');
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
    
    setTimeout(() => {
      if (round >= 5) {
        onComplete(score + (correct ? 1 : 0));
      } else {
        setRound(r => r + 1);
        setMicrobe(getRandom(MICROBES));
        setFeedback(null);
      }
    }, 1500);
  };
  
  return (
    <div style={styles.miniGame}>
      <div style={styles.miniHeader}>
        <button style={styles.exitBtn} onClick={onExit}>✕</button>
        <h2>🦠 Microbe ID</h2>
        <span>Round {round}/5 • Score: {score}</span>
      </div>
      <div style={styles.microbeCard}>
        <span style={styles.microbeImage}>{microbe.image}</span>
        <h3 style={styles.microbeName}>{microbe.name}</h3>
        <span style={styles.microbeCategory}>{microbe.category}</span>
        <p style={styles.microbeDesc}>{microbe.description}</p>
        
        {feedback ? (
          <div style={{
            ...styles.microbeFeedback,
            backgroundColor: feedback === 'correct' ? '#059669' : '#DC2626'
          }}>
            {feedback === 'correct' ? '✅ Correct!' : '❌ Wrong!'}
            <br />
            <span style={styles.microbeIndicator}>{microbe.indicator}</span>
          </div>
        ) : (
          <div style={styles.microbeButtons}>
            <button style={{...styles.microbeBtn, backgroundColor: '#059669'}} onClick={() => handleAnswer('good')}>
              ✅ Good Indicator
            </button>
            <button style={{...styles.microbeBtn, backgroundColor: '#DC2626'}} onClick={() => handleAnswer('problem')}>
              ⚠️ Problem Indicator
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Character Create
function CharacterCreate({ onStart }) {
  const [name, setName] = useState('');
  const [shift, setShift] = useState(null);
  
  return (
    <div style={styles.createScreen}>
      <h1 style={styles.createTitle}>🚰 New Operator Registration</h1>
      <p style={styles.createSubtitle}>Welcome to Alexandria Renew Enterprises</p>
      
      <div style={styles.createForm}>
        <label style={styles.label}>Your Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={styles.input}
          maxLength={20}
        />
        
        <label style={styles.label}>Select Your Shift:</label>
        <div style={styles.shiftGrid}>
          {Object.entries(SHIFTS).map(([id, s]) => (
            <button
              key={id}
              style={{
                ...styles.shiftCard,
                borderColor: shift === id ? '#F59E0B' : s.color,
                backgroundColor: shift === id ? s.color : 'transparent'
              }}
              onClick={() => setShift(id)}
            >
              <span style={styles.shiftIcon}>{id === 'days' ? '☀️' : id === 'evenings' ? '🌅' : '🌙'}</span>
              <span style={styles.shiftName}>{s.name}</span>
              <span style={styles.shiftHours}>{s.hours}</span>
            </button>
          ))}
        </div>
        
        <button
          style={{...styles.startBtn, opacity: name && shift ? 1 : 0.5}}
          disabled={!name || !shift}
          onClick={() => onStart(name, shift)}
        >
          🎮 Start Your First Shift
        </button>
      </div>
    </div>
  );
}

// Shift End Screen
function ShiftEnd({ state, onNewShift }) {
  const completed = state.tasksAssigned.filter(t => t.completed).length;
  const total = state.tasksAssigned.length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div style={styles.shiftEndScreen}>
      <h1 style={styles.shiftEndTitle}>😴 Shift Complete!</h1>
      <div style={styles.shiftSummary}>
        <h3>Day {state.day} Summary</h3>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Tasks Completed</span>
            <span style={styles.summaryValue}>{completed}/{total}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Completion Rate</span>
            <span style={styles.summaryValue}>{rate}%</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Reputation</span>
            <span style={styles.summaryValue}>⭐ {state.reputation}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Total XP</span>
            <span style={styles.summaryValue}>{Object.values(state.xp).reduce((a, b) => a + b, 0)}</span>
          </div>
        </div>
        
        <h4>Skills:</h4>
        {Object.entries(SKILLS).map(([id, skill]) => {
          const { level } = calcLevel(state.xp[id]);
          return (
            <div key={id} style={styles.summarySkill}>
              <span style={{color: skill.color}}>{skill.icon}</span>
              <span>{skill.name}:</span>
              <span style={{color: '#F59E0B'}}>Level {level}</span>
            </div>
          );
        })}
      </div>
      <button style={styles.newShiftBtn} onClick={onNewShift}>
        ☀️ Start Next Shift
      </button>
    </div>
  );
}

// ============================================
// MAIN GAME COMPONENT
// ============================================

export default function AlexRenewSimulatorV8() {
  const [state, setState] = useState(INITIAL_STATE);
  const [screen, setScreen] = useState('title');
  const [dialogue, setDialogue] = useState(null);
  const [miniGame, setMiniGame] = useState(null);
  const [showMeeting, setShowMeeting] = useState(false);
  
  // Initialize friendships
  useEffect(() => {
    const friendships = {};
    Object.keys(STAFF).forEach(id => { friendships[id] = 0; });
    setState(s => ({ ...s, friendships }));
  }, []);
  
  // Game loop
  useEffect(() => {
    if (screen === 'game' && !miniGame && !showMeeting && !dialogue) {
      const interval = setInterval(() => {
        setState(s => {
          let newState = { ...s, gameTime: s.gameTime + 1 };
          
          // Random events (1% chance per minute)
          if (Math.random() < 0.01 && !s.activeEvent) {
            const event = getRandom(EVENTS);
            newState.activeEvent = event;
            newState.notifications = [...s.notifications.slice(-3), {
              id: Date.now(),
              msg: `${event.name}: ${event.desc}`,
              type: event.urgency
            }];
          }
          
          // Energy recovery in break room
          if (s.currentArea === 'breakRoom') {
            newState.energy = Math.min(100, s.energy + 0.2);
          }
          
          return newState;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [screen, miniGame, showMeeting, dialogue]);
  
  // Notification auto-dismiss
  useEffect(() => {
    if (state.notifications.length > 0) {
      const timer = setTimeout(() => {
        setState(s => ({ ...s, notifications: s.notifications.slice(1) }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.notifications]);
  
  // Helpers
  const notify = useCallback((msg, type = 'info') => {
    setState(s => ({
      ...s,
      notifications: [...s.notifications.slice(-3), { id: Date.now(), msg, type }]
    }));
  }, []);
  
  const addXP = useCallback((skill, amount) => {
    setState(s => {
      const newXP = s.xp[skill] + amount;
      const oldLevel = calcLevel(s.xp[skill]).level;
      const newLevel = calcLevel(newXP).level;
      if (newLevel > oldLevel) {
        notify(`🎉 ${SKILLS[skill].name} leveled up to ${newLevel}!`, 'success');
      }
      return {
        ...s,
        xp: { ...s.xp, [skill]: newXP },
        skills: { ...s.skills, [skill]: newLevel }
      };
    });
  }, [notify]);
  
  const dismissNotif = useCallback((id) => {
    setState(s => ({
      ...s,
      notifications: s.notifications.filter(n => n.id !== id)
    }));
  }, []);
  
  // Start game
  const startGame = (name, shift) => {
    const shiftData = SHIFTS[shift];
    setState(s => ({
      ...INITIAL_STATE,
      playerName: name,
      shift,
      gameTime: shiftData.startHour * 60,
      currentArea: 'lockerRoom',
      friendships: s.friendships
    }));
    setScreen('game');
    setShowMeeting(false);
    notify(`Welcome, ${name}! Get your gear from the locker.`, 'info');
  };
  
  // Complete morning meeting
  const completeMeeting = (section, wordOfDay) => {
    const sectionData = SECTIONS[section];
    const tasks = TASK_TEMPLATES.filter(t => 
      t.section === 'any' || t.section === section || t.section === 'assigned'
    ).map(t => ({ ...t, completed: false }));
    
    setState(s => ({
      ...s,
      assignedSection: section,
      tasksAssigned: tasks,
      attendedMeeting: true,
      wordOfTheDay: wordOfDay
    }));
    setShowMeeting(false);
    notify(`Assigned to ${sectionData.name}. Check your tasks!`, 'success');
  };
  
  // Move to area
  const moveToArea = useCallback((dest) => {
    const destArea = AREAS[dest];
    if (!destArea) return;
    
    // Check hazard requirements
    if (destArea.hazards?.includes('h2s') && !state.fourGasBumpTested) {
      notify("⚠️ Bump test your 4-gas before entering this area!", 'warning');
      return;
    }
    if (destArea.isTunnel && !state.hasFlashlight) {
      notify("🔦 You need a flashlight to enter the tunnel!", 'warning');
      return;
    }
    
    setState(s => ({
      ...s,
      currentArea: dest,
      energy: Math.max(0, s.energy - (destArea.isOutdoor ? 3 : 2))
    }));
  }, [state.fourGasBumpTested, state.hasFlashlight, notify]);
  
  // Handle actions
  const handleAction = useCallback((action) => {
    switch(action) {
      case 'getGear':
        setState(s => ({
          ...s,
          hasFourGas: true,
          hasPPE: true,
          hasRadio: true,
          hasFlashlight: true,
          hasKeys: true,
          inventory: ['4-Gas Monitor', 'Hard Hat', 'Safety Vest', 'Radio', 'Flashlight', 'Keys']
        }));
        notify("🦺 Grabbed gear: 4-gas, PPE, radio, flashlight, keys", 'success');
        break;
        
      case 'bumpTest':
        if (!state.hasFourGas) {
          notify("Get your 4-gas from the locker first!", 'warning');
          return;
        }
        setState(s => ({
          ...s,
          fourGasBumpTested: true,
          bumpTestsCompleted: s.bumpTestsCompleted + 1,
          energy: Math.max(0, s.energy - 2),
          tasksAssigned: s.tasksAssigned.map(t => 
            t.id === 'bumpTest' ? { ...t, completed: true } : t
          )
        }));
        addXP('safety', 10);
        notify("✅ Bump test complete! O2: 20.9%, LEL: 0%, H2S: 0, CO: 0", 'success');
        break;
        
      case 'checkSCADA':
      case 'readNotes':
        if (!state.attendedMeeting) {
          setShowMeeting(true);
          return;
        }
        addXP('process', 5);
        const ps = state.plantStatus;
        notify(`📊 Flow: ${ps.influent.flow} MGD | TN: ${ps.effluent.tn} | TP: ${ps.effluent.tp}`, 'info');
        break;
        
      case 'takeQuiz':
        setMiniGame('quiz');
        break;
        
      case 'microscopy':
        setMiniGame('microbe');
        break;
        
      case 'rest':
      case 'getCoffee':
        setState(s => ({
          ...s,
          energy: Math.min(100, s.energy + 20),
          gameTime: s.gameTime + 15
        }));
        notify("☕ Break time! Energy restored.", 'success');
        break;
        
      case 'checkDO':
        addXP('process', 10);
        const dos = state.plantStatus.doLevels;
        notify(`DO: BRB1: ${dos.brb1}, BRB2: ${dos.brb2}, BRB3: ${dos.brb3}, BRB4: ${dos.brb4} mg/L`, 'info');
        break;
        
      case 'checkTemps':
      case 'checkDigesters':
        addXP('process', 12);
        const temps = state.plantStatus.digesterTemps;
        notify(`🌡️ Temps: D1: ${temps.dig1}°F, D2: ${temps.dig2}°F, D3: ${temps.dig3}°F, D4: ${temps.dig4}°F`, 'info');
        break;
        
      case 'checkVAAlk':
        addXP('process', 15);
        const va = state.plantStatus.vaAlk;
        const status = va > 0.34 ? '⚠️ ELEVATED' : '✅ Normal';
        notify(`VA:Alk ratio: ${va.toFixed(2)} ${status}`, va > 0.34 ? 'warning' : 'info');
        break;
        
      case 'exploreTunnel':
        if (!state.fourGasBumpTested) {
          notify("⚠️ 4-gas bump test required for tunnel!", 'warning');
          return;
        }
        addXP('safety', 15);
        notify("🔦 Exploring tunnel. Pipes, conduits, steam lines overhead.", 'info');
        break;
        
      default:
        setState(s => ({ ...s, energy: Math.max(0, s.energy - 5) }));
        addXP('process', 5);
        notify(`✅ ${action} complete`, 'success');
    }
  }, [state, addXP, notify]);
  
  // NPC talk
  const handleNPCTalk = useCallback((npc) => {
    setDialogue(npc);
    setState(s => ({
      ...s,
      friendships: {
        ...s.friendships,
        [npc.id]: Math.min(10, (s.friendships[npc.id] || 0) + 1)
      }
    }));
  }, []);
  
  // Mini-game complete
  const handleMiniGameComplete = (score, total) => {
    if (miniGame === 'quiz') {
      addXP('process', score * 10);
      setState(s => ({
        ...s,
        quizCorrect: s.quizCorrect + score,
        quizTotal: s.quizTotal + (total || 5)
      }));
      notify(`Quiz complete! ${score}/${total || 5} correct. +${score * 10} XP`, 'success');
    } else if (miniGame === 'microbe') {
      addXP('lab', score * 8);
      setState(s => ({ ...s, microbesIdentified: s.microbesIdentified + score }));
      notify(`Microbe ID complete! ${score}/5 identified. +${score * 8} XP`, 'success');
    }
    setMiniGame(null);
  };
  
  // End shift
  const endShift = () => {
    const completed = state.tasksAssigned.filter(t => t.completed).length;
    const total = state.tasksAssigned.length;
    const rate = total > 0 ? completed / total : 0;
    
    let repChange = rate >= 0.8 ? 5 : rate >= 0.5 ? 0 : -5;
    
    setState(s => ({
      ...s,
      daysWorked: s.daysWorked + 1,
      shiftsCompleted: s.shiftsCompleted + 1,
      reputation: Math.max(0, Math.min(100, s.reputation + repChange))
    }));
    
    setScreen('shiftEnd');
  };
  
  // New shift
  const startNewShift = () => {
    const shiftData = SHIFTS[state.shift];
    setState(s => ({
      ...s,
      day: s.day + 1,
      gameTime: shiftData.startHour * 60,
      energy: 100,
      fourGasBumpTested: false,
      tasksAssigned: [],
      assignedSection: null,
      attendedMeeting: false,
      currentArea: 'lockerRoom',
      activeEvent: null
    }));
    setScreen('game');
  };
  
  // ============================================
  // RENDER
  // ============================================
  
  // Title Screen
  if (screen === 'title') {
    return (
      <div style={styles.titleScreen}>
        <div style={styles.titleLogo}>🚰</div>
        <h1 style={styles.titleText}>ALEXRENEW</h1>
        <h2 style={styles.titleSubtext}>Wastewater Operator Simulator</h2>
        <p style={styles.version}>v{GAME_VERSION} - Complete Edition</p>
        
        <div style={styles.titleStats}>
          <span>🏭 25+ Areas</span>
          <span>👥 28 NPCs</span>
          <span>🎯 40 Quiz Questions</span>
          <span>🦠 12 Microbes</span>
          <span>📋 Shift System</span>
        </div>
        
        <button style={styles.playBtn} onClick={() => setScreen('create')}>
          🎮 New Game
        </button>
        
        <p style={styles.credits}>
          Professional training for wastewater operators<br/>
          Based on Holland Lane Campus
        </p>
      </div>
    );
  }
  
  // Character Create
  if (screen === 'create') {
    return <CharacterCreate onStart={startGame} />;
  }
  
  // Shift End
  if (screen === 'shiftEnd') {
    return <ShiftEnd state={state} onNewShift={startNewShift} />;
  }
  
  // Mini-Games
  if (miniGame === 'quiz') {
    return <QuizGame onComplete={handleMiniGameComplete} onExit={() => setMiniGame(null)} />;
  }
  if (miniGame === 'microbe') {
    return <MicrobeGame onComplete={handleMiniGameComplete} onExit={() => setMiniGame(null)} />;
  }
  
  // Main Game
  if (screen === 'game') {
    return (
      <div style={styles.gameScreen}>
        <GameHUD state={state} onEndShift={endShift} />
        
        <Notifications notifications={state.notifications} onDismiss={dismissNotif} />
        
        {/* Active Event Banner */}
        {state.activeEvent && (
          <div style={styles.eventBanner}>
            <strong>{state.activeEvent.name}</strong>
            <p>{state.activeEvent.desc}</p>
            <button style={styles.eventBtn} onClick={() => {
              addXP(state.activeEvent.skill, state.activeEvent.xp);
              setState(s => ({ ...s, activeEvent: null }));
              notify(`Event handled! +${state.activeEvent.xp} XP`, 'success');
            }}>
              ✅ Handle Event (+{state.activeEvent.xp} XP)
            </button>
          </div>
        )}
        
        <div style={styles.mainContent}>
          {/* Left Panel */}
          <div style={styles.leftPanel}>
            <SkillPanel state={state} />
            <TaskPanel tasks={state.tasksAssigned} state={state} />
          </div>
          
          {/* Center - Area View */}
          <AreaView 
            area={state.currentArea}
            state={state}
            onAction={handleAction}
            onMove={moveToArea}
            onNPCTalk={handleNPCTalk}
          />
          
          {/* Right Panel - Inventory */}
          <div style={styles.rightPanel}>
            <h3 style={styles.panelTitle}>🎒 Inventory</h3>
            {state.inventory.length === 0 ? (
              <p style={styles.emptyInv}>Empty - get gear from locker</p>
            ) : (
              <div style={styles.invList}>
                {state.inventory.map((item, i) => (
                  <div key={i} style={styles.invItem}>{item}</div>
                ))}
              </div>
            )}
            
            <div style={styles.statusSection}>
              <h4 style={styles.statusTitle}>📊 Status</h4>
              <p style={styles.statusItem}>
                4-Gas: {state.fourGasBumpTested ? '✅ Bump Tested' : state.hasFourGas ? '⚠️ Not Tested' : '❌ Not Grabbed'}
              </p>
              <p style={styles.statusItem}>Bump Tests: {state.bumpTestsCompleted}</p>
              <p style={styles.statusItem}>Quiz Score: {state.quizCorrect}/{state.quizTotal}</p>
              <p style={styles.statusItem}>Microbes ID'd: {state.microbesIdentified}</p>
            </div>
            
            {state.wordOfTheDay && (
              <div style={styles.wordSection}>
                <h4 style={styles.wordTitle}>📖 Word of the Day</h4>
                <p style={styles.wordWord}>{state.wordOfTheDay.word}</p>
                <p style={styles.wordDef}>{state.wordOfTheDay.definition}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Morning Meeting Overlay */}
        {showMeeting && (
          <MorningMeeting state={state} onComplete={completeMeeting} />
        )}
        
        {/* Dialogue Overlay */}
        {dialogue && (
          <Dialogue npc={dialogue} state={state} onClose={() => setDialogue(null)} />
        )}
      </div>
    );
  }
  
  return null;
}

// ============================================
// STYLES
// ============================================

const styles = {
  // Title Screen
  titleScreen: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', backgroundColor: C.bgDark, color: C.textLight, textAlign: 'center', padding: 20
  },
  titleLogo: { fontSize: 80, marginBottom: 20 },
  titleText: { fontSize: 42, color: '#3B82F6', marginBottom: 10, fontWeight: 'bold', letterSpacing: 4 },
  titleSubtext: { fontSize: 18, color: C.textMuted, marginBottom: 10 },
  version: { fontSize: 12, color: C.textMuted, marginBottom: 30 },
  titleStats: { display: 'flex', gap: 20, marginBottom: 30, flexWrap: 'wrap', justifyContent: 'center', fontSize: 12, color: C.textMuted },
  playBtn: { padding: '18px 50px', fontSize: 20, backgroundColor: '#22C55E', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 12, fontWeight: 'bold', marginBottom: 30 },
  credits: { fontSize: 11, color: C.textMuted, lineHeight: 1.8 },
  
  // Character Create
  createScreen: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', backgroundColor: C.bgDark, color: C.textLight, padding: 20
  },
  createTitle: { fontSize: 28, marginBottom: 10 },
  createSubtitle: { fontSize: 14, color: C.textMuted, marginBottom: 30 },
  createForm: { display: 'flex', flexDirection: 'column', gap: 15, width: '100%', maxWidth: 500 },
  label: { fontSize: 14, color: C.textMuted },
  input: { padding: 14, fontSize: 16, backgroundColor: C.bgMid, border: `2px solid ${C.bgLight}`, color: C.textLight, borderRadius: 8 },
  shiftGrid: { display: 'flex', gap: 15, justifyContent: 'center', flexWrap: 'wrap' },
  shiftCard: { padding: 20, width: 150, border: '3px solid', cursor: 'pointer', textAlign: 'center', borderRadius: 12, backgroundColor: 'transparent', color: C.textLight, display: 'flex', flexDirection: 'column', gap: 8 },
  shiftIcon: { fontSize: 32 },
  shiftName: { fontSize: 14, fontWeight: 'bold' },
  shiftHours: { fontSize: 11, color: C.textMuted },
  startBtn: { padding: 18, fontSize: 18, backgroundColor: '#22C55E', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 12, marginTop: 20, fontWeight: 'bold' },
  
  // Game Screen
  gameScreen: { minHeight: '100vh', backgroundColor: C.bgDark, color: C.textLight, display: 'flex', flexDirection: 'column' },
  
  // HUD
  hud: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', backgroundColor: C.bgMid, borderBottom: `2px solid ${C.bgLight}` },
  hudLeft: { display: 'flex', gap: 20, alignItems: 'center' },
  hudCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  hudRight: { display: 'flex', gap: 20, alignItems: 'center' },
  hudItem: { fontSize: 13 },
  time: { fontSize: 20, color: '#FBBF24', fontWeight: 'bold' },
  weather: { fontSize: 12, color: C.textMuted },
  timeLeft: { fontSize: 11, color: C.textMuted },
  energyContainer: { display: 'flex', alignItems: 'center', gap: 8 },
  energyBar: { width: 100, height: 14, backgroundColor: C.bgLight, borderRadius: 7, overflow: 'hidden' },
  energyFill: { height: '100%', backgroundColor: '#22C55E', transition: 'width 0.3s' },
  energyText: { fontSize: 12 },
  repText: { fontSize: 12 },
  endShiftBtn: { padding: '8px 16px', backgroundColor: '#7C3AED', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 6, fontSize: 12 },
  
  // Main Content
  mainContent: { display: 'flex', flex: 1, gap: 15, padding: 15, overflow: 'hidden' },
  
  // Left Panel
  leftPanel: { width: 220, display: 'flex', flexDirection: 'column', gap: 15 },
  
  // Right Panel
  rightPanel: { width: 220, backgroundColor: C.bgMid, borderRadius: 12, padding: 15, display: 'flex', flexDirection: 'column', gap: 15, overflowY: 'auto' },
  emptyInv: { color: C.textMuted, fontSize: 12 },
  invList: { display: 'flex', flexDirection: 'column', gap: 6 },
  invItem: { padding: 8, backgroundColor: C.bgLight, borderRadius: 6, fontSize: 11 },
  statusSection: { borderTop: `1px solid ${C.bgLight}`, paddingTop: 15 },
  statusTitle: { fontSize: 12, marginBottom: 10, color: C.textMuted },
  statusItem: { fontSize: 11, marginBottom: 6 },
  wordSection: { borderTop: `1px solid ${C.bgLight}`, paddingTop: 15 },
  wordTitle: { fontSize: 12, color: '#FBBF24', marginBottom: 8 },
  wordWord: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  wordDef: { fontSize: 11, color: C.textMuted, lineHeight: 1.6 },
  
  // Skill Panel
  skillPanel: { backgroundColor: C.bgMid, borderRadius: 12, padding: 15 },
  panelTitle: { fontSize: 14, marginBottom: 15, color: '#3B82F6' },
  skillRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 11 },
  skillName: { flex: 1, fontSize: 10 },
  skillLevel: { color: '#FBBF24', minWidth: 40 },
  skillBar: { width: 50, height: 6, backgroundColor: C.bgLight, borderRadius: 3, overflow: 'hidden' },
  skillFill: { height: '100%', transition: 'width 0.3s' },
  
  // Task Panel
  taskPanel: { backgroundColor: C.bgMid, borderRadius: 12, padding: 15, flex: 1, overflowY: 'auto' },
  taskList: { display: 'flex', flexDirection: 'column', gap: 8 },
  taskItem: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: 8, backgroundColor: C.bgDark, borderRadius: 6 },
  taskCheck: { fontSize: 14 },
  taskInfo: { display: 'flex', flexDirection: 'column' },
  taskName: { fontSize: 11 },
  taskMeta: { fontSize: 9, color: C.textMuted },
  
  // Area View
  areaView: { flex: 1, backgroundColor: C.bgMid, borderRadius: 12, padding: 20, overflowY: 'auto' },
  areaHeader: { display: 'flex', alignItems: 'center', gap: 15, marginBottom: 15 },
  areaTitle: { fontSize: 22, margin: 0 },
  outdoorBadge: { padding: '4px 10px', backgroundColor: '#22C55E', borderRadius: 12, fontSize: 10 },
  tunnelBadge: { padding: '4px 10px', backgroundColor: '#374151', borderRadius: 12, fontSize: 10 },
  hazardBanner: { backgroundColor: '#7F1D1D', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 12 },
  hazardWarning: { color: '#FCA5A5' },
  areaDesc: { color: C.textMuted, marginBottom: 20, lineHeight: 1.6, fontSize: 13 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, color: C.textMuted, marginBottom: 10 },
  equipGrid: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  equipTag: { padding: '6px 12px', backgroundColor: C.bgLight, borderRadius: 6, fontSize: 10 },
  moreTag: { padding: '6px 12px', color: C.textMuted, fontSize: 10 },
  npcGrid: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  npcCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 12, backgroundColor: C.bgLight, borderRadius: 10, cursor: 'pointer', border: 'none', color: C.textLight, minWidth: 90, gap: 4 },
  npcIcon: { fontSize: 28 },
  npcName: { fontSize: 12, fontWeight: 'bold' },
  npcRole: { fontSize: 9, color: C.textMuted, textAlign: 'center' },
  actionGrid: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  actionBtn: { padding: '10px 18px', backgroundColor: '#22C55E', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 8, fontSize: 12 },
  navGrid: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  navBtn: { padding: '10px 18px', backgroundColor: C.bgLight, border: `2px solid ${C.bgMid}`, color: C.textLight, cursor: 'pointer', borderRadius: 8, fontSize: 12 },
  
  // Notifications
  notifArea: { position: 'fixed', top: 80, right: 20, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 100, maxWidth: 350 },
  notif: { padding: '12px 40px 12px 16px', borderRadius: 8, fontSize: 12, color: '#fff', cursor: 'pointer', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' },
  notifClose: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.7 },
  
  // Event Banner
  eventBanner: { margin: '0 15px 15px', padding: 15, backgroundColor: '#7F1D1D', border: '3px solid #DC2626', borderRadius: 12 },
  eventBtn: { marginTop: 10, padding: '10px 20px', backgroundColor: '#22C55E', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 8, fontSize: 12 },
  
  // Dialogue
  dialogueOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  dialogueBox: { backgroundColor: C.bgMid, border: `4px solid #3B82F6`, padding: 30, maxWidth: 450, borderRadius: 16, textAlign: 'center' },
  dialogueSpeaker: { display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20, justifyContent: 'center' },
  dialogueIcon: { fontSize: 40 },
  dialogueName: { fontSize: 18, fontWeight: 'bold', display: 'block' },
  dialogueRole: { fontSize: 12, color: C.textMuted },
  dialogueText: { fontSize: 14, lineHeight: 1.8, marginBottom: 15 },
  dialogueHint: { fontSize: 11, color: C.textMuted },
  
  // Morning Meeting
  meetingOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  meetingBox: { backgroundColor: C.bgMid, border: `4px solid #FBBF24`, padding: 30, maxWidth: 550, borderRadius: 16 },
  meetingTitle: { textAlign: 'center', marginBottom: 25, color: '#FBBF24' },
  meetingStep: { display: 'flex', flexDirection: 'column', gap: 15 },
  meetingSpeaker: { display: 'flex', alignItems: 'center', gap: 12 },
  speakerIcon: { fontSize: 32 },
  speakerName: { fontSize: 14, color: '#FBBF24' },
  meetingText: { fontSize: 14, lineHeight: 1.8 },
  meetingList: { paddingLeft: 20, lineHeight: 2 },
  meetingBtn: { padding: '12px 30px', backgroundColor: '#3B82F6', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 8, alignSelf: 'center', marginTop: 10 },
  wordCard: { backgroundColor: C.bgDark, padding: 20, borderRadius: 12, textAlign: 'center' },
  wordTitle: { fontSize: 24, fontWeight: 'bold', color: '#FBBF24', display: 'block', marginBottom: 10 },
  wordDef: { fontSize: 13, color: C.textMuted, lineHeight: 1.6 },
  sectionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 15 },
  sectionCard: { padding: 15, border: '3px solid', cursor: 'pointer', borderRadius: 10, backgroundColor: 'transparent', color: C.textLight, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  sectionIcon: { fontSize: 28 },
  sectionName: { fontSize: 12, textAlign: 'center' },
  
  // Mini-Games
  miniGame: { minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: 20, backgroundColor: C.bgDark, color: C.textLight },
  miniHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  exitBtn: { padding: '10px 18px', backgroundColor: '#DC2626', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 8, fontSize: 16 },
  quizCard: { backgroundColor: C.bgMid, padding: 30, borderRadius: 16, flex: 1 },
  quizCategory: { display: 'inline-block', padding: '6px 14px', backgroundColor: '#3B82F6', borderRadius: 20, fontSize: 11, marginBottom: 20 },
  quizQuestion: { fontSize: 16, lineHeight: 1.8, marginBottom: 25 },
  quizOptions: { display: 'flex', flexDirection: 'column', gap: 12 },
  quizOption: { padding: 16, color: '#fff', border: '3px solid', cursor: 'pointer', fontSize: 13, textAlign: 'left', borderRadius: 10 },
  quizResult: { marginTop: 25, padding: 20, backgroundColor: C.bgDark, borderRadius: 10 },
  quizExplanation: { fontSize: 12, color: C.textMuted, marginBottom: 15, lineHeight: 1.6 },
  nextBtn: { padding: '14px 35px', backgroundColor: '#3B82F6', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 10, fontSize: 14 },
  microbeCard: { backgroundColor: C.bgMid, padding: 35, borderRadius: 16, textAlign: 'center', flex: 1 },
  microbeImage: { fontSize: 70, display: 'block', marginBottom: 15 },
  microbeName: { fontSize: 24, marginBottom: 5 },
  microbeCategory: { fontSize: 12, color: C.textMuted, marginBottom: 15 },
  microbeDesc: { fontSize: 14, color: C.textMuted, lineHeight: 1.6, marginBottom: 20 },
  microbeButtons: { display: 'flex', gap: 20, justifyContent: 'center' },
  microbeBtn: { padding: '16px 35px', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 10, fontSize: 14 },
  microbeFeedback: { marginTop: 25, padding: 20, borderRadius: 10, fontSize: 16 },
  microbeIndicator: { fontSize: 13, opacity: 0.9 },
  
  // Shift End
  shiftEndScreen: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', backgroundColor: C.bgDark, color: C.textLight, padding: 30
  },
  shiftEndTitle: { fontSize: 32, marginBottom: 25 },
  shiftSummary: { backgroundColor: C.bgMid, padding: 30, borderRadius: 16, minWidth: 350, marginBottom: 25 },
  summaryGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 20 },
  summaryItem: { display: 'flex', flexDirection: 'column', gap: 5 },
  summaryLabel: { fontSize: 11, color: C.textMuted },
  summaryValue: { fontSize: 18, fontWeight: 'bold' },
  summarySkill: { display: 'flex', gap: 10, marginBottom: 8, fontSize: 12 },
  newShiftBtn: { padding: '18px 50px', fontSize: 18, backgroundColor: '#22C55E', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 12, fontWeight: 'bold' }
};
