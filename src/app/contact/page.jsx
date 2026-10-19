"use client";
import { useState } from "react";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";

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

const Contact = () => {
  const toast = useToast();
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
    toast({
      status: "success",
      title: `Thanks, ${form.name.trim()}!`,
      description: "Your message has been noted. We'll get back to you soon.",
      isClosable: true,
    });
    setForm(INITIAL_FORM);
    setIsSubmitted(false);
  };

  return (
    <Container maxW="6xl" py={{ base: 8, md: 14 }}>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1.3fr" }} gap={{ base: 8, md: 12 }}>
        <Stack spacing={6}>
          <Stack spacing={2}>
            <Heading size="xl">Get in touch</Heading>
            <Text color="gray.600">Questions about a ride, fares or partnerships? Send us a message.</Text>
          </Stack>
          {INFO.map((item) => (
            <Stack key={item.title} direction="row" spacing={4} align="flex-start">
              <Text fontSize="2xl" lineHeight={1}>{item.icon}</Text>
              <Stack spacing={0}>
                <Text fontWeight={700}>{item.title}</Text>
                <Text color="gray.600">{item.text}</Text>
              </Stack>
            </Stack>
          ))}
        </Stack>

        <Stack as="form" onSubmit={handleSubmit} noValidate spacing={4} bg="white" p={{ base: 5, md: 8 }} rounded="2xl" border="1px solid" borderColor="gray.200" boxShadow="sm">
          <FormControl isInvalid={!!errors.name} isRequired>
            <FormLabel>Name</FormLabel>
            <Input value={form.name} onChange={update("name")} autoComplete="name" focusBorderColor="brand.400" />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.email} isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={form.email} onChange={update("email")} autoComplete="email" focusBorderColor="brand.400" />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.message} isRequired>
            <FormLabel>Message</FormLabel>
            <Textarea rows={5} value={form.message} onChange={update("message")} focusBorderColor="brand.400" />
            <FormErrorMessage>{errors.message}</FormErrorMessage>
          </FormControl>
          <Button type="submit" size="lg">Send message</Button>
        </Stack>
      </Grid>
    </Container>
  );
};

export default Contact;
