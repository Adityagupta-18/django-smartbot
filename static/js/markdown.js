function renderAllMarkdown(){
    const allmesg=document.querySelectorAll('.msg-ai')
    for(const mesg of allmesg){
        const mesgcontent=mesg.textContent;
        const markdownText=marked.parse(mesgcontent)
        mesg.innerHTML=markdownText
    }
}


function highlightCodeBlocks(){
    const codeblocks=document.querySelectorAll(".msg-ai pre code")
    for (const code of codeblocks){
        hljs.highlightElement(code);
    }
}