document.body.classList.add('codelisting-loaded');

document.querySelectorAll('div.code').forEach(codeElement => {
    codeElement.querySelector('button').addEventListener('click', event => {
        navigator.clipboard.writeText(codeElement.querySelector('code,pre').textContent).then(() => {
            event.target.textContent = "✅ Copied";
        });
    });
});
