import type { Metadata } from "next";

import { SITE_DESCRIPTION, SUPPORT_INSTAGRAM } from "@/lib/constants";
import type { NavItem } from "@/types/nav";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://apnadiya.in";
export const imagePreview = "/images/diya-screenshot-desktop.webp";
export const metadata: Metadata = {
  title: {
    default: "Diya",
    template: "%s | Diya",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Diya",
    "apnadiya",
    "apnadiyain",
    "apnadiyahome",
    "apnadiya.in",
    "apnadiya home",
    "Scented candles gift set",
    "scented candles under 100",
    "scented candles best",
    "scented candle gift",
    "scented candles online",
    "scented candles in jar",
    "Scented candles under 200",
  ],
  metadataBase: new URL(siteUrl),
  authors: [{ name: "Diya Team", url: siteUrl }],
  openGraph: {
    title: "Diya",
    description: SITE_DESCRIPTION,
    url: siteUrl,
    siteName: "Diya",
    images: [
      {
        url: imagePreview,
        width: 1200,
        height: 630,
        alt: "Diya Desktop Screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diya",
    description: "",
    images: [imagePreview],
  },

  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: [
      { url: "/icon/icon-56x56.ico", sizes: "56x56", type: "image/ico" },
      { url: "/icon/icon-128x128.ico", sizes: "128x128", type: "image/ico" },
      { url: "/icon/icon-256x256.ico", sizes: "256x256", type: "image/ico" },
    ],
    other: [
      { rel: "icon", url: "/icon/icon-16x16.ico", sizes: "16x16" },
      { rel: "icon", url: "/icon/icon-36x36.ico", sizes: "36x36" },
      { rel: "icon", url: "/icon/icon-48x48.ico", sizes: "48x48" },
      { rel: "icon", url: "/icon/icon-56x56.ico", sizes: "56x56" },
      { rel: "icon", url: "/icon/icon-128x128.ico", sizes: "128x128" },
      { rel: "icon", url: "/icon/icon-256x256.ico", sizes: "256x256" },
    ],
  },
  other: {
    "instagram:profile": SUPPORT_INSTAGRAM,
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Diya",
  },
};

export const MAIN_NAV: NavItem[] = [
  {
    name: "HOME",
    href: "/",
  },
  { name: "ABOUT US", href: "/about-us" },
  { name: "CONTACT US", href: "/contact-us" },
];

export const PRIVACY_POLICY = `
<p><strong>Last Updated:</strong> February 10, 2026</p>
<p>
    Welcome to <strong>DIYA</strong> ("we," "our," or "us"). We are committed to protecting your privacy and ensuring
    your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we
    collect, use, and protect your data when you visit our website or purchase our handcrafted candles.
</p>
<h2>1. Information We Collect</h2>
<p>We collect information required to process your orders and provide a better shopping experience:</p>
<ul>
    <li><strong>Personal Information:</strong> Name, Email Address, Phone Number, and Shipping Address.</li>
    <li><strong>Payment Information:</strong> We do <strong>not</strong> store your credit/debit card details. All payments are processed securely through RBI-compliant payment gateways (Instamojo/PhonePe).</li>
    <li><strong>Usage Data:</strong> Information on how you access and use the site (e.g., browser type, pages visited).</li>
</ul>
<h2>2. How We Use Your Information</h2>
<p>We use your data for the following purposes:</p>
<ul>
    <li>To process and deliver your orders (Candles).</li>
    <li>To communicate with you regarding order updates, shipping status, or customer support.</li>
    <li>To improve our website functionality and product offerings.</li>
    <li>To comply with legal obligations and prevent fraud.</li>
</ul>
<h2>3. Information Sharing</h2>
<p>We respect your privacy and do not sell your personal data. We only share information with:</p>
<ul>
    <li><strong>Payment Gateways:</strong> (e.g., Instamojo, PhonePe) to securely process transactions.</li>
    <li><strong>Logistics Partners:</strong> To deliver your products to your doorstep.</li>
    <li><strong>Legal Authorities:</strong> If required by law or to protect our rights.</li>
</ul>
<h2>4. Cookies</h2>
<p>
    Our website uses cookies to enhance your browsing experience (e.g., keeping items in your cart).
    You can choose to disable cookies through your browser settings, though this may affect site functionality.
</p>
<h2>5. Data Security</h2>
<p>
    We implement appropriate security measures to protect your personal information from unauthorized access,
    alteration, or disclosure. However, no method of transmission over the internet is 100% secure.
</p>
<h2>6. Changes to This Policy</h2>
<p>
    We may update our Privacy Policy from time to time. We encourage you to review this page periodically
    for any changes.
</p>
<h2>7. Contact Us</h2>
<p>If you have any questions about this Privacy Policy, please contact us:</p>
<p><strong>Email:</strong> diya.home14@gmail.com</p>
<p><strong>Phone:</strong> +91 83918 39382</p>
<p><strong>Address:</strong> Kalyani, West Bengal, India</p
`;

export const TERMS_OF_SERVICE = `
<p>
    By accessing this webpage, you are agreeing to be bound by these Terms and Conditions (“Terms”) in a legally binding agreement between us (“Merchant”, “us”, “we”, or “our”) and the User (“you” or “your”).
    Please read these Terms carefully before accessing or using the Website. If you do not agree to the Terms, you may not access the Platform.
</p>

<p>
    We reserve the right to update and change the Terms and Conditions by posting updates and changes to the Platform.
    You are advised to check the Terms periodically. If such amendments are not acceptable to you, you should cease using the Platform.
</p>

<h2>Eligibility</h2>
<p>
    You represent and warrant that you have the right, power, and authority to agree to these Terms and to enter into a legally binding agreement.
</p>

<h2>Definitions</h2>
<p><strong>Payment Instrument:</strong> Includes credit card, debit card, bank account, prepaid payment instruments, UPI, IMPS, or other payment methods introduced by banks or financial institutions.</p>
<p><strong>Platform:</strong> The website or platform where the Merchant offers products or services.</p>
<p><strong>Transaction:</strong> An order or request placed by the User to purchase products and/or services.</p>
<p><strong>Transaction Amount:</strong> The amount paid by the User for a Transaction.</p>
<p><strong>User/Users:</strong> Any person availing products or services on the Platform.</p>
<p><strong>Website:</strong> www.instamojo.com or the mobile application.</p>

<h2>Merchant’s Rights</h2>
<p>
    We may collect, store, and share information provided by you to deliver products or services and to contact you regarding the same.
</p>

<h2>Your Responsibilities</h2>
<p>
    You agree to provide true, complete, and accurate information including personal and payment details required to complete Transactions.
</p>

<h2>Prohibited Actions</h2>
<ul>
    <li>Using the Platform for unauthorized or commercial purposes without approval</li>
    <li>Collecting user data without permission</li>
    <li>Bypassing or interfering with security features</li>
    <li>Impersonating others or providing false information</li>
    <li>Using automated systems, bots, or scripts</li>
    <li>Uploading malware, viruses, or spam content</li>
    <li>Reverse engineering or copying the Platform’s software</li>
    <li>Harassing or threatening employees or users</li>
    <li>Using the Platform in violation of applicable laws</li>
</ul>

<h2>Limitation of Liability</h2>
<p>
    The User’s sole remedy for defective products or deficient services is a refund, subject to applicable refund terms.
    We disclaim all liabilities for losses arising from such Transactions.
</p>

<h2>Guidelines for Reviews</h2>
<ul>
    <li>Reviews must be based on firsthand experience</li>
    <li>No offensive, abusive, discriminatory, or illegal content</li>
    <li>No false or misleading statements</li>
    <li>No organized review campaigns</li>
</ul>
<p>
    We reserve the right to accept, reject, or remove reviews at our discretion.
    By posting a review, you grant us a perpetual, worldwide, royalty-free license to use the content.
</p>

<h2>Governing Laws &amp; Dispute Resolution</h2>
<p>
    These Terms are governed by the laws of India. Any disputes shall be resolved through arbitration in Bengaluru
    under the Arbitration and Conciliation Act, 1996. The arbitration shall be conducted in English and remain confidential.
</p>

<h2>Grievance Redressal</h2>
<p>
    For complaints related to Transactions, refunds, or unauthorized payments, you may contact us through the provided support channels.
</p>

<h2>Disclaimer</h2>
<p>
    Transactions are legally binding. Payments must be made using valid and lawful funds.
    We are not liable for unauthorized use of Payment Instruments or transaction failures.
</p>
<p>
    Platform content is provided for general information only and does not constitute advice.
    We do not guarantee that the Platform will be secure or error-free.
</p>
`;

export const REFUND_CANCELLATION = `
<p>
    Upon completing a Transaction, you are entering into a legally binding and enforceable agreement with us
    to purchase the product and/or service.
</p>
<p>
    After this point, the User may cancel the Transaction only if such cancellation has been specifically
    provided for on the Platform. In such cases, the cancellation shall be subject to the terms mentioned
    on the Platform.
</p>
<p>
    We reserve the discretion to approve or reject any cancellation requests and may request additional
    details before approving such requests.
</p>
<p>
    Once you have received the product and/or service, a request for replacement, return, or refund may
    only be made if the product and/or service does not match the description provided on the Platform.
</p>
<p>
    Any request for a refund must be submitted within three (3) days from the date of the Transaction,
    or within such number of days as prescribed on the Platform, which shall in no event be less than
    three (3) days.
</p>
<p>
    A User may submit a refund request by raising a support ticket or by contacting us at
    <a href="mailto:seller+08d9cbc43a804f309b39f2e5fea79320@instamojo.com">
        seller+08d9cbc43a804f309b39f2e5fea79320@instamojo.com
    </a>,
    along with a clear and specific reason for the refund request, including the exact terms that have
    been violated and any supporting proof, if required.
</p>
<p>
    The decision to grant a refund shall be made solely at our discretion, and we may request additional
    information before approving any refund requests.
</p>
`;

export const SHIPPING_DELIVERY = `
<p>
    Upon completing a Transaction, you are entering into a legally binding and enforceable agreement with us
    to purchase the product and/or service.
</p>
<p>
    After this point, the User may cancel the Transaction only if such cancellation has been specifically
    provided for on the Platform. In such cases, the cancellation shall be subject to the terms mentioned
    on the Platform.
</p>
<p>
    We reserve the discretion to approve or reject any cancellation requests and may request additional
    details before approving such requests.
</p>
<p>
    Once you have received the product and/or service, a request for replacement, return, or refund may
    only be made if the product and/or service does not match the description provided on the Platform.
</p>
<p>
    Any request for a refund must be submitted within three (3) days from the date of the Transaction,
    or within such number of days as prescribed on the Platform, which shall in no event be less than
    three (3) days.
</p>
<p>
    A User may submit a refund request by raising a support ticket or by contacting us at
    <a href="mailto:seller+08d9cbc43a804f309b39f2e5fea79320@instamojo.com">
        seller+08d9cbc43a804f309b39f2e5fea79320@instamojo.com
    </a>,
    along with a clear and specific reason for the refund request, including the exact terms that have
    been violated and any supporting proof, if required.
</p>
<p>
    The decision to grant a refund shall be made solely at our discretion, and we may request additional
    information before approving any refund requests.
</p>
`;
