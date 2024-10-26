import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { PUBLIC_API_EMAILJS } from 'astro:env/client';
import { SECRET_PRIVATE_KEY, SECRET_SERVICE_ID, SECRET_TEMPLATE_ID, SECRET_USER_ID } from 'astro:env/server';


interface SendEmail {
  email: string;
  subject: string;
  message: string;
}

async function requestEmail({
                              email, subject , message
                            }: SendEmail): Promise<boolean> {
  try {
    const response: Response = await fetch(`${PUBLIC_API_EMAILJS}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
          {
            service_id: SECRET_SERVICE_ID,
            template_id: SECRET_TEMPLATE_ID,
            user_id: SECRET_USER_ID,
            accessToken: SECRET_PRIVATE_KEY,
            template_params: {
              subject: subject,
              email: email,
              message: message,
            }
          }
      )
    });
    return response.ok;
  } catch(error) {
    return false
  }
}

export const email = {
  sendEmail: defineAction({
    input: z.object({
      subject: z.string(),
      email: z.string(),
      message: z.string()
    }),
    handler: async (input: SendEmail): Promise<boolean> => {
      return await requestEmail(input);
    }
  })
}
