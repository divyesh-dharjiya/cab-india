"use client";
import { useState } from "react";
import { Button, Container, Field, Grid, Heading, Input, Stack, Text, Textarea } from "@chakra-ui/react";
import { toaster } from "../components/toaster/toaster";

const INITIAL_FORM = { name: "", email: "", message: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = ({ name, email, message }) => ({
  ...(!name.trim() && { name: "Please enter your name." }),
  ...(!EMAIL_PATTERN.test(email.trim()) && { email: "Please enter a valid email address." }),
  ...(message.trim().length < 10 && { message: "Please write at least 10 characters." }),
});

const INFO = [
  { icon: "🕑", title: "Support hours", text: "Every day, 24 × 7" },
  { icon: "📍", title: "Coverage", text: "Rides across all states and union territories of India" },
  { icon: "⚡", title: "Response time", text: "We usually reply within one business day" },
];

const FormField = ({ label, error, children }) => (
  <Field.Root invalid={!!error} required>
    <Field.Label>
      {label}
      <Field.RequiredIndicator />
    </Field.Label>
    {children}
    <Field.ErrorText>{error}</Field.ErrorText>
  </Field.Root>
);

const Contact = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const update = (field) => (event) => {
    const next = { ...form, [field]: event.target.value };
    setForm(next);
    if (isSubmitted) setErrors(validate(next));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    toaster.create({
      type: "success",
      title: `Thanks, ${form.name.trim()}!`,
      description: "Your message has been noted. We'll get back to you soon.",
      closable: true,
    });
    setForm(INITIAL_FORM);
    setIsSubmitted(false);
  };

  return (
    <Container maxW="6xl" py={{ base: 8, md: 14 }}>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1.3fr" }} gap={{ base: 8, md: 12 }}>
        <Stack gap={6}>
          <Stack gap={2}>
            <Heading as="h1" size="4xl">Get in touch</Heading>
            <Text color="gray.600">Questions about a ride, fares or partnerships? Send us a message.</Text>
          </Stack>
          {INFO.map((item) => (
            <Stack key={item.title} direction="row" gap={4} align="flex-start">
              <Text fontSize="2xl" lineHeight={1}>{item.icon}</Text>
              <Stack gap={0}>
                <Text fontWeight={700}>{item.title}</Text>
                <Text color="gray.600">{item.text}</Text>
              </Stack>
            </Stack>
          ))}
        </Stack>

        <Stack
          as="form"
          onSubmit={handleSubmit}
          noValidate
          gap={4}
          bg="white"
          p={{ base: 5, md: 8 }}
          rounded="2xl"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="xs"
        >
          <FormField label="Name" error={errors.name}>
            <Input value={form.name} onChange={update("name")} autoComplete="name" colorPalette="brand" />
          </FormField>
          <FormField label="Email" error={errors.email}>
            <Input type="email" value={form.email} onChange={update("email")} autoComplete="email" colorPalette="brand" />
          </FormField>
          <FormField label="Message" error={errors.message}>
            <Textarea rows={5} value={form.message} onChange={update("message")} colorPalette="brand" />
          </FormField>
          <Button type="submit" size="lg" colorPalette="brand">Send message</Button>
        </Stack>
      </Grid>
    </Container>
  );
};

export default Contact;
