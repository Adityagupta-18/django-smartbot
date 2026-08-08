// Card layout 
function getRandomSuggestions(arr, count) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}
const randomSuggestions = getRandomSuggestions(SMARTBOT_SUGGESTIONS, 4);




function renderSuggestionCards(arrsuggestions){
    const suggestionContainer=document.getElementById('suggestions-container')
    if(!suggestionContainer){return}

    const cardsHTML = arrsuggestions.map(item => {
                            return `
                                <div class="col-12 col-md-6 ">
                                <button type="button" class="suggestion-card w-100 text-start" data-prompt="${item.prompt}">
                                <p class="suggestion-title">${item.title}</p>
                                <p class="suggestion-description">${item.subtitle}</p>
                                </button>
                            </div>
                            `;
                        }).join("");
    
    suggestionContainer.innerHTML=cardsHTML;
}

renderSuggestionCards(randomSuggestions)
attachSuggestionEvents()


function attachSuggestionEvents(){
    const cards=document.querySelectorAll(".suggestion-card")
    cards.forEach(card => {
        card.addEventListener("click",()=>{
            const prompt=card.dataset.prompt;
            mesginput.value=prompt;
            mesginput.focus();
            Sendbtn.click();
        })
    });
}






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
                            conversationItem.dataset.title = data.title;

                        }
                    }
                    const firstConversation = todayGroup.querySelector(".sidebar-conversation");
                    todayGroup.insertBefore(currentConversation,firstConversation);
                }
                
                else if (data.error_type === "rate_limit") {
                     showRateLimitBanner(data.retry_after);

                } 
                else if (data.error_type === "web_search_unavailable") {
                    showErrorBanner()
                }
                else {
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
    
    const smartSearchStatus = document.getElementById("smart-search-status");
    if (smartSearchStatus) {
        smartSearchStatus.innerHTML = "";
    }

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

// Home Button
const homeBnt=document.getElementById("homeBtn");
homeBnt.addEventListener("click",()=>{
    window.location.href = "/";
})


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


// DELETE BUTTON
const deleteConversationBtn = document.getElementById("deleteConversationBtn");
const deleteConversationModal = document.getElementById("deleteConversationModal");
const deleteConversationCancel = document.getElementById("deleteConversationCancel");
const deleteConversationConfirm = document.getElementById("deleteConversationConfirm");

if (deleteConversationBtn) {

    deleteConversationBtn.addEventListener("click", function () {
        deleteConversationModal.classList.remove("d-none");

    });

}

if (deleteConversationCancel) {
    deleteConversationCancel.addEventListener("click", function () {
        deleteConversationModal.classList.add("d-none");

    });

}


if (deleteConversationModal) {

    deleteConversationModal.addEventListener("click", function (event) {
        if (event.target === deleteConversationModal) {
            deleteConversationModal.classList.add("d-none");

        }

    });

}



if (deleteConversationConfirm) {

    deleteConversationConfirm.addEventListener("click", deleteConversation);
    async function deleteConversation() {

        try {
            const response = await fetch("/chat/delete-conversation/", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify({
                    conversation_id: conversationId
                })

            });

            const data = await response.json();

            if (data.success){
                
                deleteConversationModal.classList.add("d-none");
                const conversationElement = document.getElementById(`conversation-${conversationId}`);

                    if (conversationElement) {
                        conversationElement.remove();
                    }
                window.location.href = "/";
            }
        }

        catch (error) {
            console.error(error);

        }

    }

}





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
