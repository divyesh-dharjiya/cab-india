"use client";
import { useState } from "react";
import {
  Accordion,
  Box,
  Button,
  Container,
  Field,
  Flex,
  Grid,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Clock, MapPin, MessageSquareText, Send } from "lucide-react";
import PageHero from "../components/page-hero/page-hero";
import { toaster } from "../components/toaster/toaster";

const INITIAL_FORM = { name: "", email: "", message: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = ({ name, email, message }) => ({
  ...(!name.trim() && { name: "Please enter your name." }),
  ...(!EMAIL_PATTERN.test(email.trim()) && { email: "Please enter a valid email address." }),
  ...(message.trim().length < 10 && { message: "Please write at least 10 characters." }),
});

const INFO = [
  { icon: Clock, title: "Support hours", text: "Every day, 24 × 7" },
  { icon: MapPin, title: "Coverage", text: "Rides across all states and union territories of India" },
  { icon: MessageSquareText, title: "Response time", text: "We usually reply within one business day" },
];

const FAQS = [
  {
    q: "How is my fare calculated?",
    a: "Each cab type has a base fare and a per-kilometre rate. We multiply the rate by the driving distance of your route, add the base fare, and never go below the cab's minimum fare.",
  },
  {
    q: "Are tolls and parking included?",
    a: "No. The estimate covers the ride itself. Tolls, parking and waiting charges are added separately.",
  },
  {
    q: "Which locations can I book?",
    a: "Any pickup and drop within India. Search suggestions only show Indian places, and your current location must be in India to use it as a pickup.",
  },
  {
    q: "Why does the travel time differ from my trip?",
    a: "Travel time is an estimate based on typical road speeds. Live traffic, weather and stops can make the real trip longer or shorter.",
  },
];

const FormField = ({ label, error, children }) => (
  <Field.Root invalid={!!error} required>
    <Field.Label fontWeight={600}>
      {label}
      <Field.RequiredIndicator />
    </Field.Label>
    {children}
    <Field.ErrorText>{error}</Field.ErrorText>
  </Field.Root>
);

const inputStyles = { size: "lg", rounded: "xl", bg: "gray.50", colorPalette: "brand", _focus: { bg: "white" } };

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
    <Box>
      <PageHero
        eyebrow="Contact"
        title="We're here to help"
        text="Questions about a ride, fares or partnerships? Send us a message and our team will get back to you."
      />

      <Container maxW="6xl" mt={{ base: -10, md: -14 }} position="relative" pb={{ base: 14, md: 20 }}>
        <Grid templateColumns={{ base: "1fr", md: "1.4fr 1fr" }} gap={6} alignItems="start">
          <Stack
            as="form"
            onSubmit={handleSubmit}
            noValidate
            gap={5}
            bg="white"
            p={{ base: 6, md: 8 }}
            rounded="3xl"
            boxShadow="0 24px 60px -20px rgba(11, 15, 25, 0.25)"
          >
            <Heading as="h2" size="xl" color="ink.900">Send us a message</Heading>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={5}>
              <FormField label="Name" error={errors.name}>
                <Input value={form.name} onChange={update("name")} autoComplete="name" {...inputStyles} />
              </FormField>
              <FormField label="Email" error={errors.email}>
                <Input type="email" value={form.email} onChange={update("email")} autoComplete="email" {...inputStyles} />
              </FormField>
            </Grid>
            <FormField label="Message" error={errors.message}>
              <Textarea rows={6} value={form.message} onChange={update("message")} {...inputStyles} />
            </FormField>
            <Button type="submit" size="lg" colorPalette="brand" rounded="xl" alignSelf={{ sm: "flex-start" }} px={8}>
              Send message <Send />
            </Button>
          </Stack>

          <Stack gap={4}>
            {INFO.map((item) => (
              <Flex key={item.title} gap={4} bg="white" p={5} rounded="2xl" borderWidth="1px" borderColor="gray.200">
                <Flex w={11} h={11} flexShrink={0} rounded="xl" bg="brand.50" color="brand.700" align="center" justify="center">
                  <item.icon size={20} />
                </Flex>
                <Stack gap={0.5}>
                  <Text fontWeight={700} color="ink.900">{item.title}</Text>
                  <Text color="gray.600" fontSize="sm">{item.text}</Text>
                </Stack>
              </Flex>
            ))}
          </Stack>
        </Grid>

        <Box id="faq" mt={{ base: 14, md: 20 }} maxW="3xl" mx="auto" scrollMarginTop="80px">
          <Heading as="h2" size={{ base: "2xl", md: "3xl" }} color="ink.900" textAlign="center" mb={8}>
            Frequently asked questions
          </Heading>
          <Accordion.Root collapsible defaultValue={[FAQS[0].q]} variant="plain">
            <Stack gap={3}>
              {FAQS.map((faq) => (
                <Accordion.Item key={faq.q} value={faq.q} bg="white" rounded="2xl" borderWidth="1px" borderColor="gray.200" px={5}>
                  <Accordion.ItemTrigger py={4} fontWeight={700} fontSize="md" color="ink.900" cursor="pointer">
                    <Text flex={1} textAlign="start">{faq.q}</Text>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody pb={5} pt={0} color="gray.600">{faq.a}</Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              ))}
            </Stack>
          </Accordion.Root>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;
