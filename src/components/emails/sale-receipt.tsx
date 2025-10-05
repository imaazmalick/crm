import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface SaleReceiptProps {
  storeName: string;
  saleId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  posFee: number;
  total: number;
  paymentMethod: string;
  date: string;
}

export default function SaleReceipt({
  storeName,
  saleId,
  items,
  subtotal,
  posFee,
  total,
  paymentMethod,
  date,
}: SaleReceiptProps) {
  return (
    <Html>
      <Head />
      <Preview>Receipt for your purchase</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{storeName}</Heading>
          <Text style={text}>Thank you for your purchase!</Text>
          <Section style={receiptInfo}>
            <Text style={infoText}>Receipt #{saleId}</Text>
            <Text style={infoText}>{date}</Text>
            <Text style={infoText}>Payment: {paymentMethod}</Text>
          </Section>
          <Hr style={hr} />
          <Section>
            {items.map((item, index) => (
              <div key={index} style={itemRow}>
                <Text style={itemName}>
                  {item.name} x {item.quantity}
                </Text>
                <Text style={itemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </div>
            ))}
          </Section>
          <Hr style={hr} />
          <Section>
            <div style={itemRow}>
              <Text style={text}>Subtotal</Text>
              <Text style={text}>${subtotal.toFixed(2)}</Text>
            </div>
            <div style={itemRow}>
              <Text style={text}>POS Fee</Text>
              <Text style={text}>${posFee.toFixed(2)}</Text>
            </div>
            <div style={itemRow}>
              <Text style={totalText}>Total</Text>
              <Text style={totalText}>${total.toFixed(2)}</Text>
            </div>
          </Section>
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
  textAlign: "center" as const,
};

const text = {
  color: "#a3a3a3",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
};

const receiptInfo = {
  backgroundColor: "#262626",
  borderRadius: "8px",
  padding: "16px",
  margin: "24px 0",
};

const infoText = {
  color: "#a3a3a3",
  fontSize: "12px",
  margin: "4px 0",
};

const hr = {
  borderColor: "#262626",
  margin: "16px 0",
};

const itemRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};

const itemName = {
  color: "#ffffff",
  fontSize: "14px",
  margin: "0",
};

const itemPrice = {
  color: "#ffffff",
  fontSize: "14px",
  margin: "0",
  fontWeight: "600",
};

const totalText = {
  color: "#10b981",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "8px 0",
};
