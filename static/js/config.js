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