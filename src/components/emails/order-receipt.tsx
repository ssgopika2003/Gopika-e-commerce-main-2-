import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

import { SUPPORT_EMAIL } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { Order, OrderItem } from "@/types/order";

interface OrderReceiptEmailProps {
  order: Order;
  customerEmail: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

export const OrderReceiptEmail = ({
  order,
  customerEmail,
}: OrderReceiptEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Diya Receipt - Order #{order.orderNumber}</Preview>

    <Body style={main}>
      <Container style={container}>
        <Section>
          <Row>
            <Column>
              <Img
                src={`${baseUrl}/logo.svg`}
                width="42"
                height="42"
                alt="Diya Logo"
                style={logo}
              />
            </Column>
            <Column align="right">
              <Heading style={heading}>Receipt</Heading>
            </Column>
          </Row>
        </Section>

        <Section style={informationTable}>
          <Row style={informationTableRow}>
            <Column colSpan={2}>
              <Row>
                <Column style={informationTableColumn}>
                  <Text style={informationTableLabel}>CUSTOMER EMAIL</Text>
                  <Link
                    style={{
                      ...informationTableValue,
                      color: "#1555CC",
                      textDecoration: "underline",
                    }}
                  >
                    {customerEmail}
                  </Link>
                </Column>
              </Row>
              <Row>
                <Column style={informationTableColumn}>
                  <Text style={informationTableLabel}>INVOICE DATE</Text>
                  <Text style={informationTableValue}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column style={informationTableColumn}>
                  <Text style={informationTableLabel}>ORDER ID</Text>
                  <Text style={informationTableValue}>{order.orderNumber}</Text>
                </Column>
              </Row>
            </Column>
            <Column style={informationTableColumnBilled}>
              <Text style={informationTableLabel}>BILLED TO</Text>
              <Text style={informationTableValue}>
                {order.shippingAddress?.fullName}
              </Text>
              <Text style={informationTableValue}>
                {order.shippingAddress?.addressLine1}
              </Text>
              <Text style={informationTableValue}>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.postalCode}
              </Text>
            </Column>
          </Row>
        </Section>

        <Section style={productTitleTable}>
          <Text style={productsTitle}>Order Items</Text>
        </Section>

        {order.items.map((item: OrderItem) => (
          <Section key={item.id}>
            <Row>
              <Column style={{ width: "64px" }}>
                <Img
                  src={item.image || `${baseUrl}/placeholder.png`}
                  width="64"
                  height="64"
                  alt={item.name || "Product"}
                  style={productIcon}
                />
              </Column>
              <Column style={{ paddingLeft: "22px" }}>
                <Text style={productTitle}>{item.name}</Text>
                {item.selectedOptions && (
                  <Text style={productDescription}>
                    {Object.entries(item.selectedOptions)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")}
                  </Text>
                )}
                <Text style={productDescription}>Qty: {item.quantity}</Text>
              </Column>

              <Column style={productPriceWrapper} align="right">
                <Text style={productPrice}>
                  {formatCurrency(Number(item.price))}
                </Text>
              </Column>
            </Row>
          </Section>
        ))}

        <Hr style={productPriceLine} />
        <Section align="right">
          <Row>
            <Column style={tableCell} align="right">
              <Text style={totalText}>SUBTOTAL</Text>
            </Column>
            <Column style={productPriceVerticalLine}></Column>
            <Column style={productPriceDataWrapper} align="right">
              <Text style={totalValue}>
                {formatCurrency(Number(order.subtotal))}
              </Text>
            </Column>
          </Row>
          {Number(order.discount) > 0 && (
            <Row>
              <Column style={tableCell} align="right">
                <Text style={totalText}>DISCOUNT</Text>
              </Column>
              <Column style={productPriceVerticalLine}></Column>
              <Column style={productPriceDataWrapper} align="right">
                <Text style={{ ...totalValue, color: "#16a34a" }}>
                  -{formatCurrency(Number(order.discount))}
                </Text>
              </Column>
            </Row>
          )}
          {Number(order.tax) > 0 && (
            <Row>
              <Column style={tableCell} align="right">
                <Text style={totalText}>TAX</Text>
              </Column>
              <Column style={productPriceVerticalLine}></Column>
              <Column style={productPriceDataWrapper} align="right">
                <Text style={totalValue}>
                  {formatCurrency(Number(order.tax))}
                </Text>
              </Column>
            </Row>
          )}
          <Row>
            <Column style={tableCell} align="right">
              <Text style={totalText}>SHIPPING</Text>
            </Column>
            <Column style={productPriceVerticalLine}></Column>
            <Column style={productPriceDataWrapper} align="right">
              <Text style={totalValue}>
                {Number(order.shippingCost) === 0
                  ? "FREE"
                  : formatCurrency(Number(order.shippingCost || 0))}
              </Text>
            </Column>
          </Row>
          <Row>
            <Column style={tableCell} align="right">
              <Text style={totalTextBold}>TOTAL</Text>
            </Column>
            <Column style={productPriceVerticalLine}></Column>
            <Column style={productPriceDataWrapper} align="right">
              <Text style={totalValueBold}>
                {formatCurrency(Number(order.total))}
              </Text>
            </Column>
          </Row>
        </Section>
        <Hr style={productPriceLineBottom} />

        <Section style={footer}>
          <Text style={footerText}>
            Thank you for choosing <strong>Diya</strong>. We truly appreciate
            your trust in us and are committed to delivering quality products
            and service.
          </Text>
          <Text style={{ ...footerText, marginTop: "15px" }}>
            You can track your order and manage your account anytime by visiting{" "}
            <Link href={`${baseUrl}`} style={footerLink}>
              Diya
            </Link>
          </Text>
          <Text style={{ ...footerText, marginTop: "15px" }}>
            If you need assistance, our support team is here to help. Please
            contact us at{" "}
            <Link href={`mailto:${SUPPORT_EMAIL}`} style={footerLink}>
              {SUPPORT_EMAIL}
            </Link>
            .
          </Text>
          <Text style={{ ...footerText, marginTop: "25px" }}>
            Copyright © 2026 Diya. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default OrderReceiptEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "660px",
  maxWidth: "100%",
};

const logo = {
  display: "block",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "300",
  color: "#888",
};

const informationTable = {
  borderCollapse: "collapse" as const,
  borderSpacing: "0",
  color: "#333",
  backgroundColor: "#fafafa",
  borderRadius: "3px",
  fontSize: "12px",
  marginTop: "30px",
};

const informationTableRow = {
  height: "46px",
};

const informationTableColumn = {
  paddingLeft: "20px",
  borderStyle: "solid",
  borderColor: "white",
  borderWidth: "0px 1px 1px 0px",
  height: "44px",
};

const informationTableColumnBilled = {
  paddingLeft: "20px",
  borderStyle: "solid",
  borderColor: "white",
  borderWidth: "0px 0px 1px 0px",
};

const informationTableLabel = {
  fontSize: "10px",
  color: "#666",
  marginBottom: "0",
};

const informationTableValue = {
  fontSize: "12px",
  margin: "0",
  padding: "0",
  lineHeight: "1.4",
};

const productsTitle = {
  fontSize: "14px",
  fontWeight: "500",
  margin: "0",
};

const productTitleTable = {
  ...informationTable,
  margin: "30px 0 15px 0",
  height: "24px",
};

const productIcon = {
  margin: "0 0 0 20px",
  borderRadius: "14px",
  border: "1px solid #f2f2f2",
};

const productTitle = {
  fontSize: "12px",
  fontWeight: "600",
  margin: "0",
};

const productDescription = {
  fontSize: "12px",
  color: "#666",
  margin: "0",
};

const productPriceWrapper = {
  display: "table-cell",
  paddingRight: "20px",
  width: "100px",
  verticalAlign: "top" as const,
};

const productPrice = {
  fontSize: "12px",
  fontWeight: "600",
  margin: "0",
};

const productPriceLine = {
  border: "none",
  borderTop: "1px solid #eaeaea",
  margin: "30px 0 0",
};

const productPriceVerticalLine = {
  height: "48px",
  borderLeft: "1px solid #eee",
};

const productPriceDataWrapper = {
  display: "table-cell",
  width: "90px",
};

const productPriceLineBottom = {
  border: "none",
  borderTop: "1px solid #eaeaea",
  margin: "0 0 75px",
};

const tableCell = { display: "table-cell" };

const totalText = {
  fontSize: "10px",
  fontWeight: "600",
  paddingRight: "30px",
  textAlign: "right" as const,
  color: "#666",
};

const totalTextBold = {
  ...totalText,
  color: "#000",
};

const totalValue = {
  fontSize: "14px",
  fontWeight: "600",
  margin: "0",
  paddingRight: "20px",
  textAlign: "right" as const,
  whiteSpace: "nowrap" as const,
};

const totalValueBold = {
  ...totalValue,
  fontSize: "18px",
  fontWeight: "bold",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#666",
  margin: "0",
};

const footerLink = {
  color: "#067df7",
  textDecoration: "none",
};
