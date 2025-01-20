import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { PUBLIC_API_RECAPTCHA } from "astro:env/client";
import { SECRET_RECAPTCHA_KEY } from "astro:env/server";
import type { SendRecaptcha } from "@interfaces/send-recaptcha.interface.ts";

async function requestCaptcha(token: string): Promise<boolean> {
  const requestHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const requestBody = new URLSearchParams({
    secret: SECRET_RECAPTCHA_KEY,
    response: token,
  });

  const response = await fetch(PUBLIC_API_RECAPTCHA, {
    method: "POST",
    headers: requestHeaders,
    body: requestBody.toString(),
  });

  if (!response.ok) {
    throw new ActionError({
      code: "BAD_REQUEST",
      message: "Error recaptcha request.",
    });
  }

  return response.ok;
}

export const recaptchaAction = {
  verifyCaptcha: defineAction({
    input: z.object({
      token: z.string(),
    }),
    handler: async ({ token }: SendRecaptcha): Promise<boolean> => {
      return await requestCaptcha(token);
    },
  }),
};
