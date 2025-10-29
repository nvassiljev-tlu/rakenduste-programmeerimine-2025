'use server';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateTime: Date | null;
  text: string;
}

export async function submitForm(data: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log('Form submitted:', data);

  return { success: true, message: 'Form submitted successfully!' };
}
