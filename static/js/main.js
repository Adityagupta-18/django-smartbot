// csrfToken
const csrfToken = document.querySelector(
    "[name=csrfmiddlewaretoken]"
).value;

const Newchatbutton=document.getElementById("new-chat-btn")
Newchatbutton.addEventListener('click',()=>{
    fetch("/chat/new/", {
    method: "POST",
     headers: {
        "X-CSRFToken": csrfToken
    }}).then(response=>response.json())
    .then(data=>{
        if(data.success){
        window.location.href=`/chat/${data.conversation_id}/`}
    })
})


// send button AJAX

const Sendbtn=document.getElementById('send-btn')
const mesginput=document.getElementById('msgInput')
const composer_csrf = document.querySelector('#chat-container [name=csrfmiddlewaretoken]').value;
const chatContainer = document.getElementById("chat-container");
let conversationId = chatContainer.dataset.conversationId;
const messagesContainer = document.getElementById("messages-container");
const chatbody = document.querySelector(".chat-body");
Sendbtn.addEventListener('click',()=>{
    const mesgcontent=mesginput.value
    if (mesgcontent===''){return}
    if (conversationId ){
        sendmessage(conversationId,mesgcontent,false)}
    else{
    fetch("/chat/new/", {
    method: "POST",
     headers: {
        "X-CSRFToken": csrfToken
    }}).then(response=>response.json())
    .then(data=>{
        if(data.success){
        conversationId = data.conversation_id;
        sendmessage(conversationId,mesgcontent,true)
        if (isNewChat) {
            window.location.href = `/chat/${conversationId}/`;}}
        })}
})

function sendmessage(conversationId,messagecontent,isNewChat){
    fetch('/chat/send-message/', {
    method:"POST",
    headers: {
    "Content-Type": "application/json",
    "X-CSRFToken": csrfToken},
    body: JSON.stringify({
    conversation_id: conversationId,
    content: messagecontent})
}).then(response=>response.json()).then(data=>{
    if (data.success) {
        const welcomeScreen = document.getElementById("welcome-screen");
        if (welcomeScreen){
            welcomeScreen.style.display="none";}
        const messageHTML = `
            <div class="d-flex justify-content-end message-row">
                <div class="msg-user message-bubble">
                    ${messagecontent}
                </div>
            </div>`;

        messagesContainer.insertAdjacentHTML("beforeend",messageHTML)
        chatbody.scrollTop = chatbody.scrollHeight;
        mesginput.value = '';}
    else {console.log("Something went wrong");}
    })
}


// Enter button 
document.addEventListener('keydown',(event)=>{
    if (event.key==='Enter'){
        event.preventDefault()
        Sendbtn.click()
    }
})