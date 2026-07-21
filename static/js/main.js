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
let isSending=false;

Sendbtn.addEventListener('click',()=>{
    if (isSending) return;

    const mesgcontent = mesginput.value.trim();
    if (!mesgcontent) {return;}
    mesginput.value = "";

    isSending = true;
    Sendbtn.disabled = true;
    if (conversationId ){
        sendmessage(conversationId,mesgcontent,false)
    }
    else{

        fetch("/chat/new/", {
        method: "POST",
        headers: {
            "X-CSRFToken": csrfToken
        }
        })
        .then(response=>response.json())
        .then(data=>{
            if(data.success){
                conversationId = data.conversation_id;
                sendmessage(conversationId,mesgcontent,true)
                window.location.href = `/chat/${conversationId}/`;
            }
        })
        .catch(err => {
            console.error("Error:", err);
            isSending = false;
            Sendbtn.disabled = false;
        });
    }
});




function sendmessage(conversationId,messagecontent,isNewChat){

    const messageHTML = `
        <div class="d-flex justify-content-end message-row">
            <div class="msg-user message-bubble">
                ${messagecontent}
            </div>
        </div>`;

    messagesContainer.insertAdjacentHTML("beforeend",messageHTML)
    chatbody.scrollTop = chatbody.scrollHeight;
    showTypingIndicator()
    const welcomeScreen = document.getElementById("welcome-screen");
    if (welcomeScreen){
        welcomeScreen.style.display="none";}
    
    fetch('/chat/send-message/', {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken},
            body: JSON.stringify({
                conversation_id: conversationId,
                content: messagecontent
            })
        })
        .then(response=>response.json())
        .then(data=>{
            removeTypingIndicator()
                if (data.success) {
                    const markdowncontent=data.ai_response
                    const markedownHtml=marked.parse(markdowncontent)
                    const aiMessageHTML =`<div class="d-flex message-row">
                    <div class="msg-ai message-bubble">
                    ${markedownHtml}
                    </div>
                    </div>`                    
                    messagesContainer.insertAdjacentHTML("beforeend",aiMessageHTML)

                chatbody.scrollTop = chatbody.scrollHeight;
            }
            else {console.log("Something went wrong");
            }
        }) 
    .catch(err => {
        console.error("Error:", err);
        alert("Something went wrong. Please try again.");
    })       
    .finally(() => {
        isSending = false;
        Sendbtn.disabled = false;
    });
}


// Enter button 
mesginput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        Sendbtn.click();
    }
});


function showTypingIndicator(){
    if (document.getElementById("typing-indicator")) {return;}
    const typingindicator=document.createElement("div");
    typingindicator.id="typing-indicator"
    typingindicator.classList.add("d-flex","message-row")
    typingindicator.innerHTML=`
    <div class="msg-ai message-bubble">
    <span>●</span><span>●</span><span>●</span>
    </div>`                  
    messagesContainer.appendChild(typingindicator)
    chatbody.scrollTop = chatbody.scrollHeight;
}


function removeTypingIndicator(){
    const typingIndicator=document.getElementById('typing-indicator')
    if (typingIndicator){
        typingIndicator.remove()
    }
}

function renderAllMarkdown(){
    const allmesg=document.querySelectorAll('.msg-ai')
    for(const mesg of allmesg){
        const mesgcontent=mesg.textContent;
        const markdownText=marked.parse(mesgcontent)
        mesg.innerHTML=markdownText
    }
}
renderAllMarkdown();


function highlightCodeBlocks(){
    const codeblocks=document.querySelectorAll(".msg-ai pre code")
    for (const code of codeblocks){
        hljs.highlightElement(code);
    }
}
highlightCodeBlocks()




//  Respondive and animation 