export interface IFormList {
  forms: Map<string, any>;
  render: () => void;
  getHtml: () => string;
  addForm: () => void;
  showAllForms: () => void;
  onFormSelection: () => void;
}
