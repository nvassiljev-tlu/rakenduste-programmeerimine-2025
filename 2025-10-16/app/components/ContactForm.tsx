"use client";

import { useState } from "react";
import { TextInput, Button, Stack, Textarea } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { submitForm } from "../actions/formAction";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateTime: Date | null;
  text: string;
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateTime: null,
      text: "",
    },
    validate: {
      firstName: (value) =>
        value.length < 2 ? "First name must have at least 2 letters" : null,
      lastName: (value) =>
        value.length < 2 ? "Last name must have at least 2 letters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      phone: (value) => (value.length < 7 ? "Phone number is too short" : null),
      dateTime: (value) =>
        value === null ? "Please select date and time" : null,
      text: (value) =>
        value.length < 10 ? "Text must be at least 10 characters" : null,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await submitForm(values);
      form.reset();
      alert("Form submitted successfully!");
    } catch (error) {
      alert("Error submitting form");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="First Name"
          placeholder="Enter your first name"
          withAsterisk
          key={form.key("firstName")}
          {...form.getInputProps("firstName")}
        />

        <TextInput
          label="Last Name"
          placeholder="Enter your last name"
          withAsterisk
          key={form.key("lastName")}
          {...form.getInputProps("lastName")}
        />

        <TextInput
          label="Email"
          placeholder="your@email.com"
          withAsterisk
          key={form.key("email")}
          {...form.getInputProps("email")}
        />

        <TextInput
          label="Phone Number"
          placeholder="+372 1234567"
          withAsterisk
          key={form.key("phone")}
          {...form.getInputProps("phone")}
        />

        <DateTimePicker
          label="Date and Time"
          placeholder="Pick date and time"
          withAsterisk
          key={form.key("dateTime")}
          {...form.getInputProps("dateTime")}
        />

        <Textarea
          label="Additional Text"
          placeholder="Enter additional information"
          withAsterisk
          minRows={4}
          key={form.key("text")}
          {...form.getInputProps("text")}
        />

        <Button type="submit" loading={isSubmitting}>
          Submit
        </Button>
      </Stack>
    </form>
  );
}
