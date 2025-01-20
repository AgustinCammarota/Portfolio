export const actions = {
  emailAction: {
    sendEmail: vi.fn(async () => {
      return { data: true };
    }),
  },
  recaptchaAction: {
    verifyCaptcha: vi.fn(async () => {
      return { data: true };
    }),
  },
};
