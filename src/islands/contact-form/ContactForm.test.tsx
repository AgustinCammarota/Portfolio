import { render, fireEvent, waitFor, cleanup } from "@solidjs/testing-library";
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
    fireEvent.input(emailInput, { target: { value: "test@example.com" } });
    fireEvent.input(subjectInput, { target: { value: "Test Subject" } });
    fireEvent.input(messageInput, {
      target: { value: "This is a test message" },
    });
    fireEvent.submit(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Please wait... ⏳");
  });

  it("should calls sendEmail and verifyCaptcha actions on form submission", async () => {
    fireEvent.input(emailInput, { target: { value: "test@example.com" } });
    fireEvent.input(subjectInput, { target: { value: "Test Subject" } });
    fireEvent.input(messageInput, {
      target: { value: "This is a test message" },
    });
    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(submitButton).toHaveTextContent("Sent ✅");
      expect(actions.recaptcha.verifyCaptcha).toHaveBeenCalled();
      expect(actions.email.sendEmail).toHaveBeenCalledWith({
        email: "test@example.com",
        subject: "Test Subject",
        message: "This is a test message",
      });
    });
  });

  it("should shows error state if captcha or email action fails", async () => {
    actions.recaptcha.verifyCaptcha.mockResolvedValueOnce({ data: false });
    fireEvent.input(emailInput, { target: { value: "test@example.com" } });
    fireEvent.input(subjectInput, { target: { value: "Test Subject" } });
    fireEvent.input(messageInput, {
      target: { value: "This is a test message" },
    });
    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent("Retry ❌");
    });
  });

  it("should shows error state if captcha action fail - case undefined", async () => {
    actions.recaptcha.verifyCaptcha.mockResolvedValueOnce({ data: undefined });
    fireEvent.input(emailInput, { target: { value: "test@example.com" } });
    fireEvent.input(subjectInput, { target: { value: "Test Subject" } });
    fireEvent.input(messageInput, {
      target: { value: "This is a test message" },
    });
    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent("Retry ❌");
    });
  });

  it("should shows error state if sendEmail action fail - case undefined", async () => {
    actions.email.sendEmail.mockResolvedValueOnce({ data: undefined });
    fireEvent.input(emailInput, { target: { value: "test@example.com" } });
    fireEvent.input(subjectInput, { target: { value: "Test Subject" } });
    fireEvent.input(messageInput, {
      target: { value: "This is a test message" },
    });
    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent("Retry ❌");
    });
  });

  it("should call gtag with on-error-send-email parameters", async () => {
    actions.email.sendEmail.mockResolvedValueOnce({ data: undefined });
    fireEvent.input(emailInput, { target: { value: "test@example.com" } });
    fireEvent.input(subjectInput, { target: { value: "Test Subject" } });
    fireEvent.input(messageInput, {
      target: { value: "This is a test message" },
    });
    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(window.gtag).toHaveBeenCalledWith(
        "event",
        "on-error-send-email",
        {},
      );
    });
  });

  it("should call gtag with on-error-verify-captcha parameters", async () => {
    actions.recaptcha.verifyCaptcha.mockResolvedValueOnce({ data: undefined });
    fireEvent.input(emailInput, { target: { value: "test@example.com" } });
    fireEvent.input(subjectInput, { target: { value: "Test Subject" } });
    fireEvent.input(messageInput, {
      target: { value: "This is a test message" },
    });
    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(window.gtag).toHaveBeenCalledWith(
        "event",
        "on-error-verify-captcha",
        {},
      );
    });
  });

  it("should call gtag with form-send parameters", () => {
    fireEvent.input(emailInput, { target: { value: "test@example.com" } });
    fireEvent.input(subjectInput, { target: { value: "Test Subject" } });
    fireEvent.input(messageInput, {
      target: { value: "This is a test message" },
    });
    fireEvent.submit(submitButton);

    expect(window.gtag).toHaveBeenCalledWith("event", "form_submit_click", {
      interaction_name: "form-send",
      email: "test@example.com",
    });
  });

  it("should resets the form fields after successful submission", async () => {
    fireEvent.input(emailInput, { target: { value: "test@example.com" } });
    fireEvent.input(subjectInput, { target: { value: "Test Subject" } });
    fireEvent.input(messageInput, {
      target: { value: "This is a test message" },
    });
    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(emailInput).toHaveValue("");
      expect(subjectInput).toHaveValue("");
      expect(messageInput).toHaveValue("");
    });
  });
});
