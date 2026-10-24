// ====================================
// JARVIS FUTURISTIC SOUND SYSTEM
// ====================================

let soundContext;

function playSound(type = "click") {
try {
const AudioContextClass =
window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!soundContext) {
        soundContext = new AudioContextClass();
    }

    if (soundContext.state === "suspended") {
        soundContext.resume();
    }

    const now = soundContext.currentTime;
    const oscillator = soundContext.createOscillator();
    const gain = soundContext.createGain();

    const sounds = {
        click:     { frequency: 650, duration: 0.06, volume: 0.035 },
        activate:  { frequency: 520, duration: 0.20, volume: 0.06 },
        transition:{ frequency: 380, duration: 0.24, volume: 0.05 },
        startup:   { frequency: 720, duration: 0.30, volume: 0.05 },
        message:   { frequency: 880, duration: 0.10, volume: 0.04 },
        success:   { frequency: 950, duration: 0.35, volume: 0.18 },
error:     { frequency: 180, duration: 0.30, volume: 0.16 },
victory:   { frequency: 1040, duration: 0.40, volume: 0.12 }
    };

    const sound = sounds[type] || sounds.click;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
        sound.frequency, now
    );

    if (type === "activate" || type === "startup") {
        oscillator.frequency.exponentialRampToValueAtTime(
            sound.frequency * 1.5,
            now + sound.duration
        );
    }

    gain.gain.setValueAtTime(sound.volume, now);
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + sound.duration
    );

    oscillator.connect(gain);
    gain.connect(soundContext.destination);

    oscillator.start(now);
    oscillator.stop(now + sound.duration);
} catch (error) {
    // Sound effects are optional; the website still works without them.
}

}
function startExhibition() {
    playSound("activate");

    const welcome = document.getElementById("welcome-page");
    const menu = document.getElementById("main-menu");
    const quiz = document.getElementById("quiz-page");

    welcome.classList.add("hidden");
    menu.classList.remove("hidden");
    quiz.classList.add("hidden");

    welcome.style.display = "none";
    menu.style.display = "block";
    quiz.style.display = "none";

    window.scrollTo(0, 0);
}

function goHome() {
    playSound("click");

    const quiz = document.getElementById("quiz-page");
    const menu = document.getElementById("main-menu");
    const welcome = document.getElementById("welcome-page");

    quiz.classList.add("hidden");
    menu.classList.add("hidden");
    welcome.classList.remove("hidden");

    quiz.style.display = "none";
    menu.style.display = "none";
    welcome.style.display = "block";

    window.scrollTo(0, 0);
}

function openSection(section) {
    playSound("transition");

    if (section === "games") {
        document.getElementById("welcome-page").style.display = "none";
        document.getElementById("main-menu").style.display = "none";
        document.getElementById("quiz-page").style.display = "block";
      document.getElementById("quiz-page").classList.remove("hidden");
        showQuizMenu();

 } else if (section === "presentation") {
    openPresentation();
    }
}

function openJarvis() {
  playSound("startup");
document.getElementById("jarvis-panel").classList.remove("hidden");
document.getElementById("jarvis-bubble").classList.add("hidden");
}

function closeJarvis() {
  playSound("click");
document.getElementById("jarvis-panel").classList.add("hidden");
document.getElementById("jarvis-bubble").classList.remove("hidden");
}

function askJarvis(question) {
document.getElementById("chat-input").value = question;
respondToJarvis(question);
}

function sendMessage(event) {
event.preventDefault();

const input = document.getElementById("chat-input");
const question = input.value.trim();

if (!question) return;

input.value = "";
respondToJarvis(question);

}

async function respondToJarvis(question) {
const messages = document.getElementById("chat-messages");

const userMessage = document.createElement("div");
userMessage.className = "user-message";
userMessage.textContent = question;
messages.appendChild(userMessage);

const botMessage = document.createElement("div");
botMessage.className = "bot-message";
botMessage.textContent = "JARVIS is thinking...";
messages.appendChild(botMessage);

messages.scrollTop = messages.scrollHeight;

try {
    const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: question })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "AI request failed");
    }

    botMessage.textContent = data.answer;
} catch (error) {
    console.error("JARVIS error:", error);
    botMessage.textContent = error.message || "Unknown error";
}

messages.scrollTop = messages.scrollHeight;

}

function getJarvisAnswer(question) {
const q = question.toLowerCase();

if (q.includes("what is ai") ||
    q.includes("artificial intelligence")) {
    return "Artificial Intelligence (AI) is a branch of computer science that enables machines to perform tasks that usually require human intelligence, such as learning, reasoning, and understanding language.";
}

if (q.includes("how") && q.includes("ai work")) {
    return "AI systems use algorithms and data to identify patterns, make predictions, and produce results. Different AI systems work in different ways.";
}

if (q.includes("where") ||
    q.includes("uses of ai") ||
    q.includes("used")) {
    return "AI is used in healthcare, education, transport, agriculture, robotics, translation, and many other fields.";
}

if (q.includes("machine learning")) {
    return "Machine learning is a type of AI in which computers learn patterns from data to make predictions or decisions without being explicitly programmed for every situation.";
}

if (q.includes("hello") || q.includes("hi")) {
    return "Hello! Welcome to our School Exhibition. What would you like to learn about technology today?";
}

if (q.includes("who are you") || q.includes("your name")) {
    return "I am JARVIS, the virtual assistant for this School Exhibition website. I can answer some educational questions about AI and technology.";
}

if (q.includes("thank")) {
    return "You're welcome! Keep exploring and learning.";
}

return "I am currently a basic exhibition assistant with prepared answers, not a live AI model. Try asking me about Artificial Intelligence, machine learning, or the uses of AI.";

}
// ==========================================
// JARVIS KNOWLEDGE ARENA — QUIZ QUESTION BANK
// ==========================================

const quizQuestions = {

    science: [
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            answer: 1,
            explanation: "Mars is called the Red Planet because iron minerals in its soil create a reddish appearance."
        },
        {
            question: "What is the basic unit of life?",
            options: ["Tissue", "Organ", "Cell", "Atom"],
            answer: 2,
            explanation: "The cell is the basic structural and functional unit of living organisms."
        },
        {
            question: "Which gas do plants absorb during photosynthesis?",
            options: ["Oxygen", "Nitrogen", "Hydrogen", "Carbon dioxide"],
            answer: 3,
            explanation: "Plants use carbon dioxide, water, and light energy to produce food during photosynthesis."
        },
        {
            question: "What is the chemical formula of water?",
            options: ["CO₂", "H₂O", "O₂", "NaCl"],
            answer: 1,
            explanation: "A water molecule contains two hydrogen atoms and one oxygen atom."
        },
        {
            question: "Which organ pumps blood throughout the human body?",
            options: ["Brain", "Lungs", "Heart", "Kidneys"],
            answer: 2,
            explanation: "The heart contracts to pump blood through the circulatory system."
        },
        {
            question: "What force pulls objects towards the Earth?",
            options: ["Friction", "Magnetism", "Gravity", "Electricity"],
            answer: 2,
            explanation: "Gravity is the force of attraction between objects with mass."
        },
        {
            question: "Which part of a plant absorbs most water from the soil?",
            options: ["Flowers", "Roots", "Leaves", "Fruits"],
            answer: 1,
            explanation: "Roots absorb water and minerals from the soil. Root hairs help increase absorption."
        },
        {
            question: "What is the SI unit of force?",
            options: ["Joule", "Watt", "Newton", "Pascal"],
            answer: 2,
            explanation: "Force is measured in newtons (N), named after scientist Isaac Newton."
        },
        {
            question: "Which is a renewable source of energy?",
            options: ["Coal", "Petroleum", "Natural gas", "Solar energy"],
            answer: 3,
            explanation: "Solar energy comes from sunlight, which is naturally replenished."
        },
        {
            question: "Which blood cells help fight infections?",
            options: ["Red blood cells", "White blood cells", "Platelets", "Plasma only"],
            answer: 1,
            explanation: "White blood cells help protect the body against infections and harmful organisms."
        }
    ],

    ai: [
        {
            question: "What does AI stand for in computer science?",
            options: ["Automated Internet", "Artificial Intelligence", "Advanced Information", "Applied Interface"],
            answer: 1,
            explanation: "Artificial Intelligence enables computers to perform tasks that normally require human-like intelligence."
        },
        {
            question: "Which is a common example of AI in everyday life?",
            options: ["A wooden ruler", "An ordinary light switch", "A voice assistant", "A paper notebook"],
            answer: 2,
            explanation: "AI-powered voice assistants can interpret spoken requests and respond to users."
        },
        {
            question: "What is machine learning?",
            options: ["Learning patterns from data", "Repairing computer hardware", "A language used only for websites", "Increasing screen brightness"],
            answer: 0,
            explanation: "Machine learning allows computer systems to learn patterns from data and use them to make predictions."
        },
        {
            question: "Which technology helps self-driving vehicles detect objects?",
            options: ["A spreadsheet", "A word processor", "A printer driver", "Computer vision"],
            answer: 3,
            explanation: "Computer vision helps machines interpret images and video to identify objects and surroundings."
        },
        {
            question: "What is the main purpose of training an AI model?",
            options: ["Making a computer physically larger", "Learning patterns from examples", "Guaranteeing every answer is correct", "Removing the need for data"],
            answer: 1,
            explanation: "Training uses data to help an AI model learn patterns. It does not guarantee perfect answers."
        },
        {
            question: "Which is a common use of AI in healthcare?",
            options: ["Replacing every doctor", "Making all diseases impossible", "Helping analyse medical images", "Guaranteeing nobody becomes ill"],
            answer: 2,
            explanation: "AI tools can help healthcare professionals analyse medical images, but clinical decisions require appropriate human oversight."
        },
        {
            question: "What is a chatbot designed to do?",
            options: ["Interact with users through conversation", "Only print documents", "Only store electricity", "Transport passengers physically"],
            answer: 0,
            explanation: "A chatbot communicates with users through text or voice and can answer questions or assist with tasks."
        },
        {
            question: "Why should people check important information produced by AI?",
            options: ["AI answers are always too slow", "AI cannot provide useful information", "AI systems never use data", "AI can produce incorrect answers"],
            answer: 3,
            explanation: "AI can make mistakes or produce misleading information, so important claims should be verified."
        },
        {
            question: "What is a robot?",
            options: ["Any website displaying text", "A machine designed to carry out tasks", "A computer file", "A network connection"],
            answer: 1,
            explanation: "A robot is a programmable machine that can carry out tasks automatically or with human control."
        },
        {
            question: "Which statement about AI is most accurate?",
            options: ["Every AI thinks exactly like a human", "AI can never help people learn", "AI can assist people, but its results need judgement", "Every electrical machine is intelligent"],
            answer: 2,
            explanation: "AI can be useful, but people should evaluate its output and use it responsibly."
        }
    ],

    sst: [
        {
            question: "Who was the first Mughal emperor of India?",
            options: ["Akbar", "Babur", "Shah Jahan", "Humayun"],
            answer: 1,
            explanation: "Babur founded the Mughal Empire in India after his victory at the First Battle of Panipat in 1526."
        },
        {
            question: "In which year did India gain independence?",
            options: ["1942", "1945", "1947", "1950"],
            answer: 2,
            explanation: "India became independent from British rule on 15 August 1947."
        },
        {
            question: "Which is the largest continent in the world?",
            options: ["Africa", "Europe", "North America", "Asia"],
            answer: 3,
            explanation: "Asia is the world's largest continent by both area and population."
        },
        {
            question: "Which imaginary line divides Earth into Northern and Southern Hemispheres?",
            options: ["Tropic of Cancer", "Equator", "Prime Meridian", "Arctic Circle"],
            answer: 1,
            explanation: "The Equator is at 0° latitude and divides Earth into the Northern and Southern Hemispheres."
        },
        {
            question: "Who chaired the Drafting Committee of the Indian Constitution?",
            options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Dr. B. R. Ambedkar", "Sardar Vallabhbhai Patel"],
            answer: 2,
            explanation: "Dr. B. R. Ambedkar chaired the Drafting Committee of the Constituent Assembly."
        },
        {
            question: "What is the minimum voting age for Indian citizens in general elections?",
            options: ["16 years", "18 years", "21 years", "25 years"],
            answer: 1,
            explanation: "Indian citizens who meet the legal eligibility requirements can generally register to vote from age 18."
        },
        {
            question: "Which activity is most directly associated with agriculture?",
            options: ["Fishing", "Farming", "Banking", "Software development"],
            answer: 1,
            explanation: "Agriculture includes cultivating crops and related activities such as raising livestock."
        },
        {
            question: "What is the capital of Bihar?",
            options: ["Gaya", "Muzaffarpur", "Patna", "Bhagalpur"],
            answer: 2,
            explanation: "Patna is the capital city of Bihar."
        },
        {
            question: "Which institution makes laws for the entire country at the national level in India?",
            options: ["Parliament", "Supreme Court", "Election Commission", "Reserve Bank of India"],
            answer: 0,
            explanation: "Parliament is India's national legislature and makes laws on matters within its constitutional authority."
        },
        {
            question: "What does GDP stand for?",
            options: ["General Development Plan", "Gross Domestic Product", "Government Distribution Programme", "Global Development Project"],
            answer: 1,
            explanation: "Gross Domestic Product measures the value of final goods and services produced within a country's borders during a specified period."
        }
    ]

};

// ==========================================
// JARVIS KNOWLEDGE ARENA — QUIZ ENGINE
// ==========================================

let currentQuizCategory = "science";
let currentQuestionIndex = 0;
let currentQuizScore = 0;
let answerLocked = false;


// Start a quiz
function startQuiz(category) {
    if (!quizQuestions[category]) return;

    currentQuizCategory = category;
    currentQuestionIndex = 0;
    currentQuizScore = 0;
    answerLocked = false;

    document.getElementById("quiz-page").style.display = "block";
    document.getElementById("quiz-menu").style.display = "none";
    document.getElementById("quiz-game").style.display = "block";
    document.getElementById("quiz-results").style.display = "none";

    const names = {
        science: "SCIENCE",
        ai: "ARTIFICIAL INTELLIGENCE",
        sst: "SOCIAL STUDIES"
    };

    document.getElementById("quiz-category-name").textContent =
        names[category];

    playSound("startup");
    displayQuestion();
}


// Display current question
function displayQuestion() {
    const questions = quizQuestions[currentQuizCategory];
    const current = questions[currentQuestionIndex];

    answerLocked = false;

    document.getElementById("quiz-question-number").textContent =
        "QUESTION " + (currentQuestionIndex + 1) +
        " OF " + questions.length;

    document.getElementById("quiz-question").textContent =
        current.question;

    document.getElementById("quiz-score").textContent =
        "SCORE: " + currentQuizScore;

    document.getElementById("quiz-progress").style.width =
        (currentQuestionIndex / questions.length * 100) + "%";

    document.getElementById("quiz-feedback").style.display = "none";
    document.getElementById("quiz-next-button").style.display = "none";

    const buttons = document.querySelectorAll(".quiz-option");

    buttons.forEach(function(button, index) {
        button.classList.remove("correct", "wrong");
        button.disabled = false;

        button.querySelector(".option-text").textContent =
            current.options[index];
    });
}


// Check selected answer
function selectAnswer(selectedIndex) {
    if (answerLocked) return;

    const questions = quizQuestions[currentQuizCategory];
    const current = questions[currentQuestionIndex];

    if (!current || !current.options[selectedIndex]) return;

    answerLocked = true;

    const buttons = document.querySelectorAll(".quiz-option");
    const isCorrect = selectedIndex === current.answer;

    buttons.forEach(function(button) {
        button.disabled = true;
    });

    // Highlight the correct answer
    buttons[current.answer].classList.add("correct");

    if (isCorrect) {
        currentQuizScore++;

        document.getElementById("quiz-feedback-title").textContent =
            "✓ CORRECT ANSWER!";

        playSound("success");
    } else {
        buttons[selectedIndex].classList.add("wrong");

        document.getElementById("quiz-feedback-title").textContent =
            "✗ NOT QUITE!";

        playSound("error");
    }

    document.getElementById("quiz-score").textContent =
        "SCORE: " + currentQuizScore;

    document.getElementById("quiz-explanation").textContent =
        current.explanation;

    document.getElementById("quiz-feedback").style.display = "block";

    const nextButton = document.getElementById("quiz-next-button");

    nextButton.textContent =
        currentQuestionIndex === questions.length - 1
        ? "VIEW FINAL RESULTS →"
        : "NEXT QUESTION →";

    nextButton.style.display = "block";
}


// Move to next question
function nextQuestion() {
    if (!answerLocked) return;

    currentQuestionIndex++;

    const questions = quizQuestions[currentQuizCategory];

    if (currentQuestionIndex >= questions.length) {
        showQuizResults();
    } else {
        playSound("transition");
        displayQuestion();
    }
}


// Show final score
function showQuizResults() {
    document.getElementById("quiz-game").style.display = "none";
    document.getElementById("quiz-results").style.display = "block";

    document.getElementById("quiz-progress").style.width = "100%";

    document.getElementById("quiz-final-score").textContent =
        currentQuizScore + " / " +
        quizQuestions[currentQuizCategory].length;

    let message = "";
    let detail = "";

    if (currentQuizScore <= 5) {
        message = "You need to study more!";
        detail = "Keep practising! Every question is a chance to learn.";
    } else if (currentQuizScore <= 8) {
        message = "Average! Good effort!";
        detail = "You're making progress. Keep learning and improving!";
    } else {
        message = "Topper of the Class!";
        detail = "Excellent work! You've demonstrated great knowledge.";
    }

    document.getElementById("quiz-final-message").textContent = message;
    document.getElementById("quiz-final-detail").textContent = detail;

    playSound(currentQuizScore >= 9 ? "victory" : "success");
}


// Show category menu
function showQuizMenu() {
    document.getElementById("quiz-page").style.display = "block";
    document.getElementById("quiz-menu").style.display = "block";
    document.getElementById("quiz-game").style.display = "none";
    document.getElementById("quiz-results").style.display = "none";

    playSound("click");
}


// Exit quiz to category menu
function exitQuiz() {
    showQuizMenu();
}


// Return to website home
function goHomeFromQuiz() {
    document.getElementById("quiz-page").style.display = "none";

    if (typeof goHome === "function") {
        goHome();
    }
}
// OPEN AI PRESENTATION
function openPresentation() {
    playSound("transition");

    document.getElementById("welcome-page").classList.add("hidden");
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("quiz-page").classList.add("hidden");
    document.getElementById("presentation-page").classList.remove("hidden");

    window.scrollTo(0, 0);
}

// CLOSE AI PRESENTATION AND STOP VIDEO
function closePresentation() {
    playSound("click");

    const video = document.getElementById("ai-presentation-video");
    video.src = "https://www.youtube.com/embed/ad79nYk2keg";

    document.getElementById("presentation-page").classList.add("hidden");
    document.getElementById("welcome-page").classList.add("hidden");
    document.getElementById("quiz-page").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");

    window.scrollTo(0, 0);
}
