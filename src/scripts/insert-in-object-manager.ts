const insertWonderFormulaScript = (onload: () => void) => {
    const dummySrc = chrome.runtime.getURL('dist/ui/wonder-editor.min.js');
    const script = document.createElement('script');
    script.setAttribute("type", "module");
    script.setAttribute("src", dummySrc);
    script.onload = () => {
        onload();
    };

    const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    head.insertBefore(script, head.lastChild);
}

const insertWonderFormulaEditor = () => {
    const container = document.querySelector('.pbWizardBody table tbody > tr > td > div.miniTabOn') as HTMLDivElement | null;
    if (!container) return;

    insertWonderFormulaScript(() => {
        const formulaEditor = document.createElement('wonder-editor');
        container.insertAdjacentElement('afterbegin', formulaEditor);
    });
}

const insertWonderFormulaButton = () => {
    const formulaEditorTab = document.querySelector('.pbWizardBody table tbody > tr > td ul') as HTMLUListElement | null;

    if (formulaEditorTab) {
        insertWonderFormulaEditor();

        const li = '<li><a href="" onclick="">Wonder Formula ✨</a></li>';
        formulaEditorTab.insertAdjacentHTML('beforeend', li);
    }
}


insertWonderFormulaButton();