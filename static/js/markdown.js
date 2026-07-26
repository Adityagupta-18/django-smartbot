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

        const copyBtn=document.createElement('button')
        copyBtn.classList.add('copy-btn')
        const copyIcon = document.createElement('img');
        copyIcon.src = "/static/icons/copy.svg";
        copyIcon.alt = "Copy";
        const copyText = document.createElement('span');
        copyText.innerText = "Copy";
        copyBtn.append(copyIcon, copyText);

        copyBtn.addEventListener("click", () => {

            const codeBlock = copyBtn.closest(".code-block");
            const code = codeBlock.querySelector("code");
            const text = code.innerText;

            navigator.clipboard.writeText(text)
            .then(() => {

                const checkIcon=document.createElement('img')
                checkIcon.src='/static/icons/check.svg'
                checkIcon.alt='Copied'

                const copyDone = document.createElement('span');
                copyDone.innerText = "Copied";

                copyBtn.replaceChildren(checkIcon, copyDone);

                setTimeout(() => {
                    const copyIcon = document.createElement('img');
                    copyIcon.src = "/static/icons/copy.svg";
                    copyIcon.alt = "Copy";

                    const copyText = document.createElement('span');
                    copyText.innerText = "Copy";

                    copyBtn.replaceChildren(copyIcon, copyText);

                }, 2000);
        })
        .catch(err => {
            console.error("Failed to copy: ", err);
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