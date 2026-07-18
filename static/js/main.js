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
        window.location.href=`/chat/${data.id}/`
    })
})


// send button AJAX

const Sendbtn=document.getElementById('send-btn')
const mesginput=document.getElementById('msgInput')
const composer_csrf = document.querySelector('#chat-container [name=csrfmiddlewaretoken]').value;
const chatContainer = document.getElementById("chat-container");
const conversationId = chatContainer.dataset.conversationId;
const messagesContainer = document.getElementById("messages-container");
const chatbody = document.querySelector(".chat-body");
Sendbtn.addEventListener('click',()=>{
    const mesgcontent=mesginput.value
    if (mesgcontent===''){return}

fetch('/chat/send-message/', {
    method:"POST",
    headers: {
    "Content-Type": "application/json",
    "X-CSRFToken": csrfToken},
    body: JSON.stringify({
    conversation_id: conversationId,
    content: mesgcontent})
}).then(response=>response.json()).then(data=>{
    if (data.success) {
        const messageHTML = `
            <div class="d-flex justify-content-end mb-3">
                <div class="msg-user message-bubble">
                    ${mesgcontent}
                </div>
            </div>`;

        messagesContainer.insertAdjacentElement("beforeend",messageHTML)
        chatbody.scrollTop = chatbody.scrollHeight;
        console.log("Message saved successfully");
        mesginput.value = '';}
    else {console.log("Something went wrong");}
    })
})

// Enter button 
document.addEventListener('keydown',(event)=>{
    if (event.key==='Enter'){
        event.preventDefault()
        Sendbtn.click()
    }
})



// mesg is not saving in db
// mesg is not showingf on the screen 
// on creating new chat its showing errir message 
// extra padding without anything there are bubble