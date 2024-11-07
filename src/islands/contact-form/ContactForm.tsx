import { actions } from 'astro:actions';
import { PUBLIC_RECAPTCHA_SITE_KEY } from 'astro:env/client';
import { type Component, createSignal } from 'solid-js';
import { getLangFromUrl, useTranslations } from '@i18n/utils';
import './contact-form.css';

interface Props {
  subjectText: string;
  emailText: string;
  messageText: string;
  buttonText: string;
  currentUrl: URL;
}

const ContactForm: Component<Props> = (props: Props) => {
  const [subject, setSubject] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [message, setMessage] = createSignal('');
  const [isDisabled, setDisabled] = createSignal(false);
  const [state, setState] = createSignal({
    text: props.buttonText,
    icon: '🚀'
  });

  const lang = getLangFromUrl(props.currentUrl);
  const t = useTranslations(lang);


  async function sendEmail(): Promise<void> {
    const { data } = await actions.email.sendEmail({
      email: email(),
      subject: subject(),
      message: message()
    });
    validateResponse(data ?? false);
  }

  async function sendCaptcha(): Promise<void> {
    const token: string = await window.grecaptcha.execute(PUBLIC_RECAPTCHA_SITE_KEY, { action: "submit" });
    const { data } = await actions.recaptcha.verifyCaptcha({token});
    validateResponse(data ?? false);
  }

  function validateResponse(success: boolean): void {
    if (success) {
      setState({
        text: t('form.sent.state'),
        icon: '✅'
      });
    } else {
      setDisabled(false);
      setState({
        text: t('form.fail.state'),
        icon: '❌'
      });
      return;
    }
  }

  function resetForm(): void {
    setMessage('');
    setSubject('');
    setEmail('');
  }

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    if (form.checkValidity()) {
      setDisabled(true);
      setState({
        text: t('form.loading.state'),
        icon: '⏳'
      });

      await sendCaptcha();
      await sendEmail();
      resetForm();
    }
  }

  return (
      <form name="contact" class="contact-form" onSubmit={handleSubmit}>
        <div class="form-field">
          <label class="form-label form-email sr-only" for="email">{props.emailText}</label>
          <input
              class="form-input"
              placeholder={props.emailText}
              onInput={(e) => setEmail(e.target.value)}
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              id="email"
              type="email"
              name="email"
              value={email()}
              required/>
        </div>

        <div class="form-field">
          <label class="form-label form-subject sr-only" for="subject">{props.subjectText}</label>
          <input
              class="form-input"
              onInput={(e) => setSubject(e.target.value)}
              placeholder={props.subjectText}
              id="subject"
              name="subject"
              type="text"
              autocomplete="off"
              value={subject()}
              required
              maxlength="60"
              minlength="5"/>
        </div>

        <div class="form-field">
          <label class="form-label form-message sr-only" for="message">{props.messageText}</label>
          <textarea
              class="form-textarea"
              id="message"
              wrap="hard"
              name="message"
              minLength="10"
              maxLength="500"
              placeholder={props.messageText}
              onInput={(e) => setMessage(e.target.value)}
              value={message()}
              required/>
        </div>

        <button
            class="form-submit"
            disabled={isDisabled()}
            type="submit">
          <span>{state().text} {state().icon}</span>
        </button>
      </form>
  )
};

export {
  ContactForm
}
