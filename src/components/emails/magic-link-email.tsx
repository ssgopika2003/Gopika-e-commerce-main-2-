// import {
//   Body,
//   Container,
//   Head,
//   Heading,
//   Hr,
//   Html,
//   Img,
//   Link,
//   Preview,
//   Section,
//   Text,
// } from "@react-email/components";

// interface RaycastMagicLinkEmailProps {
//   magicLink?: string;
//   name?: string;
//   type?: "login" | "reset";
// }

// const baseUrl = process.env.BETTER_AUTH_URL;

// export const MagicLinkEmail = ({
//   magicLink,
//   name,
//   type = "login",
// }: RaycastMagicLinkEmailProps) => {
//   const isReset = type === "reset";

//   return (
//     <Html>
//       <Head />
//       <Preview>
//         {isReset
//           ? "Reset your Diya account password"
//           : "Sign in to your Diya account"}
//       </Preview>

//       <Body style={main}>
//         <Container style={container}>
//           <Img
//             src={`${baseUrl}/kalyani-university-kalyani-logo.png`}
//             width={48}
//             height={48}
//             alt="University of Kalyani"
//           />

//           <Heading style={heading}>
//             {isReset ? "Reset your password" : "🪄 Your magic sign-in link"}
//           </Heading>

//           <Section style={body}>
//             <Text style={paragraph}>Hi {name ?? "there"},</Text>

//             <Text style={paragraph}>
//               {isReset
//                 ? "We received a request to reset your Diya account password. Click the link below to set a new password."
//                 : "Click the link below to securely sign in to your Diya account."}
//             </Text>

//             <Text style={paragraph}>
//               <Link style={link} href={magicLink}>
//                 👉 {isReset ? "Reset Password" : "Sign in"} 👈
//               </Link>
//             </Text>

//             <Text style={paragraph}>
//               This link is valid for a limited time and can be used only once.
//               If it doesn’t open, please copy and paste the link into your
//               browser.
//             </Text>
//             <Link style={link} href={magicLink}>
//               {magicLink}
//             </Link>
//             <Text style={paragraph}>
//               This link is valid for a limited time and can be used only once.
//             </Text>

//             <Text style={paragraph}>
//               If you didn&apos;t request this, please ignore this email.
//             </Text>
//           </Section>

//           <Text style={paragraph}>
//             Best regards,
//             <br />— <strong>Diya Team</strong>
//           </Text>

//           <Hr style={hr} />

//           <Text style={footer}>Diya PG Hall-1</Text>
//           <Text style={footer}>2026 University of Kalyani, Kalyani, Nadia</Text>
//         </Container>
//       </Body>
//     </Html>
//   );
// };

// export default MagicLinkEmail;

// const main = {
//   backgroundColor: "#ffffff",
//   fontFamily:
//     '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
// };

// const container = {
//   margin: "0 auto",
//   padding: "20px 25px 48px",
//   backgroundImage: 'url("/static/raycast-bg.png")',
//   backgroundPosition: "bottom",
//   backgroundRepeat: "no-repeat, no-repeat",
// };

// const heading = {
//   fontSize: "28px",
//   fontWeight: "bold",
//   marginTop: "48px",
// };

// const body = {
//   margin: "24px 0",
// };

// const paragraph = {
//   fontSize: "16px",
//   lineHeight: "26px",
// };

// const link = {
//   color: "#FF6363",
// };

// const hr = {
//   borderColor: "#dddddd",
//   marginTop: "48px",
// };

// const footer = {
//   color: "#8898aa",
//   fontSize: "12px",
//   marginLeft: "4px",
// };
