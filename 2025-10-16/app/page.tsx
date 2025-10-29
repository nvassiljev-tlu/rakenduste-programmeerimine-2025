import { Container, Title, Paper, Divider } from "@mantine/core";
import { ContactForm } from "./components/ContactForm";
import { ApiFetcher } from "./components/ApiFetcher";

export default function Home() {
  return (
    <Container size="sm" py="xl">
      <Paper shadow="sm" p="xl" radius="md">
        <Title order={1} mb="xl">
          Contact Form
        </Title>
        <ContactForm />
      </Paper>

      <Divider size="md" />

      <Paper shadow="sm" p="xl" radius="md">
        <Title order={1} mb="xl">
          API Fetcher
        </Title>
        <ApiFetcher />
      </Paper>
    </Container>
  );
}
