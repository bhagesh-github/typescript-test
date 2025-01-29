import { IHtml, ISelect } from "./interfaces";

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
    public static selectElement(param: ISelect):HTMLSelectElement {
        const selectFormDropdown: HTMLSelectElement = this.getHtml({
            type:'select',
            classes:['btn'],
            id:param.id
          }) as HTMLSelectElement;
          for(let option of param.options) {
            const optionEl = document.createElement('option');
            if(option.disabled) {
                optionEl.setAttribute('disabled', 'disabled');
            } if(option.selected) {
                optionEl.setAttribute('selected', 'selected');
            }
            optionEl.text = option.text;
            optionEl.value = option.value;
            selectFormDropdown.appendChild(optionEl);
        }
          
          selectFormDropdown.name = param.name;
          return selectFormDropdown;
    }
    // public static getTextInput({id, className, name, value}) {

    // }
}