import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  role: string;
  appUrl: string;
}

export default function WelcomeEmail({
  name,
  role,
  appUrl,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to CRM System</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to CRM System</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Your account has been created successfully as a {role}. You can now
            log in and start using the system.
          </Text>
          <Section style={buttonContainer}>
            <Link style={button} href={`${appUrl}/login`}>
              Log In Now
            </Link>
          </Section>
          <Text style={text}>
            If you have any questions, please don&apos;t hesitate to reach out
            to our support team.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#0a0a0a",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#171717",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "8px",
  maxWidth: "600px",
};

const h1 = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px",
};

const text = {
  color: "#a3a3a3",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "16px 0",
};

const buttonContainer = {
  margin: "32px 0",
};

const button = {
  backgroundColor: "#10b981",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
};
