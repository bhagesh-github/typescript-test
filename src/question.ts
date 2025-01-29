import { QUESTIONS_CONTROL_OPTIONS } from "./constants";
import { ISelectOption } from "./interfaces";
import { Util } from "./util";

export type QuestionData = {
    id: string,
    title: string,
    controlType?: ControlType
}

type ControlType = {
    type?: string,
    options?:{value:string}[]
}

/**
 * This class represents the questions for the form
 * It contains question text and controls dropdown in UI
 * The user can select the controls from dropdown
 */

export class Question {
    questionId: string = "";
    questionMap: Map<string,QuestionData> = new Map<string, QuestionData>();
    questionControls: HTMLDivElement= {} as HTMLDivElement;
    targetType: string = "";
    constructor(params?: QuestionData) {
        let initialValue: QuestionData = {} as QuestionData;
        if(params) {
            initialValue.id = params.id,
            initialValue.title = params.title;
            initialValue.controlType = params.controlType;
            if(params.controlType?.type) {
                this.targetType = params.controlType?.type;
            }
        } else {
            this.questionId = window.crypto.randomUUID();
            initialValue = {
                id: this.questionId,
                title:"",
                controlType: {
                    options:[]
                }
            }
        }
        this.questionMap.set(this.questionId,initialValue);
    }
    /**
     * 
     * @returns Returns the HTML which will be render in Form class
     */
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
    /**
     * 
     * @returns Initial layout for question class
     */
    #createQuestionLayout(): HTMLDivElement {
        const questionBox: HTMLDivElement = Util.getHtml({
            type:'div',
            classes:['question-box']
        }) as HTMLDivElement;
        const questionDescription: HTMLDivElement = Util.getHtml({
            type:'div',
            classes:['question-box__description']
        }) as HTMLDivElement;
        const questionControls: HTMLDivElement = Util.getHtml({
            type:'div',
            classes:['question-box__controls']
        }) as HTMLDivElement;
        const inputWrapper = this.#getInput();
        const inputText = inputWrapper.querySelector("input")!;
        inputText.name = `${this.questionId}-title`;
        inputText.value = this.questionMap.get(this.questionId)?.title as string;
        inputText.addEventListener("change", this.#handleInputChange.bind(this));
        const controlDropdown = this.#getControlsDropdown();
        questionDescription.append(inputText,controlDropdown,questionControls);
        questionBox.appendChild(questionDescription);
        this.questionControls = questionControls;
        if(this.targetType) {
            controlDropdown.value = this.targetType;
            const options = this.questionMap.get(this.questionId)!.controlType?.options!;
            this.#appendCheckRadioboxTemplate(options);
        }
        return questionBox;
    }
    /**
     * 
     * @param event this handles the change event for the controls dropdown on change it will show the controls html
     */
    #onControlSelectionChange(event: Event) {
        const targetElementValue: string =( event.target as HTMLSelectElement).value;
        if(this.questionMap.get(this.questionId)?.controlType) {
            this.questionMap.get(this.questionId)!.controlType = {
                type: targetElementValue,
                options: []
            };
        }
        this.targetType = targetElementValue;
        this.questionControls.innerHTML = "";
        this.#renderControls(targetElementValue);
    }
    /**
     * 
     * @param targetElementValue 
     * Renders control on basis of the selection eg: multichoices -> radio etc..
     */
    #renderControls(targetElementValue: string) {
        const options = this.questionMap.get(this.questionId)!.controlType?.options!;
        switch(targetElementValue) {
            case "checkbox":
            case "radio":
                options?.push({value: `Option ${options.length + 1}`});
                this.#appendCheckRadioboxTemplate(options);
                break;
            case "select":
                options?.push({value: `Option ${options.length + 1}`});
                this.#appendTextTemplate(options);
                break;
        }
    }
    #appendTextTemplate(options:{value: string}[]) {
        for(let option of options) {
            this.questionControls.appendChild(this.#getTextTemplate(option));
        }
        this.questionControls.append(this.#getAddControlBtn());
    }
    #appendCheckRadioboxTemplate(options:{value: string}[]) {
        for(let option of options) {
            this.questionControls.appendChild(this.#getCheckRadioboxTemplate(option, this.targetType));
        }
        this.questionControls.append(this.#getAddControlBtn());
    }
    #onAddOptionClick() {
        this.questionControls.innerHTML = "";
        this.#renderControls(this.targetType);
    }
    /**
     * 
     * @returns Button element
     * This is used to add new option when clicked, its add the text input where user can enter the extra option if needed
     */
    #getAddControlBtn(): HTMLButtonElement {
        const addOptionBtn: HTMLButtonElement = Util.getHtml({
            type:'button',
            classes:["btn", "btn--secondary"],
            textContent:"Add Option"
        }) as HTMLButtonElement;
        addOptionBtn.addEventListener("click", this.#onAddOptionClick.bind(this));
        return addOptionBtn;
    }
    #getTextTemplate(option:{value:string}): HTMLDivElement {
        const wrapper: HTMLDivElement = Util.getHtml({
            type:'div',
        }) as HTMLDivElement;
        const inputWrapper = this.#getInput();
        const inputText = inputWrapper.querySelector("input")!;
        inputText.value = option.value;
        inputText.addEventListener("change", function() {
            option.value = this.value;
        });
        wrapper.appendChild(inputText);
        return wrapper;
    }
    /**
     * 
     * @param option 
     * @param inputType 
     * @returns 
     * Returns the template for radio and checkbox selection
     */
    #getCheckRadioboxTemplate(option:{value:string}, inputType:string): HTMLDivElement {
        const wrapper: HTMLDivElement = Util.getHtml({
            type:'div',
        }) as HTMLDivElement;
        const inputEl: HTMLInputElement = Util.getHtml({
            type:"input"
        }) as HTMLInputElement;
        inputEl.type =inputType;
        inputEl.disabled = true;
        const inputWrapper = this.#getInput();
        const inputText = inputWrapper.querySelector("input")!;
        inputText.value = option.value;
        inputText.addEventListener("change", function() {
            option.value = this.value;
        })
        wrapper.append(inputEl,inputText);
        return wrapper;
    }
    /**
     * 
     * @param target 
     * @returns Select Element
     * Builds the select element and returns it
     */
    #getControlsDropdown(): HTMLSelectElement {
        const options: ISelectOption[] = QUESTIONS_CONTROL_OPTIONS;

        const selectFormDropdown = Util.selectElement({
            name:"controls",
            options   
        });
        selectFormDropdown.addEventListener("change", this.#onControlSelectionChange.bind(this))
        return selectFormDropdown;
    }
    /**
     * 
     * @returns This method returns the basic input element
     */
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