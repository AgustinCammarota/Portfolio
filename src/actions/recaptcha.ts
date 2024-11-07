import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { PUBLIC_API_RECAPTCHA } from 'astro:env/client';
import { SECRET_RECAPTCHA_KEY } from 'astro:env/server';

interface SendRecaptcha {
  token: string;
}

async function requestCaptcha(token: string): Promise<boolean>  {
  try {
    const requestHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const requestBody = new URLSearchParams({
      secret: SECRET_RECAPTCHA_KEY,
      response: token
    });

    const response = await fetch(PUBLIC_API_RECAPTCHA, {
      method: 'POST',
      headers: requestHeaders,
      body: requestBody.toString()
    });

    return response.ok;
  } catch {
   return false;
  }
}

export const recaptcha = {
  verifyCaptcha: defineAction({
    input: z.object({
      token: z.string(),
    }),
    handler: async ({ token }: SendRecaptcha): Promise<boolean> => {
      return await requestCaptcha(token);
    }
  })
}
