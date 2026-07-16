// csrfToken
const csrfToken = document.querySelector(
    "[name=csrfmiddlewaretoken]"
).value;

function addConversationToSidebar(data){
    const todaygroup=document.getElementById("today-group");
    const newConversation = document.createElement("a");
    const activeConversations = document.querySelectorAll(".sidebar-conversation.active");
    activeConversations.forEach(conversation => {
        conversation.classList.remove("active")});
    newConversation.innerHTML=`<svg class="icon icon-sm" aria-hidden="true"><use href="#i-chat"></use></svg>
                                <span class="sidebar-conversation-title">${data.title}</span>
                                <svg class="icon icon-sm sidebar-conversation-more" aria-hidden="true"><use href="#i-dots"></use></svg>`;
                                newConversation.classList.add('sidebar-conversation')
                                newConversation.classList.add('active')
                                newConversation.href='#'
                                newConversation.dataset.conversationId = data.conversation_id;

    const label = document.querySelector(".sidebar-group-label");
    label.insertAdjacentElement("afterend", newConversation);

}

const Newchatbutton=document.getElementById("new-chat-btn")
Newchatbutton.addEventListener('click',()=>{
    fetch("/chat/new/", {
    method: "POST",
     headers: {
        "X-CSRFToken": csrfToken
    }}).then(response=>response.json())
    .then(data=>{addConversationToSidebar(data)})
})