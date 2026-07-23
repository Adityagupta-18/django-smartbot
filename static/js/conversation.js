// Create New Chat
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
