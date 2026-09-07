import "../styles/globals.css";

import { Providers } from "@/components/layout/providers";
import { metadata } from "@/config/site";
import { fontCabin, fontNickainley, fontOutfit } from "@/lib/fonts";

export const generateMetadata = () => metadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontOutfit.variable} ${fontCabin.variable} ${fontNickainley.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
