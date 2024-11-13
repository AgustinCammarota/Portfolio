export const actions = {
  email: {
    sendEmail: vi.fn(async () => {
      return { data: true };
    }),
  },
  recaptcha: {
    verifyCaptcha: vi.fn(async () => {
      return { data: true };
    }),
  },
};
