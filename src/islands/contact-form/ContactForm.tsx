import { actions } from "astro:actions";
import { PUBLIC_RECAPTCHA_SITE_KEY } from "astro:env/client";
import { type Component, createSignal } from "solid-js";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import "./contact-form.css";

interface Props {
  subjectText: string;
  emailText: string;
  messageText: string;
  buttonText: string;
  currentUrl: URL;
}

const ContactForm: Component<Props> = (props: Props) => {
  const [isDisabled, setDisabled] = createSignal(false);
  const [state, setState] = createSignal({
    text: props.buttonText,
    icon: "🚀",
  });

  const lang = getLangFromUrl(props.currentUrl);
  const t = useTranslations(lang);

  function sendAnalyticsEvent(eventName: string, data: unknown) {
    window.gtag("event", eventName, data);
  }

  async function sendEmail(formData: FormData): Promise<boolean> {
    const { data, error } = await actions.emailAction.sendEmail(formData);
    return !!data && !error;
  }

  async function verifyCaptcha(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(PUBLIC_RECAPTCHA_SITE_KEY, { action: "submit" })
          .then(async (token: string) => {
            const { data, error } = await actions.recaptchaAction.verifyCaptcha(
              { token },
            );
            resolve(!!data && !error);
          })
          .catch(() => {
            reject(false);
          });
      });
    });
  }

  function onErrorOperative(): void {
    setDisabled(false);
    setState({
      text: t("form.fail.state"),
      icon: "❌",
    });
  }

  function onSuccessOperative(): void {
    setState({
      text: t("form.sent.state"),
      icon: "✅",
    });
  }

  function onLoadingOperative(): void {
    setDisabled(true);
    setState({
      text: t("form.loading.state"),
      icon: "⏳",
    });
  }

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    if (form.checkValidity()) {
      sendAnalyticsEvent("form_submit_click", {
        interaction_name: "form-send",
        email: formData.get("email") as string,
      });

      onLoadingOperative();

      const isVerifyCaptcha = await verifyCaptcha();

      if (!isVerifyCaptcha) {
        sendAnalyticsEvent("on-error-verify-captcha", {});
        return onErrorOperative();
      }

      const isSendEmail = await sendEmail(formData);

      if (!isSendEmail) {
        sendAnalyticsEvent("on-error-send-email", {});
        return onErrorOperative();
      }

      form.reset();
      onSuccessOperative();
    }
  }

  return (
    <form name="contact" class="contact-form" onSubmit={handleSubmit}>
      <div class="form-field">
        <label class="form-label form-email sr-only" for="email">
          {props.emailText}
        </label>
        <input
          class="form-input"
          placeholder={props.emailText}
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
          id="email"
          type="email"
          name="email"
          required
        />
      </div>

      <div class="form-field">
        <label class="form-label form-subject sr-only" for="subject">
          {props.subjectText}
        </label>
        <input
          class="form-input"
          placeholder={props.subjectText}
          id="subject"
          name="subject"
          type="text"
          autocomplete="off"
          required
          maxlength="60"
          minlength="5"
        />
      </div>

      <div class="form-field">
        <label class="form-label form-message sr-only" for="message">
          {props.messageText}
        </label>
        <textarea
          class="form-textarea"
          id="message"
          wrap="hard"
          name="message"
          minLength="10"
          maxLength="500"
          placeholder={props.messageText}
          required
        />
      </div>

      <button class="form-submit" disabled={isDisabled()} type="submit">
        <span>
          {state().text} {state().icon}
        </span>
      </button>
    </form>
  );
};

export { ContactForm };
