

// Sending message
function sendMessageToServer(conversationId,messagecontent,isNewChat){
    const messageHTML = `
        <div class="d-flex justify-content-end message-row">
            <div class="msg-user message-bubble">
                ${messagecontent}
            </div>
        </div>`;

    messagesContainer.insertAdjacentHTML("beforeend",messageHTML)
    scrollToBottom("smooth")
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
            removeTypingIndicator().then(() => {
                if (data.success) {
                    removeRateLimitBanner();

                    const markdowncontent=data.ai_response
                    const markedownHtml=marked.parse(markdowncontent)

                    const aiMessageHTML =`<div class="d-flex message-row ai-message-enter">
                    <div class="msg-ai message-bubble">
                    ${markedownHtml}
                    </div>
                    </div>`             

                    messagesContainer.insertAdjacentHTML("beforeend",aiMessageHTML)
                    const newMessage = messagesContainer.lastElementChild;
                    
                    decorateCodeBlocks()
                    highlightCodeBlocks()
                    
                    requestAnimationFrame(() => {
                        newMessage.classList.add("ai-message-show");
                    });
                    scrollToBottom("partial");
                    updateScrollButton();

                    const chattitle=document.getElementById("chatTitle");
                    chattitle.innerText=data.title

                    if(data.title){

                        const conversationItem = document.querySelector(
                            `#conversation-${conversationId}`
                        );

                        if(conversationItem){
                            conversationItem.querySelector(
                                ".sidebar-conversation-title"
                            ).textContent = data.title;

                        }
                    }
                    const firstConversation = todayGroup.querySelector(".sidebar-conversation");
                    todayGroup.insertBefore(currentConversation,firstConversation);
                }
                
                else if (data.error_type === "rate_limit") {
                     showRateLimitBanner(data.retry_after);

                } else {
                    console.log("Something went wrong.");
                }
        })
            }) 
    .catch(err => {
        console.error("Error:", err);
    })       
    .finally(() => {
        isSending = false;
        Sendbtn.disabled = false;
    });
}




// send button AJAX
function sendMessage() {
    if (isSending) return;

    const mesgcontent = mesginput.value.trim();
    if (!mesgcontent) return;

    mesginput.value = "";

    isSending = true;
    Sendbtn.disabled = true;

    if (conversationId) {
        sendMessageToServer(conversationId, mesgcontent, false);
    } else {
        fetch("/chat/new/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){

                sessionStorage.setItem(
                    "pending_message",
                    mesgcontent
                );

                console.log(
                "Saved pending message:",
                sessionStorage.getItem("pending_message")
            );

                window.location.href = `/chat/${data.conversation_id}/`;
            }
        })
        .catch(err => {
            console.error("Error:", err);
            isSending = false;
            Sendbtn.disabled = false;
        });
    }
}



// Event Listeners
Sendbtn.addEventListener("click", sendMessage);

mesginput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});



// Rename button
const renameBtn = document.getElementById("renameConversationBtn");
const chatTitle = document.getElementById("chatTitle");
const chatTitleInput = document.getElementById("chatTitleInput");

renameBtn.addEventListener("click", () => {

    chatTitle.classList.add("d-none");
    chatTitleInput.classList.remove("d-none");
    chatTitleInput.value = chatTitle.textContent.trim();

    chatTitleInput.focus();
    chatTitleInput.select();

});
function saveConversationTitle(){

    const newTitle = chatTitleInput.value.trim();
    if(newTitle === ""){

        chatTitleInput.value = chatTitle.textContent;
        chatTitle.classList.remove("d-none");
        chatTitleInput.classList.add("d-none");

        return;

    }

    fetch("/chat/rename-conversation/",{

        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "X-CSRFToken":csrfToken
        },

        body:JSON.stringify({

            conversation_id:conversationId,
            title:newTitle

        })

    })

    .then(response=>response.json())

    .then(data=>{

        if(data.success){

            chatTitle.textContent = data.title;
            chatTitleInput.value = data.title;

            const sidebarConversation =
                document.querySelector(
                    `#conversation-${conversationId} .sidebar-conversation-title`
                );

            if(sidebarConversation){

                sidebarConversation.textContent = data.title;

            }

        }

        chatTitle.classList.remove("d-none");
        chatTitleInput.classList.add("d-none");

    });

}

// ENTER TO RENAME
chatTitleInput.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){
        saveConversationTitle();
    }

});

// ESCAPE TO CANCEL
chatTitleInput.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        chatTitleInput.classList.add("d-none");
        chatTitle.classList.remove("d-none");

    }

});


// CLICK OUTSIDE - NO SAVE
chatTitleInput.addEventListener("blur", () => {

    chatTitleInput.classList.add("d-none");
    chatTitle.classList.remove("d-none");
    chatTitleInput.value = chatTitle.textContent;

});


document.addEventListener("DOMContentLoaded", () => {
    renderAllMarkdown();
    decorateCodeBlocks();
    highlightCodeBlocks();
    scrollToBottom("instant")
    const pendingMessage = sessionStorage.getItem("pending_message");

    if (pendingMessage && conversationId) {
        sessionStorage.removeItem("pending_message");
        sendMessageToServer(
            conversationId,
            pendingMessage,
            true
        );
    }

});
