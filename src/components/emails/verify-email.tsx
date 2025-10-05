import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerifyEmailProps {
  name: string;
  otp: string;
}

export default function VerifyEmail({ name, otp }: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verify Your Email</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Thank you for signing up! Please use the following OTP code to
            verify your email address:
          </Text>
          <Section style={otpContainer}>
            <Text style={otpText}>{otp}</Text>
          </Section>
          <Text style={text}>This code will expire in 10 minutes.</Text>
          <Text style={text}>
            If you didn&apos;t request this, please ignore this email.
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

const otpContainer = {
  backgroundColor: "#262626",
  borderRadius: "8px",
  padding: "24px",
  margin: "32px 0",
  textAlign: "center" as const,
};

const otpText = {
  color: "#10b981",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
  margin: "0",
};
