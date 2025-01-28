export class FormList {
  forms: Map<string, any>;
  private static instance: FormList;
  private constructor() {
    this.forms = new Map<string, any>();
  }
  /**
   * Create the instance of the class
   * So that there is only one instance
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new FormList();
    }
    return this.instance;
  }
  #addForm() {
    alert('clicked');
  }
  #showAllForms(event: Event) {
    alert((event.target as HTMLInputElement).checked);
  }
  #onFormSelection(event: Event) {
    const targetElement: HTMLSelectElement = event.target as HTMLSelectElement;
    alert(targetElement!.value);
  }
  /**
   * render method creates the HTML for Form list Class
   */
  render(): void {
    const rootElement: HTMLDivElement =
      document.querySelector<HTMLDivElement>('#app')!;
    rootElement.innerHTML = '';
    const formsContainer = document.createElement('div');
    formsContainer.classList.add('forms-container');
    formsContainer.id = 'forms-container';
    rootElement.appendChild(formsContainer);
    this.#createTopPanel(formsContainer);
  }
  /**
   * createTopPanel method creates the HTML for top panel
   * which consists of add form button/ select form dropdwon/ show all forms checkbox
   */
  #createTopPanel(formsContainer: HTMLDivElement) {
    const topPanel = document.createElement('div');
    topPanel.classList.add('forms-container__top-panel');
    topPanel.id = 'forms-container__top-panel';
    ('');
    formsContainer.appendChild(topPanel);
    this.#createShowAllFormCheckbox(topPanel);
    this.#createFormSelectionDropdown(topPanel);
    this.#createAddFormButton(topPanel);
  }
  /**
   * createAddFormButton method creates the HTML for add form button
   * from which user will add the form on the screen
   */
  #createAddFormButton(topPanel: HTMLDivElement) {
    const addFormBtn = document.createElement('button');
    addFormBtn.type = 'button';
    addFormBtn.textContent = 'Add Form';
    addFormBtn.classList.add('btn');
    addFormBtn.id = 'add-form-btn';
    addFormBtn.addEventListener('click', this.#addForm);
    topPanel.append(addFormBtn);
  }
  /**
   * createFormSelectionDropdown method creates the HTML for select form dropdwon
   * from which user will select the form of choice
   */
  #createFormSelectionDropdown(topPanel: HTMLDivElement) {
    const selectFormDropdown = document.createElement('select');
    const disabledOption = document.createElement('option');
    disabledOption.setAttribute('selected', 'selected');
    disabledOption.setAttribute('disabled', 'disabled');
    disabledOption.text = 'Select Form';
    selectFormDropdown.appendChild(disabledOption);
    const option = document.createElement('option');
    option.text = 'Sample Form';
    option.value = '1234';
    selectFormDropdown.name = 'selectform';
    selectFormDropdown.id = 'selectform';
    selectFormDropdown.addEventListener('change', this.#onFormSelection);
    selectFormDropdown.appendChild(option);
    topPanel.appendChild(selectFormDropdown);
  }
  /**
   * createFormSelectionDropdown method creates the HTML for show all forms checkbox
   * from which user can see all the forms by checking it
   */
  #createShowAllFormCheckbox(topPanel: HTMLDivElement) {
    const showAllCheckboxLabel: HTMLLabelElement =
      document.createElement('label');
    showAllCheckboxLabel.textContent = 'Show All Forms';
    showAllCheckboxLabel.classList.add('form-label');
    const showAllCheckbox: HTMLInputElement = document.createElement('input');
    showAllCheckbox.type = 'checkbox';
    showAllCheckbox.name = 'showAllForm';
    showAllCheckbox.classList.add('checkbox');
    showAllCheckbox.addEventListener('click', this.#showAllForms);
    showAllCheckboxLabel.appendChild(showAllCheckbox);
    topPanel.appendChild(showAllCheckboxLabel);
  }
}
