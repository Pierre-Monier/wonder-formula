import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BULMA_CSS } from "./bulma";
import { functions } from "../shared/firebase";
import { httpsCallable } from "firebase/functions";

@customElement("wonder-feedback")
export class WonderFeedback extends LitElement {
  static styles = [
    BULMA_CSS,
    css`
      .file.is-boxed .file-cta {
        padding: 1em !important;
      }
    `,
  ];

  static _fileSelectLabel = "Choose a file";

  @state()
  private _emailErrorMessage?: string;

  @state()
  private _email: string = "";

  private _changeEmail(event: Event) {
    const input = event.target as HTMLInputElement;
    this._email = input.value;
  }

  private _validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (this._email === "") {
      this._emailErrorMessage = "Email is required";
    } else if (!this._email.match(emailRegex)) {
      this._emailErrorMessage = "Email is not valid";
    } else {
      this._emailErrorMessage = undefined;
    }
  }

  @state()
  private _messageErrorMessage?: string;

  @state()
  private _message: string = "";

  private _changeMessage(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    this._message = input.value;
  }

  private _validateMessage() {
    if (this._message === "") {
      this._messageErrorMessage = "Message is required";
    } else {
      this._messageErrorMessage = undefined;
    }
  }

  @state()
  private _sendSuccessMessage?: string;

  @state()
  private _sendErrorMessage?: string;

  @state()
  private _sendLoadingMessage?: string;

  private async _onSend() {
    this._validateEmail();
    this._validateMessage();

    if (this._emailErrorMessage || this._messageErrorMessage) {
      this._sendErrorMessage = undefined;
      this._sendSuccessMessage = undefined;
      return;
    }

    this._sendLoadingMessage = "Sending feedback...";

    try {
      const sendEmail = httpsCallable<
        { email: string; message: string },
        { success: boolean }
      >(functions, "sendEmail");

      const { data } = await sendEmail({
        email: this._email,
        message: this._message,
      });

      if (data.success) {
        this._sendSuccessMessage = "Message sent successfully";
        this._sendErrorMessage = undefined;
      } else {
        this._sendErrorMessage = "Message failed to send";
        this._sendSuccessMessage = undefined;
      }
    } catch (e) {
      this._sendErrorMessage = "Message failed to send";
      this._sendSuccessMessage = undefined;
      console.error(e);
    }

    this._sendLoadingMessage = undefined;
  }

  render() {
    return html`<div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input
            @input=${(e: Event) => this._changeEmail(e)}
            class="input"
            type="email"
            placeholder="Email"
          />
        </div>
        ${this._emailErrorMessage
          ? html`<p class="help is-danger">${this._emailErrorMessage}</p>`
          : html``}
      </div>

      <div class="field">
        <label class="label">Message</label>
        <div class="control">
          <textarea
            @input=${(e: Event) => this._changeMessage(e)}
            class="textarea"
            placeholder="Textarea"
          ></textarea>
        </div>
        ${this._messageErrorMessage
          ? html`<p class="help is-danger">${this._messageErrorMessage}</p>`
          : html``}
      </div>

      <div class="field"></div>

      <div class="field">
        <div class="control">
          <button @click=${() => this._onSend()} class="button is-link">
            Submit
          </button>
          ${this._sendLoadingMessage
            ? html`<p class="help">${this._sendLoadingMessage}</p>`
            : this._sendErrorMessage
            ? html`<p class="help is-danger">${this._sendErrorMessage}</p>`
            : this._sendSuccessMessage
            ? html`<p class="help is-success">${this._sendSuccessMessage}</p>`
            : html``}
        </div>
      </div>`;
  }
}
