import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { PUBLIC_API_EMAILJS } from 'astro:env/client';
import { SECRET_SERVICE_ID, SECRET_TEMPLATE_ID, SECRET_USER_ID } from 'astro:env/server';


interface SendEmail {
  email: string;
  subject: string;
  message: string;
}

async function requestEmail({
                              email, subject , message
                            }: SendEmail): Promise<boolean> {
  try {
    console.log(PUBLIC_API_EMAILJS, SECRET_SERVICE_ID, SECRET_TEMPLATE_ID, SECRET_USER_ID);
    console.log(email, subject, message);
    const response: Response = await fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
          {
            service_id: 'service_sh88w0r',
            template_id: 'template_69t6fsc',
            user_id: 'pFW5lXkXQFEH-tYgc',
            template_params: {
              subject: subject,
              email: email,
              message: message,
            }
          }
      )
    });
    console.log(response);
    return response.ok;
  } catch(error) {
    console.log(error);
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
