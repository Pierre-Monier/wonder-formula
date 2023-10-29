import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ValidationState } from "./editor";

@customElement("wonder-validation-status")
export class ValidationStatus extends LitElement {
  @property()
  text!: string;

  @property()
  currentStatus!: ValidationState;

  render() {
    return html`
      <span style="color: ${this._getValidationColorText()}; display: block;"
        >${this.text}</span
      >
    `;
  }

  private _getValidationColorText() {
    switch (this.currentStatus) {
      case ValidationState.Loading:
        return "grey";
      case ValidationState.Valid:
        return "green";
      case ValidationState.Invalid:
        return "red";
    }
  }
}
