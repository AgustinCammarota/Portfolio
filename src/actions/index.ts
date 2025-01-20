import { emailAction } from "@actions/send-email.action.ts";
import { recaptchaAction } from "@actions/send-recaptcha.action.ts";

export const server = {
  emailAction,
  recaptchaAction,
};
