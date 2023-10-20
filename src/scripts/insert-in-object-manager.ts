const insertWonderFormulaScript = (onload: () => void) => {
    const wonderEditorSrc = chrome.runtime.getURL('dist/ui/wonder-editor.min.js');
    const wonderEditorScript = document.createElement('script');
    wonderEditorScript.setAttribute("type", "module");
    wonderEditorScript.setAttribute("src", wonderEditorSrc);
    wonderEditorScript.onload = () => {
        onload();
    };

    const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    head.insertBefore(wonderEditorScript, head.lastChild);
}

const insertWonderFormulaEditor = () => {
    const container = document.querySelector('.pbWizardBody table tbody > tr > td > div.miniTabOn') as HTMLDivElement | null;
    if (!container) return;

    insertWonderFormulaScript(() => {
        const formulaEditor = document.createElement('wonder-editor');
        container.insertAdjacentElement('afterbegin', formulaEditor);
    });
}

const onButtonClick = (event: MouseEvent, wonderFormulaLI: HTMLLIElement, ul: HTMLUListElement) => {
    const isCurrentlySelected = wonderFormulaLI.classList.contains('currentTab');
    if (!isCurrentlySelected) {
        const currentTab = ul.querySelector('.currentTab') as HTMLLIElement | null;
        if (currentTab) {
            currentTab.classList.remove('currentTab');
            currentTab.classList.add('tertiaryPalette');
        }

        wonderFormulaLI.classList.remove('tertiaryPalette')
        wonderFormulaLI.classList.add('currentTab');

        toggleWonderFormulaEditor(true)
    }

    event.preventDefault();
}

const onSalesforceButtonClick = (salesForceLI: HTMLLIElement, ul: HTMLUListElement) => {
    salesForceLI.addEventListener('click', () => {
        const currentTab = ul.querySelector('.currentTab') as HTMLLIElement | null;
        if (currentTab && currentTab !== salesForceLI) {

            currentTab.classList.remove('currentTab');
            currentTab.classList.add('tertiaryPalette');

            salesForceLI.classList.remove('tertiaryPalette')
            salesForceLI.classList.add('currentTab');

            if (currentTab.id === wonderFormulaLIId) {
                toggleWonderFormulaEditor(false);
            }
        }
    });
}

const toggleWonderFormulaEditor = (shouldDisplay: boolean) => {
    console.log('toggleWonderFormulaEditor : ', shouldDisplay);
}

const insertWonderFormulaButton = () => {
    const ul = document.querySelector('.pbWizardBody table tbody > tr > td ul') as HTMLUListElement | null;

    if (ul) {
        insertWonderFormulaEditor();

        ul.querySelectorAll('li').forEach((salesForceLI) => onSalesforceButtonClick(salesForceLI, ul));

        const li = document.createElement('li');
        li.id = wonderFormulaLIId;
        li.classList.add('tertiaryPalette');

        const a = document.createElement('a');
        a.innerText = 'Wonder Formula ✨';
        a.setAttribute('href', 'javascript:void(0)');
        a.addEventListener('click', (event) => onButtonClick(event, li, ul));

        li.insertAdjacentElement('beforeend', a);

        ul.insertAdjacentElement('beforeend', li);
    }
}

const wonderFormulaLIId = 'wonder-formula-button';


insertWonderFormulaButton();