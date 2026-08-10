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


// DISABLED CARDS
function toggleSuggestionCards(disabled){
    const cards = document.querySelectorAll(".suggestion-card");

    cards.forEach(card=>{
        card.disabled = disabled;
    });

}


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
            toggleSuggestionCards(false);
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
    toggleSuggestionCards(true);
    startCountdown(retryAfter);
}


function removeRateLimitBanner(){
    const statusContainer = document.getElementById("system-status");

    if(statusContainer){
        statusContainer.innerHTML = "";
    }
}


function showErrorBanner() {
    const SearcherrorContainer = document.getElementById("smart-search-status");

    SearcherrorContainer.innerHTML = `
        <div class="alert alert-secondary d-flex justify-content-between align-items-center mb-0" role="alert">
            <div>
                <strong>Smart Search is currently unavailable</strong><br>
                Please try again later. You can send another message and SmartBot will still try to answer it normally.
            </div>
        </div>
    `;
}


function showGuestLimitBanner() {
    const guestLimitContainer =
        document.getElementById("smart-search-status");

    if (!guestLimitContainer) return;

    guestLimitContainer.innerHTML = `
        <div class="alert alert-secondary d-flex justify-content-between align-items-center mb-0" role="alert">
            <div>
                <strong>You've reached the guest message limit</strong><br>
                Please log in or register to continue using SmartBot.
            </div>
        </div>
    `;

    mesginput.disabled = true;
    Sendbtn.disabled = true;
}


// Chat Searching
if (convSearch) {

    convSearch.addEventListener("input", function () {

        const conversations = document.querySelectorAll(".sidebar-conversation");
        const searchValue = convSearch.value.toLowerCase().trim();
        let matchedCount = 0;

        conversations.forEach(function (conversation) {
            const title = conversation.dataset.title.toLowerCase();

            if (title.includes(searchValue)) {

                conversation.style.display = "";
                matchedCount++;

            } 
            else {
                conversation.style.display = "none";
            }

        });


        // Hide empty Today / Previous groups
        const groups = document.querySelectorAll(".sidebar-group");

        groups.forEach(function (group) {
            const visibleChats = group.querySelectorAll(
                ".sidebar-conversation:not([style*='display: none'])"
            );

            if (visibleChats.length === 0) {
                group.style.display = "none";
            } 
            else {
                group.style.display = "";
            }

        });

        // Show "No conversations found"
        if (matchedCount === 0 && conversations.length > 0) {
            noConvoResults.classList.remove("d-none");

        } 
        else {
            noConvoResults.classList.add("d-none");
        }
    });

}



// SIDE OPENING AND CLOSING
function closeSidebar() {
    sidebar.classList.remove("is-open");
}

function openSidebar() {
    sidebar.classList.add("is-open");
}

if (menuBtn && sidebar) {

    menuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("is-open");
    });

    // CLICK OUTSIDE
    document.addEventListener("click", (event) => {
        if (
            sidebar.classList.contains("is-open") &&
            !sidebar.contains(event.target) &&
            !menuBtn.contains(event.target)
        ) {
            closeSidebar();
        }

    });

    // CLOSE BUTTON
    if(closeBtn){
        closeBtn.addEventListener("click", closeSidebar);
    }

}





// ================================
// Theme Switcher
// ================================

// ================================
// Theme Switcher
// ================================

const themeSwitcher = document.getElementById("themeSwitcher");

if (themeSwitcher) {

    const themeOptions = themeSwitcher.querySelectorAll(".theme-opt");

    const currentTheme =
        document.documentElement.getAttribute("data-theme") || "dark";

    themeOptions.forEach(option => {

        if (option.dataset.themeOpt === currentTheme) {
            option.classList.add("active");
        } else {
            option.classList.remove("active");
        }

    });
    themeOptions.forEach(option => {

        option.addEventListener("click", () => {

            const selectedTheme = option.dataset.themeOpt;

            document.documentElement.setAttribute(
                "data-theme",
                selectedTheme
            );

            localStorage.setItem("theme", selectedTheme);
            themeOptions.forEach(opt => {
                opt.classList.remove("active");
            });

            option.classList.add("active");

        });

    });
}





document.addEventListener("DOMContentLoaded", () => {
    if (
        window.AI_AVAILABLE === false &&
        window.RETRY_AFTER > 0
    ) {
        showRateLimitBanner(window.RETRY_AFTER);
    }

});