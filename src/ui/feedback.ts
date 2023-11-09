import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BULMA_CSS } from "./bulma";
import { functions } from "./firebase";
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
  private _file?: File;

  private _changeFile(event: Event) {
    const input = event.target as HTMLInputElement;
    this._file = input.files?.[0];

    console.log(this._file);
  }

  private async _onSend() {
    this._validateEmail();
    this._validateMessage();

    if (this._emailErrorMessage || this._messageErrorMessage) return;

    try {
      const sendEmail = httpsCallable(functions, "sendEmail");
      await sendEmail({
        email: this._email,
        message: this._message,
      });
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return html`<div class="field">
        <label class="label">Email*</label>
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
        <label class="label">Message*</label>
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

      <div class="field is-grouped">
        <div class="control file is-small has-name is-boxed">
          <label class="file-label">
            <input
              @input=${(e: Event) => this._changeFile(e)}
              class="file-input"
              type="file"
              name="resume"
            />
            <span class="file-cta">
              <span class="file-label"
                >${WonderFeedback._fileSelectLabel}…</span
              >
            </span>
            ${this._file
              ? html` <span class="file-name">
                  ${this._file.name.length >
                  WonderFeedback._fileSelectLabel.length
                    ? this._file.name.slice(
                        0,
                        WonderFeedback._fileSelectLabel.length,
                      ) + "…"
                    : this._file.name}
                </span>`
              : html``}
          </label>
        </div>
        <div class="control">
          <button @click=${() => this._onSend()} class="button is-link">
            Submit
          </button>
        </div>
      </div>`;
  }
}
