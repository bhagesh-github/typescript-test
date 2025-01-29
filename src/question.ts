import { QUESTIONS_CONTROL_OPTIONS } from "./constants";
import { ISelectOption } from "./interfaces";
import { Util } from "./util";

export type QuestionData = {
    [key: string]: string | ControlType,
}

type ControlType = {
    type: string,
    options?:string[]
}

export class Question {
    questionId: string = "";
    questionMap: Map<string,QuestionData> = new Map<string, QuestionData>();
    constructor() {
        this.questionId = window.crypto.randomUUID();
        const initialValue: QuestionData = {
            id: this.questionId,
            title:""
        }
        this.questionMap.set(this.questionId,initialValue);
    }
    render(): HTMLDivElement {
        return this.#createQuestionLayout();
    }
    #handleInputChange(event: Event) {
        const inputName = (event.target as HTMLInputElement).name;
        const inputValue = (event.target as HTMLInputElement).value;
        if(inputName.indexOf("title") >= 0 ) {
            const questionData = this.questionMap.get(this.questionId)!;
            questionData.title = inputValue;
        }
    }
    #createQuestionLayout(): HTMLDivElement {
        const questionBox: HTMLDivElement = Util.getHtml({
            type:'div',
            classes:['question-box']
        }) as HTMLDivElement;
        const questionDescription: HTMLDivElement = Util.getHtml({
            type:'div',
            classes:['question-box__description']
        }) as HTMLDivElement;
        const inputWrapper = this.#getInput();
        const inputText = inputWrapper.querySelector("input")!;
        inputText.name = `${this.questionId}-title`;
        inputText.value = this.questionMap.get(this.questionId)?.title as string;
        inputText.addEventListener("change", this.#handleInputChange.bind(this));
        const controlDropdown = this.#getControlsDropdown();
        questionDescription.append(inputText,controlDropdown);
        questionBox.appendChild(questionDescription);
        return questionBox;
    }
    #getControlsDropdown(): HTMLSelectElement {
        const options: ISelectOption[] = QUESTIONS_CONTROL_OPTIONS;
        const selectFormDropdown = Util.selectElement({
            name:"controls",
            options   
        });
        return selectFormDropdown;
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
        inputWrapper.appendChild(inputText);
        return inputWrapper;
    }
}