import { ISelectOption } from "./interfaces";

export const QUESTIONS_CONTROL_OPTIONS: ISelectOption[] = [
    {
        value: "",
        text:"Select Control",
        disabled: true,
        selected: true
    },
    {
        value: "checkbox",
        text:"Checkbox"
    },
    {
        value: "radio",
        text:"Multiple Choices"
    },
    {
        value: "select",
        text:"Dropdown"
    },
    {
        value: "textarea",
        text:"Description"
    }
]