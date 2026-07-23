

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
            removeTypingIndicator()
                if (data.success) {
                    removeRateLimitBanner();
                    const markdowncontent=data.ai_response
                    const markedownHtml=marked.parse(markdowncontent)
                    const aiMessageHTML =`<div class="d-flex message-row">
                    <div class="msg-ai message-bubble">
                    ${markedownHtml}
                    </div>
                    </div>`                    
                    messagesContainer.insertAdjacentHTML("beforeend",aiMessageHTML)
                    highlightCodeBlocks()
                    scrollToBottom("partial")
                }
                else if (data.error_type === "rate_limit") {
                     showRateLimitBanner(data.retry_after);

                } else {
                    console.log("Something went wrong.");
                }
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



document.addEventListener("DOMContentLoaded", () => {
    renderAllMarkdown();
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
