import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { PUBLIC_API_EMAILJS } from "astro:env/client";
import {
  SECRET_PRIVATE_KEY,
  SECRET_SERVICE_ID,
  SECRET_TEMPLATE_ID,
  SECRET_USER_ID,
} from "astro:env/server";
import type { SendEmail } from "@interfaces/send-email.interface.ts";

async function requestEmail(
  email: string,
  subject: string,
  message: string,
): Promise<boolean> {
  const response: Response = await fetch(`${PUBLIC_API_EMAILJS}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: SECRET_SERVICE_ID,
      template_id: SECRET_TEMPLATE_ID,
      user_id: SECRET_USER_ID,
      accessToken: SECRET_PRIVATE_KEY,
      template_params: {
        subject: subject,
        email: email,
        message: message,
      },
    }),
  });

  if (!response.ok) {
    throw new ActionError({
      code: "BAD_REQUEST",
      message: "Error sending email.",
    });
  }

  return response.ok;
}

export const emailAction = {
  sendEmail: defineAction({
    accept: "form",
    input: z.object({
      subject: z.string().min(5).max(60),
      email: z.string().email(),
      message: z.string().min(10).max(500),
    }),
    handler: async ({
      email,
      subject,
      message,
    }: SendEmail): Promise<boolean> => {
      return await requestEmail(email, subject, message);
    },
  }),
};
