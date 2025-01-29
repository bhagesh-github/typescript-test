import { Question, QuestionData } from "./question";
import { Util } from "./util";

export type FormData = {
    id: string,
    intro: FormIntro,
    questions?: QuestionData[];
}
type FormIntro = {
    title: string,
    description: string
}
export class DynamicForm {
    formId: string = '';
    formMap: Map<string,FormData> = new Map<string, FormData>();
    questionsMap: Map<string, Question> = new Map<string, Question>();
    questionWrapper: HTMLDivElement = {} as HTMLDivElement;
    constructor(params?:FormData) {
        let initialValue: FormData = {} as FormData;
        if(params) {
            initialValue.id = params.id,
            initialValue.intro = params.intro;
            initialValue.questions = params.questions;
        } else {
            this.formId = window.crypto.randomUUID();
            initialValue = {
                id: this.formId,
                intro: {
                    title: "",
                    description: ""
                },
                questions:[]
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
        const foundForm = allForms.findIndex((form: FormData) => form.id === this.formId);
        const formJson = this.getJson();
        if(foundForm > -1) {
            allForms[foundForm] = formJson; 
        } else {
            allForms.push(formJson);
        }
        localStorage.setItem("forms", JSON.stringify(allForms));
        // console.log(this.questionsMap)
    }
    #createFormLayout(): HTMLDivElement {
        const formBox: HTMLDivElement = Util.getHtml({
            type:'div',
            classes:['form-box']
        }) as HTMLDivElement;
        const questionWrapper: HTMLDivElement = Util.getHtml({
            type:'div',
            classes:['questions-wrapper']
        }) as HTMLDivElement;
        const form: HTMLFormElement = Util.getHtml({
            type:'form',
            id:this.formId
        }) as HTMLFormElement;
        form.addEventListener("submit", this.#submitForm.bind(this));
        form.classList.add("form-box__form");
        this.#createFormDescription(form);
        const addQuestionBtn: HTMLButtonElement = Util.getHtml({
            type:'button',
            classes:["btn", "btn--secondary"],
            textContent:"Add Question"
        }) as HTMLButtonElement;
        const submitBtn: HTMLButtonElement = Util.getHtml({
            type:'button',
            classes:["btn", "btn--primary"],
            textContent:"Submit"
        }) as HTMLButtonElement;
        addQuestionBtn.type = "button";
        addQuestionBtn.addEventListener("click", this.#addQuestion.bind(this, undefined))
        submitBtn.type = "submit";
        this.questionWrapper = questionWrapper;
        form.append(questionWrapper, addQuestionBtn, submitBtn);
        formBox.appendChild(form);
        if(this.formMap.get(this.formId)?.questions!.length) {
            const questions:QuestionData[] = this.formMap.get(this.formId)?.questions!;
            for(let question of questions) {
                this.#addQuestion(question);
            }
        }
        return formBox;
    }
    #addQuestion(quest?: QuestionData) {
        const question = new Question(quest);
        this.questionsMap.set(question.questionId, question);
        this.#renderQuestions();
    }
    #renderQuestions() {
        this.questionWrapper.innerHTML = "";
        if(this.questionsMap.size > 0) {
          for(let value of this.questionsMap.values()) {
            this.questionWrapper.append(value.render());
          }
        }
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
    getJson(): FormData{
        const formData = this.formMap.get(this.formId) as FormData;
        const questions = [];
        if(this.questionsMap.size > 0) {
            for(let [key, value] of this.questionsMap) {
                questions.push(value.questionMap.get(key));
            }
        }
        formData.questions = questions as QuestionData[];
        return formData;
    }


}