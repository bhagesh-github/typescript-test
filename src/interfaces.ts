export interface IHtml {
  type: string;
  classes?: string[];
  id?: string;
  textContent?:string;
}

export interface ISelect {
  options: ISelectOption[];
  name:string;
  id?:string;
}

export interface ISelectOption {
  value: string;
  text: string;
  selected?: boolean;
  disabled?: boolean;
}