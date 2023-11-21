import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ValidationState } from "./type";
import { BULMA_CSS } from "./bulma";
import { wonderStore } from "./store";

@customElement("wonder-validation-status")
export class WonderValidationStatus extends LitElement {
  static styles = [BULMA_CSS];

  private static get _loadingValidationStatus() {
    return {
      currentStatus: ValidationState.Loading,
      text: "...",
    };
  }

  private static get _defaultErrorValidationStatus() {
    return {
      currentStatus: ValidationState.Invalid,
      text: "We can't check the syntax of this formula. Please use the default Salesforce editor.",
    };
  }

  private static get _emptyValueErrorValidationStatus() {
    return {
      currentStatus: ValidationState.Invalid,
      text: "Formula is empty.",
    };
  }

  @state()
  private _validationStatus = WonderValidationStatus._loadingValidationStatus;

  private _validationTimeout?: NodeJS.Timeout;

  private static get _autoFormatBounce() {
    return 600;
  }

  autoFormat(documentValue: string) {
    clearTimeout(this._validationTimeout);
    this._validationTimeout = setTimeout(() => {
      void this._validate(documentValue);
    }, WonderValidationStatus._autoFormatBounce);
  }

  private async _validate(documentValue: string) {
    const { checkSyntaxData } = wonderStore;
    if (!checkSyntaxData) {
      console.error("Validate but validation checkSyntaxData is not set");
      this._validationStatus =
        WonderValidationStatus._defaultErrorValidationStatus;
      return;
    }

    this._validationStatus = WonderValidationStatus._loadingValidationStatus;

    const formData = checkSyntaxData.getFormData();

    formData.set(checkSyntaxData.valueKey, documentValue);
    formData.set("validateFormula", "Check+Syntax");

    const result = await fetch(checkSyntaxData.url, {
      method: checkSyntaxData.method,
      body: formData,
    });

    const body = await result.text();

    const newDocument = document.createElement("html");
    newDocument.innerHTML = body;

    const validationStatus =
      newDocument.querySelector<HTMLSpanElement>("#validationStatus");

    if (!validationStatus) {
      console.error("Validate but validation status is not found");
      this._validationStatus =
        WonderValidationStatus._defaultErrorValidationStatus;
      return;
    }

    const validationDataElement = validationStatus.firstElementChild;
    const isValid = validationDataElement?.classList.contains("validStyle");
    const text =
      validationDataElement?.textContent ?? validationStatus.innerText;

    if (!text && !documentValue) {
      this._validationStatus =
        WonderValidationStatus._emptyValueErrorValidationStatus;
      return;
    } else if (!text) {
      console.error("Validate but validation text is not found");
      this._validationStatus =
        WonderValidationStatus._defaultErrorValidationStatus;
      return;
    }
    this._validationStatus = {
      currentStatus:
        isValid === false ? ValidationState.Invalid : ValidationState.Valid,
      text: text,
    };
  }

  render() {
    return html`
      <div class="m-1">
        <span
          style="display: block;"
          class="${this._validationStatus.currentStatus ===
          ValidationState.Invalid
            ? "has-text-danger"
            : "has-text-info"}"
          >${this._validationStatus.text}</span
        >
      </div>
    `;
  }
}
