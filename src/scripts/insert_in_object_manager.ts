const formulaEditorTab = document.querySelector('.pbWizardBody table tbody > tr > td ul') as HTMLUListElement | null;

if (formulaEditorTab) {
    const li = '<li><a href="" onclick="">Wonder formula</a></li>';
    formulaEditorTab.insertAdjacentHTML('beforeend', li);
}