// csrfToken
const csrfToken = document.querySelector(
    "[name=csrfmiddlewaretoken]"
).value;

const Newchatbutton=document.getElementById("new-chat-btn")

const Sendbtn=document.getElementById('send-btn')
const mesginput=document.getElementById('msgInput')
const composer_csrf = document.querySelector('#chat-container [name=csrfmiddlewaretoken]').value;
const chatContainer = document.getElementById("chat-container");
let conversationId = chatContainer.dataset.conversationId;
const messagesContainer = document.getElementById("messages-container");
const chatbody = document.querySelector(".chat-body");
const scrollBtn=document.getElementById("scroll-btn")
let isSending=false;

// SIDE BAR
const todayGroup=document.getElementById("today-group");
const currentConversation=document.getElementById(`conversation-${conversationId}`)
const convSearch = document.getElementById("convSearch");
const noConvoResults = document.getElementById("noConvoResults");


// SUGGESTION CARD PROMPTS
const SMARTBOT_SUGGESTIONS = [
    {
        title: "Debug Python Code",
        subtitle: "Find bugs and improve Python programs",
        prompt: "Help me debug my Python code. Explain the issue, why it happens, and provide an optimized solution with examples."
    },
    {
        title: "Explain Algorithms",
        subtitle: "Understand complex algorithms easily",
        prompt: "Explain this algorithm in a simple way. Include the intuition behind it, step-by-step working, time complexity, and a code example."
    },
    {
        title: "Review My Code",
        subtitle: "Get professional code improvement suggestions",
        prompt: "Review my code like a senior software engineer. Identify bugs, performance issues, readability problems, and suggest improvements."
    },
    {
        title: "Build a Django Feature",
        subtitle: "Get help creating Django applications",
        prompt: "Help me implement a Django feature. Explain the architecture, models, views, URLs, templates, and best practices required."
    },
    {
        title: "Learn JavaScript",
        subtitle: "Understand JavaScript concepts clearly",
        prompt: "Teach me a JavaScript concept with simple explanations, real-world examples, and small practical code snippets."
    },
    {
        title: "Generate SQL Queries",
        subtitle: "Create and optimize database queries",
        prompt: "Help me write an SQL query. Explain the logic behind it and suggest ways to optimize database performance."
    },
    {
        title: "Fix Error Messages",
        subtitle: "Understand and solve programming errors",
        prompt: "Analyze this programming error message. Explain what caused it and guide me through fixing it step by step."
    },
    {
        title: "Explain Code",
        subtitle: "Understand existing code quickly",
        prompt: "Explain this code line by line. Describe what each part does and why it was written this way."
    },
    {
        title: "Create API Design",
        subtitle: "Design clean backend APIs",
        prompt: "Help me design a production-ready REST API. Explain endpoints, request methods, database interaction, authentication, and best practices."
    },
    {
        title: "Optimize Code",
        subtitle: "Make programs faster and cleaner",
        prompt: "Analyze this code and suggest improvements for performance, readability, scalability, and maintainability."
    },
    {
        title: "Generate Documentation",
        subtitle: "Create professional project documentation",
        prompt: "Create professional documentation for my project including overview, features, setup instructions, usage, and architecture details."
    },
    {
        title: "Compare Technologies",
        subtitle: "Understand technology differences",
        prompt: "Compare these technologies in detail. Explain differences, advantages, disadvantages, use cases, and when to choose each one."
    },
    {
        title: "Brainstorm Project Ideas",
        subtitle: "Find creative software project ideas",
        prompt: "Suggest innovative software project ideas. Include the problem being solved, required technologies, features, and possible improvements."
    },
    {
        title: "Explain System Design",
        subtitle: "Learn scalable application architecture",
        prompt: "Explain this system design concept. Cover architecture, components, data flow, scalability, and real-world examples."
    },
    {
        title: "Create Code Example",
        subtitle: "Generate practical programming examples",
        prompt: "Create a clean programming example for this concept. Explain the code and include best practices."
    },
    {
        title: "Learn Data Structures",
        subtitle: "Master important programming concepts",
        prompt: "Teach me this data structure. Explain how it works, common operations, complexity analysis, and provide implementation examples."
    },
    {
        title: "Write Better Code",
        subtitle: "Improve coding practices",
        prompt: "Teach me how to write cleaner and more maintainable code. Explain programming principles with examples."
    },
    {
        title: "Generate Regex",
        subtitle: "Create and understand patterns",
        prompt: "Help me create a regular expression. Explain each part of the pattern and test it with examples."
    },
    {
        title: "Learn Git Commands",
        subtitle: "Improve version control skills",
        prompt: "Explain useful Git commands and workflows used by professional developers with examples."
    },
    {
        title: "Create Project Plan",
        subtitle: "Break ideas into development steps",
        prompt: "Create a detailed development roadmap for this software project. Include milestones, features, architecture decisions, and implementation order."
    },
    {
        title: "Generate HTML CSS",
        subtitle: "Build modern user interfaces",
        prompt: "Create a modern responsive HTML and CSS design for this requirement. Explain the structure and styling decisions."
    },
    {
        title: "Debug JavaScript",
        subtitle: "Fix frontend problems quickly",
        prompt: "Help me debug this JavaScript issue. Explain the problem, identify the cause, and provide the corrected code."
    },
    {
        title: "Explain Machine Learning",
        subtitle: "Understand AI concepts simply",
        prompt: "Explain this artificial intelligence or machine learning concept in simple terms with examples and practical applications."
    },
    {
        title: "Improve Writing",
        subtitle: "Make text clearer and professional",
        prompt: "Improve this text to make it more professional, clear, and engaging while keeping the original meaning."
    }
];