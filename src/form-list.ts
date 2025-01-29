import { DynamicForm, FormData } from "./dynamic-form";
import { Util } from "./util";

export class FormList {
  forms:Map<string, DynamicForm> = new Map<string, DynamicForm>();
  private static instance: FormList;
  private formsWrapper: HTMLDivElement = {} as HTMLDivElement;
  storeForms = localStorage.getItem('forms');
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
  #addForm(formData?: FormData) {
    const dynamicForm = new DynamicForm(formData);
    this.forms.set(dynamicForm.formId, dynamicForm);
    this.#renderForms();
  }
  #renderForms() {
    this.formsWrapper.innerHTML = "";
    if(this.forms.size > 0) {
      for(let value of this.forms.values()) {
        this.formsWrapper.appendChild(value.render());
      }
    }
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
    if(this.storeForms && this.storeForms.length) {
      const forms:FormData[] = JSON.parse(this.storeForms);
      for(let form of forms) {
        this.#addForm(form)
      }
    }
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
    topPanel.appendChild((Util.getHtml({
      type:'h1',
      textContent:"Test Google Forms"
    }) as HTMLHeadingElement))
    topPanel.appendChild((Util.getHtml({
      type:'p',
      textContent:"CLick on below button to add forms on screen"
    }) as HTMLParagraphElement))
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
    addFormBtn.addEventListener('click', this.#addForm.bind(this, undefined));
    topPanel.append(addFormBtn);
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
