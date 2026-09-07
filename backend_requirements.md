# Backend & Database Requirements

This document outlines the core functional requirements and database schema design for the "Diya" e-commerce application. It focuses on the data needs ("Fat DB") and necessary features without prescribing specific API implementations.

## 1. Core Entities & Database Schema ("Fat DB Design")

The database must support complex product structures, user management, and detailed order tracking.

### A. User Management
*   **Customer Requirements**:
    *   Store basic profile: Name, Email, Phone.
    *   Authentication: Secure login (Password or OAuth like Google).
    *   Address Book: Multiple saved addresses (Shipping/Billing).
    *   Wishlist: Saved products for later.
*   **Admin Requirements**:
    *   Role-based access (Super Admin vs. Manager).
    *   Access to sensitive order and revenue data.

### B. Product Catalog (Complex "Fat" Structure)
Must mirror the rich frontend types (Products, Variants, Media).
*   **Product Core**:
    *   `Name`, `Slug` (URL friendly ID), `Description` (Rich Text/HTML).
    *   `Base Price`, `Sale Price`, `Currency`.
    *   `SKU` (Stock Keeping Unit), `Barcode`.
    *   `Brand`, `Ribbon` (e.g., "New Arrival", "Best Seller").
*   **Media Gallery**:
    *   Multiple images and videos per product.
    *   Metadata: Alt text, thumbnail URLs, file types.
*   **Product Options & Variants**:
    *   Flexible options: Color, Size, Material.
    *   **Variants**: Specific combinations (e.g., "Red / Small") with their *own* stock, price, and SKU.
*   **Organization**:
    *   `Collections`: Group products (e.g., "Summer Sale", "Gifts").
    *   `Categories`: Hierarchical structure (e.g., Men > Shoes > Sneakers).
*   **Inventory**:
    *   Track quantity per variant.
    *   "Low Stock" thresholds.
    *   Allow/Disallow backorders.

### C. Discounts & Promotions
*   **Coupons**: Code-based discounts (Percentage or Fixed Amount).
*   **Automatic Discounts**: Applied at checkout (e.g., "Buy 2 Get 1 Free").
*   **Validity**: Start/End dates, usage limits per customer.

### D. Cart & Checkout
*   **Persistent Cart**: detailed line items saved to database (not just local storage) so users can resume shopping across devices.
*   **Line Items**: Snapshot of product data at time of addition (Price, Name, Image) to prevent errors if product changes later.

### E. Order Management System (OMS)
*   **Order Record**:
    *   Unique Order ID (e.g., #ORD-1001).
    *   Customer link (or Guest checkout email).
    *   Financials: Subtotal, Tax, Shipping Cost, Discount, Total.
    *   Status Pipeline: `Pending` -> `Confirmed` -> `Processing` -> `Shipped` -> `Delivered` -> `Cancelled`.
*   **Fulfillment**:
    *   Shipping Carrier, Tracking Number, Tracking URL.
    *   Fulfillment status details (e.g., Partial fulfillment).

### F. Reviews & Ratings
*   Star rating (1-5).
*   Text review.
*   "Helpful" votes.
*   Media uploads (User photos).
*   Status (Approved/Pending/Rejected) for moderation.

---

## 2. Payment Integration Requirements

The system must support secure, reliable payments with support for Indian and International customers.

### Functional Requirements
1.  **Multiple Gateways**:
    *   **Primary (India)**: **Razorpay** (Supports UPI, Cards, Netbanking, Wallets).
    *   **International**: **Stripe** (Cards, Apple Pay, Google Pay).
2.  **Currency Support**:
    *   Dynamic currency switching based on user location (INR/USD).
3.  **Transaction Security**:
    *   Server-side validation of every transaction signature (prevent tampering).
    *   No card details stored on our servers (PCI-DSS compliance via Gateway).
4.  **Payment Flows**:
    *   **Immediate Capture**: Charge card immediately upon order.
    *   **Refunds**: Ability to initiate partial or full refunds from the Admin dashboard.
5.  **Audit Trail**:
    *   Log every payment attempt (Success, Failure, Cancelled).
    *   Store Gateway Reference IDs (e.g., `pay_Hj8...`) for reconciliation.

---

## 3. Shipping & Logistics Requirements

*   **Zone-based Shipping**: Define rates based on country/state/pin code.
*   **Dynamic Calculation**: (Optional) Fetch live rates from courier partners (Shiprocket/Delhivery).
*   **Free Shipping Rules**: E.g., "Free shipping on orders above ₹999".

---

## 4. Admin Dashboard Features

*   **Overview**: Sales charts, Recent Orders, Low Stock Alerts.
*   **Order Processing**: Print Invoices, Generate Shipping Labels.
*   **Customer Insights**: Top customers, Repeat purchase rate.
*   **Content Management**: Banners, Blog posts, Page layouts.
