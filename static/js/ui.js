function showTypingIndicator(){
    if (document.getElementById("typing-indicator")) {return;}
    const typingindicator=document.createElement("div");
    typingindicator.id="typing-indicator"
    typingindicator.classList.add("d-flex","message-row","typing-enter")
    typingindicator.innerHTML=`
    <div class="msg-ai message-bubble">
    <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
    </div>`                  
    messagesContainer.appendChild(typingindicator)
    scrollToBottom("smooth")
}


function removeTypingIndicator() {
    return new Promise((resolve) => {

        const typingIndicator = document.getElementById("typing-indicator");
        if (!typingIndicator) {
            resolve();
            return;
        }

        typingIndicator.classList.add("typing-leave");

        typingIndicator.addEventListener(
            "transitionend",
            () => {
                typingIndicator.remove();
                resolve();
            },
            { once: true }
        );
    });
}



// Scrolling
function scrollToBottom(mode){
    if (mode==='instant'){
    chatbody.scrollTop = chatbody.scrollHeight;}

    else if(mode==="smooth"){
    chatbody.scrollTo({
    top: chatbody.scrollHeight,
    behavior: "smooth"});
}
    else if (mode === "partial") {
    if (chatbody.scrollTop > 0) {
        chatbody.scrollBy({
            top: 400,
            behavior: "smooth"
        });
    }
}
}



function updateScrollButton(){
        const distanceFromBottom =
        chatbody.scrollHeight -
        (chatbody.scrollTop + chatbody.clientHeight);
        const threshold =400;

        if (distanceFromBottom <= threshold){
            scrollBtn.classList.remove("show");
        }
        else{
            scrollBtn.classList.add("show")
        }

}

chatbody.addEventListener("scroll", updateScrollButton);
scrollBtn.addEventListener("click", () => {
    scrollToBottom('smooth')
});

updateScrollButton();



function startCountdown(seconds){

    const countdown=document.getElementById("countdown");
    let remaining=seconds;
    const timer=setInterval(()=>{

        const hours=Math.floor(remaining/3600);
        const minutes=Math.floor((remaining%3600)/60);
        const secs=remaining%60;

        countdown.innerText=
        `${hours}h ${minutes}m ${secs}s`;

        remaining--;
        if (remaining < 0) {

            clearInterval(timer);

            const statusContainer = document.getElementById("system-status");

            statusContainer.innerHTML = `
                <div class="alert alert-info mb-0" role="alert">
                    SmartBot is checking whether AI access has been restored.
                    You can try sending a message now.
                </div>
            `;

            mesginput.disabled = false;
            Sendbtn.disabled = false;
}

    },1000);

}

function showRateLimitBanner(retryAfter) {
     if (!retryAfter || retryAfter <= 0) {
        return;
    }
    const statusContainer = document.getElementById("system-status");
    statusContainer.innerHTML = `
        <div class="alert alert-secondary d-flex justify-content-between align-items-center mb-0" role="alert">
            <div>
                <strong>SmartBot is temporarily unavailable</strong><br>
                Daily AI usage limit has been reached.
            </div>
            <div id="countdown" class="fw-semibold"></div>
        </div>
    `;

    mesginput.disabled = true;
    Sendbtn.disabled = true;
    startCountdown(retryAfter);
}


function removeRateLimitBanner(){
    const statusContainer = document.getElementById("system-status");

    if(statusContainer){
        statusContainer.innerHTML = "";
    }
}




document.addEventListener("DOMContentLoaded", () => {
    if (
        window.AI_AVAILABLE === false &&
        window.RETRY_AFTER > 0
    ) {
        showRateLimitBanner(window.RETRY_AFTER);
    }

});