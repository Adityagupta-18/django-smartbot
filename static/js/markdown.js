function renderAllMarkdown(){
    const allmesg=document.querySelectorAll('.msg-ai')
    for(const mesg of allmesg){
        const mesgcontent=mesg.textContent;
        const markdownText=marked.parse(mesgcontent)
        mesg.innerHTML=markdownText
    }
}


function decorateCodeBlocks(){
    const preBlocks = document.querySelectorAll(".msg-ai pre");
    for (const pre of preBlocks){
        const code=pre.querySelector("code");

        const codeBlock=document.createElement('div')
        codeBlock.classList.add('code-block')

        const codeHeader=document.createElement('div')
        codeHeader.classList.add('code-header')

        const codeLanguage=document.createElement('span')
        codeLanguage.classList.add('code-language')
        codeLanguage.innerText=code.className.replace('language-',"")

        const copyBtn = document.createElement("button");
        copyBtn.classList.add("copy-btn");

        // Copy Icon (Inline SVG)
        const copyIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        copyIcon.setAttribute("viewBox", "0 0 24 24");
        copyIcon.classList.add("copy-icon");

        copyIcon.innerHTML = `
            <rect x="9" y="9" width="12" height="12" rx="2.3"></rect>
            <path d="M5 15V5a2 2 0 0 1 2-2h10"></path>
        `;

        const copyText = document.createElement("span");
        copyText.innerText = "Copy";

        copyBtn.append(copyIcon, copyText);

        copyBtn.addEventListener("click", () => {

            const codeBlock = copyBtn.closest(".code-block");
            const code = codeBlock.querySelector("code");
            const text = code.innerText;

            navigator.clipboard.writeText(text)
                .then(() => {

                    const checkIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    checkIcon.setAttribute("viewBox", "0 0 24 24");
                    checkIcon.classList.add("copy-icon");

                    checkIcon.innerHTML = `
                        <path d="M5 12l5 5L20 6"></path>
                    `;

                    const copyDone = document.createElement("span");
                    copyDone.innerText = "Copied";

                    copyBtn.replaceChildren(checkIcon, copyDone);

                    setTimeout(() => {

                        const copyIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        copyIcon.setAttribute("viewBox", "0 0 24 24");
                        copyIcon.classList.add("copy-icon");

                        copyIcon.innerHTML = `
                            <rect x="9" y="9" width="12" height="12" rx="2.3"></rect>
                            <path d="M5 15V5a2 2 0 0 1 2-2h10"></path>
                        `;

                        const copyText = document.createElement("span");
                        copyText.innerText = "Copy";

                        copyBtn.replaceChildren(copyIcon, copyText);

                    }, 2000);

                })
                .catch(err => {
                    console.error("Failed to copy:", err);
                });

        });


        codeHeader.append(codeLanguage,copyBtn)

        pre.parentNode.replaceChild(codeBlock, pre);
        codeBlock.append(codeHeader,pre)

    }

    // TABLE WRAPPER
    const tables = document.querySelectorAll(".msg-ai table");
    tables.forEach(table => {
        // Skip if already wrapped
        if (table.parentElement.classList.contains("table-wrapper")) {
            return;
        }

        const wrapper = document.createElement("div");
        wrapper.classList.add("table-wrapper");

        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);

});


    // EXTERNAL LINKS
    const links = document.querySelectorAll(".msg-ai a");

    links.forEach(link => {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });
}





function highlightCodeBlocks(){
    const codeblocks=document.querySelectorAll(".msg-ai pre code")
    for (const code of codeblocks){
        hljs.highlightElement(code);
    }
}