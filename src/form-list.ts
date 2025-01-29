import { DynamicForm } from "./dynamic-form";
import { Util } from "./util";

export class FormList {
  forms = new Map();
  private static instance: FormList;
  private formsWrapper: HTMLDivElement = {} as HTMLDivElement;
  constructor() {
    this.forms = new Map<string, DynamicForm>();
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
    const dynamicForm = new DynamicForm();
    this.forms.set(dynamicForm.formId, dynamicForm);
    this.#renderForms();
  }
  #renderForms() {
    this.formsWrapper.innerHTML = "";
    if(this.forms.size > 0) {
      for(let value of this.forms.values()) {
        this.formsWrapper.append(value.render());
      }
    }
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
    const formsContainer = Util.getHtml({
      type:'div',
      classes:['forms-container'],
      id:'forms-container'
    }) as HTMLDivElement;
    rootElement.appendChild(formsContainer);
    this.#createTopPanel(formsContainer);
    this.#createFormsWrapper(formsContainer);
  }
  /**
   * createTopPanel method creates the HTML for top panel
   * which consists of add form button/ select form dropdwon/ show all forms checkbox
   */
  #createTopPanel(formsContainer: HTMLDivElement) {
    const topPanel: HTMLDivElement = Util.getHtml({
      type:'div',
      classes:['forms-container__top-panel'],
      id:'forms-container__top-panel'
    }) as HTMLDivElement;
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
    const addFormBtn: HTMLButtonElement = Util.getHtml({
      type:'button',
      classes:['btn'],
      id:'add-form-btn',
      textContent:'Add Form'
    }) as HTMLButtonElement;
    addFormBtn.type = 'button';
    addFormBtn.addEventListener('click', this.#addForm.bind(this));
    topPanel.append(addFormBtn);
  }
  /**
   * createFormSelectionDropdown method creates the HTML for select form dropdwon
   * from which user will select the form of choice
   */
  #createFormSelectionDropdown(topPanel: HTMLDivElement) {
    const selectFormDropdown: HTMLSelectElement = Util.getHtml({
      type:'select',
      classes:['btn'],
      id:'selectform'
    }) as HTMLSelectElement;
    const disabledOption = document.createElement('option');
    disabledOption.setAttribute('selected', 'selected');
    disabledOption.setAttribute('disabled', 'disabled');
    disabledOption.text = 'Select Form';
    selectFormDropdown.appendChild(disabledOption);
    const option = document.createElement('option');
    option.text = 'Sample Form';
    option.value = '1234';
    selectFormDropdown.name = 'selectform';
    selectFormDropdown.addEventListener('change', this.#onFormSelection);
    selectFormDropdown.appendChild(option);
    topPanel.appendChild(selectFormDropdown);
  }
  /**
   * createFormSelectionDropdown method creates the HTML for show all forms checkbox
   * from which user can see all the forms by checking it
   */
  #createShowAllFormCheckbox(topPanel: HTMLDivElement) {
    const showAllCheckboxLabel: HTMLLabelElement = Util.getHtml({
      type:'label',
      classes:['form-label'],
      textContent:'Show All Forms'
    }) as HTMLLabelElement;
    const showAllCheckbox: HTMLInputElement = Util.getHtml({
      type:'input',
      classes:['checkbox'],
    }) as HTMLInputElement;
    showAllCheckbox.type = 'checkbox';
    showAllCheckbox.name = 'showAllForm';
    showAllCheckbox.addEventListener('click', this.#showAllForms);
    showAllCheckboxLabel.appendChild(showAllCheckbox);
    topPanel.appendChild(showAllCheckboxLabel);
  }
  /**
   * 
   * @param formsContainer HTMLDivElement
   * It creates the wrapper element which will hold the forms
   */
  #createFormsWrapper(formsContainer: HTMLDivElement) {
    const formsWrapper: HTMLDivElement = Util.getHtml({
      type:'div',
      classes:['forms-container__forms-wrapper'],
      id:'forms-container__forms-wrapper'
    }) as HTMLDivElement;
    formsContainer.appendChild(formsWrapper);
    this.formsWrapper = formsWrapper;
  }
}
