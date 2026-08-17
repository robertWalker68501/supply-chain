# SupplyChain

SupplyChain is a web app for managing purchasing, inventory, and warehouse operations in one place. Sign in to the dashboard to track vendor orders, receive goods, and keep stock organized across warehouse locations.

The product is built with Next.js, Prisma, and PostgreSQL. Authentication uses email and password, with email verification required before you can sign in.

## Getting started

1. Install dependencies with `npm install`.
2. Copy your environment variables (including `DATABASE_URL`) into `.env`.
3. Apply database migrations with Prisma.
4. Start the app with `npm run dev` and open [http://localhost:3000](http://localhost:3000).

Signed-in users are sent to `/dashboard`. Signed-out users see the public home page with **Sign In** and **Get Started**.

## Using the application

Use this section as the user guide for each feature that is available in the app today. The same guide is also in the app: open **Help** in the sidebar (`/dashboard/help`).

### Sign up

1. From the home page, click **Get Started**, or go to `/sign-up`.
2. Enter your full name, email, password, and password confirmation.
   - Name must be 3–30 characters.
   - Password must be 8–30 characters.
3. Click **Sign Up**.
4. Check your email and open the verification link. You cannot sign in until the address is verified.

If you already have an account, use the **Sign In** link on the form.

### Sign in

1. From the home page, click **Sign In**, or go to `/sign-in`.
2. Enter the email and password for a verified account.
3. Click **Sign In**. You are redirected to the dashboard.

If you do not have an account, use the **Sign Up** link on the form. If you are already signed in, visiting the home or auth pages sends you to the dashboard.

### Sign out

1. Open the dashboard.
2. In the sidebar footer, click your avatar.
3. Click **Log out**. You are returned to the home page.

### Switch theme

Use the theme toggle in the public navbar or the dashboard sidebar footer to switch between light and dark mode.

### Dashboard

After signing in, open **Dashboard** in the sidebar (`/dashboard`). This is the signed-in home for purchasing and inventory work. The page shows:

- Counts of vendors, warehouses, products, and purchase orders
- Open purchase orders, their total value, orders expected in the next 7 days, and overdue shipments
- A breakdown of purchase orders by status
- Quick actions to create a vendor, warehouse, product, or purchase order
- The five most recently created purchase orders

If a vendor, warehouse, or product is missing, an alert links to the create pages. If any ordered shipments are past their expected date, an overdue alert links to the purchase orders list.

Use **View** on a summary card, or **View all** above recent orders, to open the related page. Additional pages are grouped in the sidebar.

### Help

1. In the sidebar, open **Help**, or go to `/dashboard/help`.
2. Use the topic list to jump to a feature, or scroll the guide.
3. Follow the same steps documented here for signing in, managing the catalog, and creating purchase orders.

You must be signed in to view Help.

### View vendors

Vendors are the suppliers you buy from. You need at least one vendor before you can create a purchase order.

1. In the sidebar, open **Vendors**, or go to `/dashboard/vendors`.
2. Review the table of existing vendors. Each row shows name, email, phone, created date, and an **Edit** button.

If there are no vendors yet, use **Create vendor** from the empty state or the page header.

You must be signed in to view vendors.

### Create a vendor

1. In the sidebar, open **Create Vendor**, or click **Create vendor** on the vendors page (`/dashboard/vendors/create`).
2. Fill in the form:
   - **Name** (required).
   - **Slug** (optional). Leave it blank to generate a slug from the name.
   - **Email** and **Phone** (optional).
   - **Notes** (optional).
3. Click **Create vendor**. On success you are taken back to the vendors list.

Use **Reset** to clear the form, or **Cancel** to return to the list without saving.

You must be signed in to create a vendor.

### Edit a vendor

1. Open **Vendors** in the sidebar (`/dashboard/vendors`).
2. Click **Edit** on the vendor you want to change.
3. Update the same fields used when creating a vendor.
4. Click **Save changes**. On success you are taken back to the vendors list.

Use **Reset** to restore the saved values, or **Cancel** to return to the list without saving.

To remove the vendor, click **Delete vendor** and confirm. A vendor cannot be deleted if it is used on a purchase order.

You must be signed in to edit or delete a vendor.

### View warehouses

Warehouses are the destinations for incoming purchase orders. You need at least one warehouse before you can create a purchase order.

1. In the sidebar, open **Warehouses**, or go to `/dashboard/warehouse`.
2. Review the table of existing warehouses. Each row shows name, number of locations, created date, and an **Edit** button.

If there are no warehouses yet, use **Create warehouse** from the empty state or the page header.

You must be signed in to view warehouses.

### Create a warehouse

1. In the sidebar, open **Create Warehouse**, or click **Create warehouse** on the warehouses page (`/dashboard/warehouse/create`).
2. Enter a **Name** (required).
3. Click **Create warehouse**. On success you are taken back to the warehouses list.

Use **Reset** to clear the form, or **Cancel** to return to the list without saving.

You must be signed in to create a warehouse.

### Edit a warehouse

1. Open **Warehouses** in the sidebar (`/dashboard/warehouse`).
2. Click **Edit** on the warehouse you want to change.
3. Update the **Name**.
4. Click **Save changes**. On success you are taken back to the warehouses list.

Use **Reset** to restore the saved name, or **Cancel** to return to the list without saving.

To remove the warehouse, click **Delete warehouse** and confirm. A warehouse cannot be deleted if it is used on purchase orders or receipts.

You must be signed in to edit or delete a warehouse.

### View products

Products are catalog items you can add to purchase order lines. You need at least one product before you can create a purchase order.

1. In the sidebar, open **Products**, or go to `/dashboard/products`.
2. Review the table of existing products. Each row shows:
   - Product name
   - SKU
   - Unit of measure
   - Cost and price
   - Reorder point
   - Created date
   - An **Edit** button

If there are no products yet, use **Create product** from the empty state or the page header.

You must be signed in to view products.

### Create a product

1. In the sidebar, open **Create Product**, or click **Create product** on the products page (`/dashboard/products/create`).
2. Fill in the form:
   - **Name** (required).
   - **SKU** (required). Must be unique.
   - **Slug** (optional). Leave it blank to generate a slug from the name.
   - **Unit** (required). Defaults to `EA`.
   - **Cost** and **Price** (required). Cannot be negative.
   - **Reorder point** and **Lead time (days)** (required). Whole numbers, default to `0`.
   - **Description** (optional).
   - **Tags** (optional). Press Enter or comma to add a tag.
3. Click **Create product**. On success you are taken back to the products list.

Use **Reset** to clear the form, or **Cancel** to return to the list without saving.

You must be signed in to create a product.

### Edit a product

1. Open **Products** in the sidebar (`/dashboard/products`).
2. Click **Edit** on the product you want to change.
3. Update the same fields used when creating a product. SKU must stay unique.
4. Click **Save changes**. On success you are taken back to the products list.

Use **Reset** to restore the saved values, or **Cancel** to return to the list without saving.

To remove the product, click **Delete product** and confirm. A product cannot be deleted if it is used on purchase orders, receipts, or stock movements.

You must be signed in to edit or delete a product.

### View purchase orders

Purchase orders record what you buy from a vendor and which warehouse should receive the shipment.

1. In the sidebar, open **Purchase Orders**, or go to `/dashboard/purchase-orders`.
2. Review the table of existing orders. Each row shows:
   - Purchase order number
   - Vendor
   - Destination warehouse
   - Status (Draft, Ordered, Partially received, Received, or Cancelled)
   - Expected date
   - Number of line items
   - Order total
   - Created date and who created it

If there are no purchase orders yet, use **Create purchase order** from the empty state or the page header.

You must be signed in to view purchase orders.

### Create a purchase order

Before you can create an order, the catalog must include at least one vendor, one warehouse, and one product. If any of those are missing, the form shows an alert with links to create the missing items, and the submit button stays disabled.

1. In the sidebar, open **Create Purchase Order**, or click **Create purchase order** on the purchase orders page (`/dashboard/purchase-orders/create`).
2. Fill in **Order details**:
   - **Purchase order number** (optional). Leave it blank to auto-generate a number such as `PO-20260816-0001`.
   - **Status** (required). Use **Draft** while the order is being prepared, or **Ordered** when it has been sent to the vendor.
   - **Vendor** (required). Who you are buying from.
   - **Warehouse** (required). Where the shipment should be received.
   - **Ordered date** and **Expected date** (optional). The expected date must be on or after the ordered date.
   - **Notes** (optional). Receiving instructions, vendor terms, or other details.
3. Add **Line items**. At least one line is required.
   - Select a **Product**. The form fills unit cost from the product catalog and, if the description is empty, uses the product name.
   - Optionally edit the **Description**.
   - Enter **Quantity** (whole number, at least 1) and **Unit cost**.
   - Click **Add line** for additional products, or **Remove** to delete a line (one line must remain).
   - The running **Order total** updates as you edit quantities and costs.
4. Click **Create purchase order**. On success you are taken back to the purchase orders list.

Use **Reset** to clear the form, or **Cancel** to return to the list without saving.

You must be signed in to create a purchase order.
