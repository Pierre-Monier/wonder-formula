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
  private _validationStatus =
    WonderValidationStatus._defaultErrorValidationStatus;

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
      this._validationStatus =
        WonderValidationStatus._defaultErrorValidationStatus;
      console.error("Validate but validation status is not found");
      return;
    }

    const validationDataElement = validationStatus.firstElementChild;
    const isValid = validationDataElement?.classList.contains("validStyle");
    const text = validationDataElement?.textContent;

    if (!text && !documentValue) {
      this._validationStatus =
        WonderValidationStatus._emptyValueErrorValidationStatus;
      return;
    } else if (!text) {
      this._validationStatus =
        WonderValidationStatus._defaultErrorValidationStatus;
      console.error("Validate but validation text is not found");
      return;
    }

    this._validationStatus = {
      currentStatus: isValid ? ValidationState.Valid : ValidationState.Invalid,
      text: text,
    };
  }

  render() {
    return html`
      <div class="m-1">
        <span style="color: ${this._getValidationColorText()}; display: block;"
          >${this._validationStatus.text}</span
        >
      </div>
    `;
  }

  private _getValidationColorText() {
    switch (this._validationStatus.currentStatus) {
      case ValidationState.Loading:
        return "grey";
      case ValidationState.Valid:
        return "green";
      case ValidationState.Invalid:
        return "red";
    }
  }
}
