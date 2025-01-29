import { IHtml } from "./interfaces";

export class Util {
    public static getHtml(param: IHtml):HTMLElement {
        const htmlElement = document.createElement(param.type);
        if(param.classes) {
            htmlElement.classList.add(...param.classes)
        }
        if(param.id) {
            htmlElement.id = param.id;
        }
        if(param.textContent) {
            htmlElement.textContent = param.textContent;
        }
        return htmlElement;
    }
    // public static getTextInput({id, className, name, value}) {

    // }
}