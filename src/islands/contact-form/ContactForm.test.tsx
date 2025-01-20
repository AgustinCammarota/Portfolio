import { render, waitFor, cleanup } from "@solidjs/testing-library";
import { actions } from "astro:actions";
import { ContactForm } from "./ContactForm";

global.window.grecaptcha = {
  ready: vi.fn((callback) => callback()),
  execute: vi.fn(() => Promise.resolve("mocked-token")),
};

vi.stubGlobal("gtag", vi.fn());

describe("ContactForm Component", () => {
  const props = {
    subjectText: "Subject",
    emailText: "Email",
    messageText: "Message",
    buttonText: "Send",
    currentUrl: new URL("http://example.com"),
  };
  let getByPlaceholderText: ReturnType<typeof render>["getByPlaceholderText"];
  let getByRole: ReturnType<typeof render>["getByRole"];
  let emailInput: HTMLInputElement;
  let subjectInput: HTMLInputElement;
  let messageInput: HTMLInputElement;
  let submitButton: HTMLButtonElement;

  beforeEach(() => {
    vi.clearAllMocks();
    const utils = render(() => <ContactForm {...props} />);
    getByPlaceholderText = utils.getByPlaceholderText;
    getByRole = utils.getByRole;
    emailInput = getByPlaceholderText(props.emailText);
    subjectInput = getByPlaceholderText(props.subjectText);
    messageInput = getByPlaceholderText(props.messageText);
    submitButton = getByRole("button", { name: /Send/ });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("should renders form with the correct initial state", () => {
    expect(emailInput).toBeInTheDocument();
    expect(subjectInput).toBeInTheDocument();
    expect(messageInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  it("should disables submit button and shows loading state when form is submitted", () => {
    emailInput.value = "test@example.com";
    subjectInput.value = "Test Subject";
    messageInput.value = "This is a test message";
    submitButton.click();

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Please wait... ⏳");
  });

  it("should calls sendEmail and verifyCaptcha actions on form submission", async () => {
    emailInput.value = "test@example.com";
    subjectInput.value = "Test Subject";
    messageInput.value = "This is a test message";
    submitButton.click();

    await waitFor(() => {
      expect(submitButton).toHaveTextContent("Sent ✅");
      expect(actions.recaptchaAction.verifyCaptcha).toHaveBeenCalled();
      expect(actions.emailAction.sendEmail).toHaveBeenCalled();
    });
  });

  it("should shows error state if captcha or email action fails", async () => {
    actions.recaptchaAction.verifyCaptcha.mockResolvedValueOnce({
      data: false,
    });
    emailInput.value = "test@example.com";
    subjectInput.value = "Test Subject";
    messageInput.value = "This is a test message";
    submitButton.click();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent("Retry ❌");
    });
  });

  it("should shows error state if captcha action fail - case undefined", async () => {
    actions.recaptchaAction.verifyCaptcha.mockResolvedValueOnce({
      data: undefined,
    });
    emailInput.value = "test@example.com";
    subjectInput.value = "Test Subject";
    messageInput.value = "This is a test message";
    submitButton.click();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent("Retry ❌");
    });
  });

  it("should shows error state if sendEmail action fail - case undefined", async () => {
    actions.emailAction.sendEmail.mockResolvedValueOnce({ data: undefined });
    emailInput.value = "test@example.com";
    subjectInput.value = "Test Subject";
    messageInput.value = "This is a test message";
    submitButton.click();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent("Retry ❌");
    });
  });

  it("should call gtag with on-error-send-email parameters", async () => {
    actions.emailAction.sendEmail.mockResolvedValueOnce({ data: undefined });
    emailInput.value = "test@example.com";
    subjectInput.value = "Test Subject";
    messageInput.value = "This is a test message";
    submitButton.click();

    await waitFor(() => {
      expect(window.gtag).toHaveBeenCalledWith(
        "event",
        "on-error-send-email",
        {},
      );
    });
  });

  it("should call gtag with on-error-verify-captcha parameters", async () => {
    actions.recaptchaAction.verifyCaptcha.mockResolvedValueOnce({
      data: undefined,
    });
    emailInput.value = "test@example.com";
    subjectInput.value = "Test Subject";
    messageInput.value = "This is a test message";
    submitButton.click();

    await waitFor(() => {
      expect(window.gtag).toHaveBeenCalledWith(
        "event",
        "on-error-verify-captcha",
        {},
      );
    });
  });

  it("should call gtag with form-send parameters", () => {
    emailInput.value = "test@example.com";
    subjectInput.value = "Test Subject";
    messageInput.value = "This is a test message";
    submitButton.click();

    expect(window.gtag).toHaveBeenCalledWith("event", "form_submit_click", {
      interaction_name: "form-send",
      email: "test@example.com",
    });
  });

  it("should resets the form fields after successful submission", async () => {
    emailInput.value = "test@example.com";
    subjectInput.value = "Test Subject";
    messageInput.value = "This is a test message";
    submitButton.click();

    await waitFor(() => {
      expect(emailInput).toHaveValue("");
      expect(subjectInput).toHaveValue("");
      expect(messageInput).toHaveValue("");
    });
  });
});
