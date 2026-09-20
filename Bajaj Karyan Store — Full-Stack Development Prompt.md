# Build a Full-Stack Confectionery & Grocery Ordering Platform — Bajaj karyana Store

Create a modern, production-ready full-stack web application named **“Bajaj karyana Store”** for a confectionery/kiryana store.

The application must have:

- Customer/client panel
- Admin panel
- Authentication
- Product/catalog management
- Shopping list/cart functionality
- Order placement without online payment
- Order management for admin
- Printable order/invoice-style PDF
- Responsive mobile-first UI
- Supabase backend
- Next.js frontend/backend architecture

The first version must **NOT include any payment gateway**. Orders are placed as “Cash / Pay Later / Offline Payment” orders and are handled manually by the store administrator.

---

# 1. Technology Stack

Use the following technology stack:

### Frontend

- Next.js latest stable version
- App Router
- TypeScript
- React
- Tailwind CSS
- shadcn/ui where useful
- Lucide React icons
- Responsive design
- Server Components wherever appropriate
- Client Components only where interactivity is required

### Backend

Use **Supabase** for:

- PostgreSQL database
- Authentication
- Row Level Security
- Storage
- Database functions/triggers where appropriate

### PDF

Use a suitable browser/server-side PDF generation solution.

Preferred options:

- `@react-pdf/renderer`
- or another reliable PDF generation library compatible with Next.js

Admin must be able to generate and print/download an order PDF.

### Deployment

Application should be designed for deployment on:

- Vercel
- Supabase

The architecture should also be compatible with other Node.js hosting platforms.

---

# 2. Brand Identity

Store name:

**BAJAJ karyana STORE**

Use a premium but friendly confectionery/grocery visual identity.

Primary color palette:

```css
--night-bordeaux: #590d22;
--dark-amaranth: #800f2f;
--cherry-rose: #a4133c;
--rosewood: #c9184a;
--bubblegum-pink: #ff4d6d;
--bubblegum-pink-2: #ff758f;
--cotton-candy: #ff8fa3;
--cherry-blossom: #ffb3c1;
--pastel-pink: #ffccd5;
--lavender-blush: #fff0f3;
```

Use these colors consistently throughout the application.

Suggested usage:

### Primary

`#590d22`

For:

- Navbar
- Headings
- Admin sidebar
- Strong text
- Footer

### Secondary

`#800f2f`
`#a4133c`
`#c9184a`

For:

- Buttons
- Active navigation
- Product badges
- Important UI states

### Accent

`#ff4d6d`
`#ff758f`

For:

- CTA buttons
- Cart indicators
- Highlights
- Hover states

### Soft backgrounds

`#ff8fa3`
`#ffb3c1`
`#ffccd5`
`#fff0f3`

For:

- Cards
- Sections
- Backgrounds
- Empty states
- Promotional areas

Avoid making the entire application overwhelmingly pink. Maintain strong contrast and a premium retail feel using white/cream surfaces, dark Bordeaux typography, and pink accents.

---

# 3. Application Structure

Create the application with the following high-level sections:

```text
Bajaj karyana Store
│
├── Public Website
│   ├── Home
│   ├── Products
│   ├── Categories
│   ├── Product Details
│   ├── Login
│   ├── Register
│   └── Contact / Store Information
│
├── Customer Panel
│   ├── Dashboard
│   ├── Browse Products
│   ├── Product Details
│   ├── Shopping List / Cart
│   ├── Checkout
│   ├── My Orders
│   ├── Order Details
│   └── Profile
│
└── Admin Panel
    ├── Dashboard
    ├── Products
    ├── Categories
    ├── Inventory
    ├── Customers
    ├── Orders
    ├── Order Details
    ├── Printable Orders
    └── Settings
```

---

# 4. Authentication

Implement authentication using Supabase Auth.

Support:

### Customer

- Sign up
- Login
- Logout
- Forgot password
- Reset password
- Profile management

### Admin

Admin accounts must have a separate authorization mechanism.

Do NOT simply rely on frontend route hiding.

Use Supabase database roles/profile records and Row Level Security.

Recommended roles:

```text
customer
admin
```

Create a `profiles` table linked to `auth.users`.

Example:

```text
profiles
---------
id
full_name
phone
email
role
address
city
state
pincode
avatar_url
created_at
updated_at
```

Default new registrations to:

```text
role = customer
```

Admin role must only be assigned manually/securely.

---

# 5. Customer Experience

Customers should be able to browse the store catalog after logging in.

They should see:

- Product image
- Product name
- Category
- Description
- Available quantity
- Unit/measurement
- Price
- Availability
- Add to list/cart

The system must support different product selling units.

Examples:

```text
₹20 / packet
₹50 / packet
₹120 / kg
₹60 / 500 g
₹30 / piece
₹100 / box
₹40 / litre
```

Products must not assume a fixed unit.

---

# 6. Product Model

Create a flexible product structure.

Recommended table:

```text
products
--------
id
category_id
name
slug
description
image_url
price
sale_price
unit_type
unit_value
sku
stock_quantity
is_available
is_featured
is_active
created_at
updated_at
```

Possible `unit_type` values:

```text
piece
packet
box
kg
gram
litre
ml
dozen
bundle
custom
```

`unit_value` can describe:

```text
1
250
500
1000
```

Example:

```text
Product: Sugar
unit_type: kg
unit_value: 1
price: 55
```

Another:

```text
Product: Biscuits
unit_type: packet
unit_value: 1
price: 20
```

Another:

```text
Product: Cooking Oil
unit_type: litre
unit_value: 1
price: 145
```

Allow the admin to configure the display label.

---

# 7. Important Price Requirement

Price must be optional.

Some store products may not have a visible/fixed price.

Therefore support:

```text
price = NULL
```

When a product does not have a price:

Display:

**“Price on request”**

or

**“Contact store for price”**

The customer can still add that item to the shopping list/order.

When creating an order, the admin can later determine the final price.

The checkout system must therefore support products with:

```text
known price
```

and:

```text
price not specified
```

---

# 8. Shopping List / Cart

Call this feature:

**My Shopping List**

rather than relying entirely on the standard e-commerce terminology.

Customers can add products to their shopping list.

Each list item should support:

- Product
- Quantity
- Unit
- Notes
- Requested weight
- Requested quantity
- Price estimate
- Price availability

Example:

```text
Sugar
Quantity: 2 kg
Notes: Fine sugar

Biscuits
Quantity: 5 packets

Dry Fruits
Quantity: 500 g
Notes: Mixed dry fruits
```

Allow customers to adjust quantities before placing the order.

---

# 9. Weight and Quantity Input

The shopping list must intelligently support different measurement types.

Examples:

### Piece-based

```text
Quantity: 3 pieces
```

### Weight-based

```text
Weight: 500 g
Weight: 1 kg
Weight: 2.5 kg
```

### Volume-based

```text
1 litre
500 ml
```

Allow decimal quantities when appropriate.

Examples:

```text
0.5 kg
1.5 kg
2.25 kg
```

The database must not store quantities only as integers.

Use suitable numeric/decimal fields.

---

# 10. Customer Checkout

There is **NO ONLINE PAYMENT**.

The customer simply submits the order/request.

Checkout should collect:

### Customer information

- Full name
- Phone number
- Email
- Delivery address
- Landmark
- City
- State
- Pincode

### Order information

- Products
- Quantities
- Requested weight
- Customer notes
- Preferred delivery notes

Show:

```text
Estimated Total
```

But clearly explain:

**“Final price will be confirmed by Bajaj karyana Store.”**

Especially when some products have no listed price.

---

# 11. Order Status

Create an order status workflow.

Suggested statuses:

```text
pending
confirmed
preparing
ready
out_for_delivery
delivered
cancelled
```

Admin can update status.

Customer can view their order status.

Example timeline:

```text
Order Placed
     ↓
Confirmed
     ↓
Preparing
     ↓
Out for Delivery
     ↓
Delivered
```

---

# 12. Orders Database

Create:

```text
orders
------
id
order_number
customer_id
status
subtotal
discount
delivery_charge
estimated_total
final_total
payment_status
payment_method
customer_name
customer_phone
delivery_address
landmark
city
state
pincode
customer_notes
admin_notes
created_at
updated_at
```

Since there is no payment gateway:

```text
payment_method = offline
```

and:

```text
payment_status =
pending
paid
```

The admin can manually mark an order as paid later if required.

---

# 13. Order Items

Create:

```text
order_items
-----------
id
order_id
product_id
product_name
unit_type
unit_value
quantity
requested_weight
unit_price
line_total
price_confirmed
customer_notes
created_at
```

IMPORTANT:

Store a snapshot of product information in the order.

For example:

```text
product_name
unit_price
unit_type
```

must be copied into the order item when the order is created.

This ensures that changing/deleting a product later does not alter historical orders.

---

# 14. Order Number

Automatically generate human-friendly order numbers.

Example:

```text
BKS-2026-000001
BKS-2026-000002
BKS-2026-000003
```

Do not expose raw UUIDs as the primary order reference to customers.

---

# 15. Admin Dashboard

Create a professional admin dashboard.

Dashboard should display:

### KPI Cards

```text
Today's Orders
Pending Orders
Orders This Month
Total Customers
Active Products
```

### Order summary

Show:

```text
Pending
Confirmed
Preparing
Out for Delivery
Delivered
Cancelled
```

### Recent Orders

Table columns:

```text
Order #
Customer
Phone
Items
Amount
Status
Date
Actions
```

---

# 16. Admin Product Management

Admin should be able to:

- Add product
- Edit product
- Delete/deactivate product
- Upload product image
- Assign category
- Set price
- Remove price
- Set unit
- Set stock
- Mark unavailable
- Mark featured
- Add description
- Add SKU
- Search products
- Filter products
- Sort products

Product creation form must support all unit types.

---

# 17. Product Categories

Create a categories table:

```text
categories
----------
id
name
slug
description
image_url
is_active
sort_order
created_at
updated_at
```

Examples:

```text
Biscuits
Chocolates
Namkeen
Toffees
Bakery
Cold Drinks
Dry Fruits
Grocery
Snacks
Daily Essentials
```

Admin can create/edit/delete categories.

---

# 18. Inventory

Create a simple inventory management interface.

Admin should see:

```text
Product
Current Stock
Unit
Low Stock
Availability
```

Support:

```text
In Stock
Low Stock
Out of Stock
```

Use configurable low-stock thresholds.

Do not over-engineer inventory in version 1.

---

# 19. Customer Management

Admin should be able to view customers.

Customer table:

```text
Customer
Phone
Email
Orders
Last Order
Status
Joined
```

Admin should be able to view customer order history.

Do not allow the admin to access sensitive authentication credentials.

---

# 20. Order Management

Create a dedicated order management page.

Features:

- Search orders
- Filter status
- Filter date
- Search order number
- Search customer
- Open order
- Change status
- Add admin notes
- Add final price
- Mark payment status
- Print order
- Download PDF

Order details page should contain:

### Header

```text
BAJAJ karyana STORE
Order #BKS-2026-000001
```

### Customer Information

```text
Name
Phone
Email
Address
```

### Order Items

```text
Product | Quantity | Unit | Price | Total
```

### Pricing

```text
Subtotal
Discount
Delivery
Final Total
```

### Notes

Customer Notes

Admin Notes

### Status

Visual status timeline.

---

# 21. Admin Price Confirmation

Because prices can be optional, admin must be able to confirm prices before delivery.

For every order item:

```text
Price Confirmed: Yes / No
Unit Price
Line Total
```

Admin should be able to update prices directly within the order.

The system should recalculate:

```text
subtotal
final_total
```

automatically.

---

# 22. Order PDF

Admin must have a button:

**Print Order**

and:

**Download PDF**

Generate a clean professional printable order document.

PDF should include:

```text
BAJAJ karyana STORE
Address
Phone
Email

ORDER RECEIPT

Order Number
Order Date
Customer Name
Customer Phone

Delivery Address

--------------------------------------------

Item
Quantity
Unit
Price
Total

--------------------------------------------

Subtotal
Discount
Delivery Charge
Grand Total

--------------------------------------------

Customer Notes
Admin Notes

Order Status

Payment Status

--------------------------------------------

Thank you for shopping with Bajaj karyana Store
```

PDF should be printer-friendly:

- A4
- strong typography
- black/dark text
- subtle brand color accents
- no unnecessary gradients
- good spacing
- clean table

Also provide a compact thermal/receipt-friendly layout if practical.

---

# 23. Public Home Page

Create a premium storefront homepage.

Sections:

### Navigation

Logo:

**BAJAJ karyana STORE**

Navigation:

```text
Home
Shop
Categories
My Orders
My List
```

Right side:

```text
Search
User
Shopping List
```

### Hero

Example messaging:

**Everything You Need, From Our Store to Your Door.**

Supporting text:

**Browse our confectionery and grocery collection, create your shopping list, and place your order with ease.**

CTA:

```text
Shop Now
Create Shopping List
```

### Category section

Beautiful category cards.

### Featured products

Product cards with:

- Image
- Name
- Category
- Price/unit
- Add button

### Why Choose Us

Examples:

```text
Trusted Local Store
Quality Products
Easy Ordering
Flexible Delivery
```

### How it Works

```text
1. Browse Products
2. Create Your List
3. Place Your Order
4. We Confirm & Deliver
```

### Footer

Include:

- Store name
- Contact information
- Address
- Opening hours
- Navigation
- Social links placeholders
- Copyright

---

# 24. Product Card

Create elegant reusable product cards.

Show:

```text
Image
Category
Product Name
Short Description
Price
Unit
Availability
Add to List
```

Price examples:

```text
₹50 / packet
₹120 / kg
₹30 / piece
```

If price is unavailable:

```text
Price on Request
```

Button:

```text
Add to List
```

Use loading and success feedback.

---

# 25. Search

Implement product search.

Search should support:

- Product name
- SKU
- Category

Provide:

- Search field
- Clear button
- Search suggestions if practical
- Debounced search on client side

---

# 26. Filtering

Customer product browsing should allow:

- Category
- Availability
- Price availability
- Featured
- Unit type

Admin product browsing should support:

- Category
- Availability
- Stock
- Price set/unset
- Active/inactive

---

# 27. Responsive Design

The application must be fully responsive.

Prioritize:

### Mobile

375px+

### Tablet

768px+

### Desktop

1024px+

### Large desktop

1440px+

The shopping experience should feel particularly good on mobile because customers may use phones to place store orders.

---

# 28. Navigation UX

Mobile navigation should use:

- Bottom navigation or a polished mobile menu

Potential customer mobile navigation:

```text
Home
Shop
My List
Orders
Profile
```

Display cart/list count as a badge.

---

# 29. UI Design Language

Use:

- Rounded cards
- Soft shadows
- Clean spacing
- Premium typography
- Subtle gradients
- Large product photography
- Strong CTA buttons
- Smooth hover transitions
- Skeleton loaders
- Empty states
- Toast notifications

Do NOT overuse glassmorphism.

This is a retail store, so the interface should prioritize:

**clarity + usability + trust + speed**

over excessive visual effects.

---

# 30. Accessibility

Follow accessible UI practices.

Include:

- Proper labels
- Keyboard navigation
- Focus states
- Accessible contrast
- ARIA labels where necessary
- Alt text for images
- Semantic HTML
- Accessible buttons

---

# 31. Supabase Database Architecture

Create proper PostgreSQL tables and relationships.

Minimum tables:

```text
profiles
categories
products
orders
order_items
```

Optional:

```text
addresses
product_images
inventory_transactions
store_settings
```

Use UUID primary keys where appropriate.

Example:

```sql
id uuid primary key default gen_random_uuid()
```

Use timestamps:

```sql
created_at timestamptz default now()
updated_at timestamptz default now()
```

Implement appropriate foreign keys.

---

# 32. Row Level Security

RLS is mandatory.

### Profiles

Customer:

- Read own profile
- Update own profile

Admin:

- Read customer profiles
- Manage where appropriate

### Products

Customers:

- Read active products/categories

Admins:

- Full CRUD

### Orders

Customer:

- Create own orders
- Read own orders
- Do not read other customers' orders

Admin:

- Read all orders
- Update all orders

### Order Items

Customer:

- Read their own order items

Admin:

- Full access

Never rely only on frontend authorization.

---

# 33. Security

Never expose Supabase service-role credentials in client-side code.

Use:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The service-role key must only be accessible server-side.

Use server actions/API routes for privileged operations.

Validate all incoming data server-side.

Never trust:

- Client-submitted prices
- Client-submitted roles
- Client-submitted user IDs
- Client-submitted order totals

Calculate authoritative order totals server-side.

---

# 34. Order Creation Security

When customer places an order:

1. Authenticate the user.
2. Validate product IDs.
3. Fetch current products from Supabase.
4. Verify each product is active/available.
5. Resolve current product data.
6. Validate quantity.
7. Calculate available prices.
8. Create order.
9. Create order items.
10. Return generated order number.

Never trust the frontend's calculated total.

---

# 35. Admin Authorization

Create a reusable authorization utility.

For example:

```ts
requireAdmin();
```

Use it for:

- Admin pages
- Product mutations
- Category mutations
- Customer management
- Order management
- PDF generation if needed

Unauthorized users must receive:

```text
403 Forbidden
```

or be redirected to the customer area/login.

---

# 36. Route Architecture

Recommended route structure:

```text
/app
  /(store)
    page.tsx
    shop/
    categories/
    products/[slug]/

  /auth
    /login
    /register
    /forgot-password
    /reset-password

  /account
    page.tsx
    /orders
    /orders/[id]
    /shopping-list
    /profile

  /admin
    page.tsx
    /products
    /categories
    /inventory
    /customers
    /orders
    /orders/[id]
    /settings
```

Use route groups to keep the architecture clean.

---

# 37. Reusable Components

Create reusable components such as:

```text
Navbar
Footer
ProductCard
ProductGrid
CategoryCard
SearchBar
ShoppingListDrawer
ShoppingListItem
QuantitySelector
PriceDisplay
OrderStatusBadge
OrderTimeline
AdminSidebar
AdminHeader
DataTable
StatsCard
Modal
ConfirmDialog
Toast
EmptyState
LoadingSkeleton
```

---

# 38. State Management

Do not introduce heavy state management unnecessarily.

Use:

- React state
- URL search params
- Server state
- Server actions
- Context only where useful

Shopping list can use a lightweight state provider.

Ensure the shopping list persists during the session.

For authenticated users, consider persisting it in Supabase if the architecture supports it.

---

# 39. Store Settings

Create a settings area so the admin can configure:

```text
Store Name
Store Phone
Store Email
Store Address
City
State
Pincode
Opening Hours
Delivery Information
Footer Text
```

The store name should default to:

**Bajaj karyana Store**

but should not be hard-coded everywhere.

---

# 40. Admin Settings

Include:

```text
Store Information
Order Settings
Inventory Settings
Delivery Settings
```

Possible configuration:

```text
Low Stock Threshold
Default Delivery Charge
Order Prefix
```

For example:

```text
Order Prefix = BKS
```

---

# 41. Images

Use Supabase Storage for:

- Product images
- Category images
- Store logo

Create appropriate storage buckets.

Optimize images before displaying them.

Use Next.js image optimization.

---

# 42. Empty States

Create polished empty states for:

### No Products

```text
No products available right now.
```

### Empty Shopping List

```text
Your shopping list is empty.
Start adding items from our store.
```

### No Orders

```text
You haven't placed any orders yet.
```

### No Admin Orders

```text
No orders match your filters.
```

---

# 43. Loading States

Every asynchronous action must have appropriate loading indicators.

Examples:

```text
Adding...
Placing Order...
Updating...
Saving...
Generating PDF...
```

Prevent duplicate submissions.

---

# 44. Error Handling

Implement proper error handling.

Examples:

```text
Unable to load products.
Please try again.

Unable to place order.
Please check your information.

Product is no longer available.

Your session has expired.
Please log in again.
```

Never expose database errors directly to customers.

---

# 45. Notifications

Use toast notifications for actions:

```text
Product added to shopping list
Product removed
Order placed successfully
Order updated
Product saved
Product deleted
Status updated
```

---

# 46. Customer Order Confirmation

After placing an order, show a success page:

```text
Order Placed Successfully!

Thank you for shopping with Bajaj karyana Store.

Order Number:
BKS-2026-000123

Our team will review your order and confirm the final price.

[View Order]
[Continue Shopping]
```

---

# 47. No Payment Gateway

Do NOT integrate:

- Razorpay
- Stripe
- PayPal
- Cashfree
- PhonePe
- UPI payment APIs

for the initial version.

The order flow ends after order submission.

Payment can be added in a future version.

Design the database in a way that permits payment integration later.

---

# 48. Future-Ready Architecture

Even though payment is not implemented, structure the system so future features can easily be added:

```text
Payment Gateway
Coupons
Loyalty Points
Delivery Tracking
WhatsApp Notifications
SMS Notifications
Inventory Automation
Analytics
Offers
Subscriptions
```

Do not build these features now.

Only ensure the architecture doesn't prevent them later.

---

# 49. Performance Requirements

Optimize for:

- Fast initial page load
- Server rendering where useful
- Lazy loading
- Image optimization
- Minimal client JavaScript
- Pagination for admin tables
- Debounced search
- Efficient Supabase queries

Do not load the entire product catalog unnecessarily.

---

# 50. SEO

Implement SEO for public pages.

Include:

- Metadata
- Open Graph tags
- Twitter/X metadata
- Product metadata
- Category metadata
- Sitemap
- Robots.txt

Product pages should have SEO-friendly URLs:

```text
/products/parle-g-biscuits
/products/sugar
/products/cadbury-dairy-milk
```

---

# 51. PWA Consideration

Structure the app so it can later become a Progressive Web App.

Do not require PWA implementation unless straightforward.

---

# 52. Database Migrations

Provide complete Supabase SQL migration scripts.

Include:

- Tables
- Enums
- Foreign keys
- Indexes
- RLS policies
- Triggers
- Functions
- Updated_at handling

The project should be installable from a clean Supabase project.

---

# 53. Seed Data

Provide optional seed data for development.

Example categories:

```text
Biscuits
Chocolates
Namkeen
Toffees
Bakery
Drinks
Dry Fruits
Grocery
Snacks
```

Example products:

```text
Parle-G Biscuits
₹10 / packet

Cadbury Dairy Milk
₹40 / piece

Lays Classic
₹20 / packet

Sugar
₹55 / kg

Refined Oil
₹145 / litre

Mixed Dry Fruits
Price on Request
```

These are sample/demo products only.

---

# 54. Admin Demo Account

For development, provide a documented method for creating an admin user securely.

Do not hard-code a production admin password.

Provide setup instructions explaining how to:

1. Create a Supabase Auth user.
2. Set the corresponding profile role to `admin`.
3. Login to `/admin`.

---

# 55. Environment Configuration

Provide:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Include:

```text
.env.local.example
```

Never commit real secrets.

---

# 56. Folder Structure

Use a clean scalable folder structure such as:

```text
src/
├── app/
├── components/
├── lib/
│   ├── supabase/
│   ├── auth/
│   ├── validations/
│   └── utils/
├── hooks/
├── types/
├── actions/
├── services/
└── styles/
```

Separate:

- UI
- Database logic
- Authentication
- Validation
- Server actions
- Business logic

Do not put everything in page components.

---

# 57. Validation

Use a schema validation library such as Zod.

Validate:

- Registration
- Login
- Product creation
- Product editing
- Category creation
- Checkout
- Order creation
- Profile editing
- Admin settings

Show clear validation messages.

---

# 58. Type Safety

Use TypeScript throughout.

Generate or define strongly typed Supabase database types.

Avoid:

```ts
any;
```

unless absolutely necessary.

---

# 59. Customer Dashboard

Customer dashboard should provide an overview:

```text
Welcome, [Customer Name]

Active Orders
Recent Orders
Shopping List Count
```

Quick actions:

```text
Shop Now
View Orders
My Shopping List
Profile
```

---

# 60. Admin Dashboard Design

Admin interface should have:

### Desktop

Fixed left sidebar.

### Mobile

Collapsible sidebar/drawer.

Sidebar:

```text
Dashboard
Orders
Products
Categories
Inventory
Customers
Settings
Logout
```

Use:

- Active navigation indicator
- Icons
- Badge counts
- Responsive behavior

---

# 61. Data Tables

Admin tables must be production-friendly.

Support:

- Pagination
- Search
- Filtering
- Sorting
- Row actions
- Responsive mobile presentation

Orders table:

```text
Order #
Customer
Phone
Total
Status
Payment
Date
Actions
```

---

# 62. Order PDF Details

Admin PDF must not depend on the browser UI styling.

Generate a deterministic document.

Use store information from settings.

Include order:

- number
- date
- customer information
- items
- quantities
- weights
- unit price
- line total
- subtotal
- delivery charge
- discount
- final total
- notes
- payment status
- order status

Provide:

```text
Download PDF
Print
```

---

# 63. Business Logic Rules

Implement these rules carefully:

### Rule 1

Inactive products cannot be added to new orders.

### Rule 2

Out-of-stock products cannot be ordered unless admin explicitly permits ordering.

### Rule 3

Customers cannot alter prices.

### Rule 4

Customers can order products without listed prices.

### Rule 5

Admin can confirm/change item prices before final delivery.

### Rule 6

Historical order details must remain unchanged even when product information changes later.

### Rule 7

Customers can see only their own orders.

### Rule 8

Only admins can manage products, categories, inventory, and all orders.

### Rule 9

The server must calculate authoritative totals.

### Rule 10

Order creation must be transactional where practical.

---

# 64. UX for Price-on-Request Products

For products without a price:

Product card:

```text
Mixed Dry Fruits

Price on Request

[Add to List]
```

Shopping list:

```text
Mixed Dry Fruits
Quantity: 500 g
Price: To be confirmed
```

Order:

```text
Estimated Total: Partially calculated

Some item prices will be confirmed by the store.
```

This should feel intentional rather than like a missing value.

---

# 65. Delivery Model

This version does not need automated delivery management.

Admin simply receives the order and manually decides when/how to deliver it.

The admin can update:

```text
Preparing
Ready
Out for Delivery
Delivered
```

Do not build:

- driver management
- route optimization
- GPS tracking

yet.

---

# 66. Mobile Customer Ordering Flow

Optimize this exact flow:

```text
Login
 ↓
Home
 ↓
Shop
 ↓
Search Product
 ↓
Open Product
 ↓
Choose Quantity/Weight
 ↓
Add to Shopping List
 ↓
Review List
 ↓
Enter Delivery Details
 ↓
Place Order
 ↓
Order Confirmation
```

This flow must require minimal taps.

---

# 67. Visual Style

The visual identity should communicate:

**Premium local confectionery + trusted neighborhood store + modern digital ordering**

Use:

- Bordeaux headers
- Pink accent gradients
- White/soft blush backgrounds
- Rounded product cards
- Elegant typography
- High-quality imagery
- Subtle shadows
- Clean iconography

Suggested gradient:

```css
linear-gradient(
  135deg,
  #590d22 0%,
  #800f2f 45%,
  #c9184a 100%
)
```

Accent gradient:

```css
linear-gradient(
  135deg,
  #ff4d6d 0%,
  #ff758f 50%,
  #ffb3c1 100%
)
```

Use gradients selectively.

---

# 68. Design Tokens

Define colors centrally in Tailwind/theme variables rather than scattering hex values throughout the codebase.

Example:

```css
:root {
  --night-bordeaux: #590d22;
  --dark-amaranth: #800f2f;
  --cherry-rose: #a4133c;
  --rosewood: #c9184a;
  --bubblegum-pink: #ff4d6d;
  --bubblegum-pink-2: #ff758f;
  --cotton-candy: #ff8fa3;
  --cherry-blossom: #ffb3c1;
  --pastel-pink: #ffccd5;
  --lavender-blush: #fff0f3;
}
```

---

# 69. Final Deliverables

Generate a complete working project containing:

1. Next.js application
2. TypeScript
3. Tailwind CSS
4. Supabase integration
5. Authentication
6. Customer panel
7. Admin panel
8. Product management
9. Category management
10. Inventory
11. Shopping list
12. Order placement
13. Order status management
14. Customer management
15. Price-on-request support
16. Order PDF generation
17. Responsive UI
18. RLS policies
19. Database migrations
20. Seed/demo data
21. Environment example
22. README setup instructions

---

# 70. Development Quality Requirements

Write production-quality code.

Avoid:

- giant components
- duplicated logic
- insecure client-only authorization
- hard-coded store information
- hard-coded prices
- fake authentication
- fake database calls
- mock API endpoints once Supabase is configured

Use real Supabase CRUD and authentication.

Make all important forms fully functional.

Ensure all buttons work.

Do not create visual placeholders for functionality that should actually work.

---

# 71. Development Order

Build in this order:

### Phase 1

Project setup and theme

### Phase 2

Supabase schema and RLS

### Phase 3

Authentication and profiles

### Phase 4

Public storefront

### Phase 5

Products and categories

### Phase 6

Shopping list

### Phase 7

Checkout and order creation

### Phase 8

Customer dashboard

### Phase 9

Admin dashboard

### Phase 10

Admin product/category/inventory management

### Phase 11

Admin order management

### Phase 12

Order PDF

### Phase 13

Responsive optimization

### Phase 14

Security and validation review

### Phase 15

Final testing and cleanup

---

# 72. Testing Requirements

Test at minimum:

### Authentication

- Register
- Login
- Logout
- Password reset
- Unauthorized access

### Products

- Create
- Update
- Delete/deactivate
- Price optional
- Unit support

### Shopping List

- Add
- Remove
- Update quantity
- Weight support
- Notes

### Orders

- Create
- View
- Status changes
- Price confirmation
- Historical snapshots

### Admin

- Product management
- Customer management
- Order management
- PDF generation

### Security

- Customer cannot read another customer's order
- Customer cannot access admin
- Customer cannot alter prices
- Non-admin cannot mutate products

---

# 73. Final UX Goal

The finished application should feel like a real modern local store website rather than a generic admin CRUD template.

The customer experience should be:

**simple, fast, friendly and mobile-first.**

The admin experience should be:

**efficient, structured and focused on processing orders quickly.**

The core business flow is:

```text
Customer browses store
        ↓
Customer creates shopping list
        ↓
Customer submits order
        ↓
Bajaj karyana Store receives order
        ↓
Admin reviews items
        ↓
Admin confirms prices
        ↓
Admin prepares order
        ↓
Admin prints order/PDF
        ↓
Admin delivers manually
        ↓
Admin marks order as delivered
```

Build the application around this workflow.

---

# IMPORTANT IMPLEMENTATION INSTRUCTIONS

Do not build only a landing page.

Build the actual functional application architecture.

Do not implement online payment.

Do not require payment during checkout.

Use Supabase as the real backend.

Implement authentication and RLS correctly.

Make the application ready for actual store usage.

When a feature is ambiguous, prefer the simplest maintainable implementation that satisfies the store's workflow without introducing unnecessary complexity.

At the end, provide:

1. Complete source code
2. Supabase SQL schema/migrations
3. Environment variables required
4. Setup instructions
5. Admin setup instructions
6. Local development instructions
7. Vercel deployment instructions
8. Supabase configuration instructions
9. Explanation of the main database relationships
10. Explanation of how order PDF generation works
