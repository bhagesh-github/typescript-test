import { Util } from "./util";

type FormData = {
    id: string,
    intro: FormIntro
}
type FormIntro = {
    title: string,
    description: string
}
export class DynamicForm {
    formId: string = '';
    formMap: Map<string,FormData> = new Map<string, FormData>();
    constructor() {
        this.formId = window.crypto.randomUUID();
        const initialValue: FormData = {
            id: this.formId,
            intro: {
                title: "",
                description: ""
            }
        }
        this.formMap.set(this.formId,initialValue);
    }
    render(): HTMLDivElement {
        return this.#createFormLayout();
    }
    #submitForm(event: Event):void {
        event.preventDefault();
        const allForms = JSON.parse(window.localStorage.getItem("forms")!) || [];
        console.log(allForms.find((item: any) => JSON.parse(item).id === this.formId));
        if(allForms) {
            allForms.push(JSON.stringify(this.getJson()));
        }
       localStorage.setItem("forms", JSON.stringify(allForms));
    }
    #createFormLayout(): HTMLDivElement {
        const formBox: HTMLDivElement = Util.getHtml({
            type:'div',
            classes:['form-box']
        }) as HTMLDivElement;
        const form: HTMLFormElement = Util.getHtml({
            type:'form',
            id:this.formId
        }) as HTMLFormElement;
        form.addEventListener("submit", this.#submitForm.bind(this));
        form.classList.add("form-box__form");
        this.#createFormDescription(form);
        const submitBtn: HTMLButtonElement = Util.getHtml({
            type:'button',
            classes:["btn", "btn--primary"],
            textContent:"Submit"
        }) as HTMLButtonElement;
        submitBtn.type = "submit";
        form.appendChild(submitBtn);
        formBox.appendChild(form);
        return formBox;
    }
    #createFormDescription(form: HTMLFormElement): void {
        const inputWrapper: HTMLDivElement = this.#getInput();
        const textAreaWrapper: HTMLDivElement = this.#getTextArea();
        form.append(inputWrapper, textAreaWrapper);
    }
    #handleInputChange(event: Event) {
        const value: string = (event.target as HTMLInputElement).value;
        const intro: FormIntro =  this.formMap.get(this.formId)?.intro as FormIntro;
        if(intro) {
            intro.title = value
        }
    }
    #handleDescriptionChange(event: Event) {
        const value: string = (event.target as HTMLTextAreaElement).value;
        const intro: FormIntro =  this.formMap.get(this.formId)?.intro as FormIntro;
        if(intro) {
            intro.description = value
        }
    }
    #getInput(): HTMLDivElement {
        const inputWrapper: HTMLDivElement = Util.getHtml({
            type:'div',
            classes:['input-wrapper']
        }) as HTMLDivElement;
        const inputText: HTMLInputElement = Util.getHtml({
            type:'input',
            classes:['form-input']
        }) as HTMLInputElement;
        inputText.type="text";
        inputText.value = this.formMap.get(this.formId)?.intro.title!;
        inputText.name=`${this.formId}-name`;
        inputText.addEventListener("change", this.#handleInputChange.bind(this));
        inputWrapper.appendChild(inputText);
        return inputWrapper;
    }
    #getTextArea(): HTMLDivElement {
        const textAreaWrapper: HTMLDivElement = Util.getHtml({
            type:'div',
            classes:['textarea-wrapper']
        }) as HTMLDivElement;
        const textarea: HTMLTextAreaElement = Util.getHtml({
            type:'textarea',
            classes:['form-input']
        }) as HTMLTextAreaElement;
        textarea.name=`${this.formId}-descp`;
        textarea.value = this.formMap.get(this.formId)?.intro.description!;
        textarea.addEventListener("change", this.#handleDescriptionChange.bind(this));
        textAreaWrapper.appendChild(textarea);
        return textAreaWrapper;
    }
    protected getJson():FormData {
        return this.formMap.get(this.formId)!;
    }


}