import Link from 'next/link';
import type { ReactNode } from 'react';

import { Separator } from '@/components/ui/separator';

const toc = [
  { id: 'sign-up', title: 'Sign up' },
  { id: 'sign-in', title: 'Sign in' },
  { id: 'sign-out', title: 'Sign out' },
  { id: 'switch-theme', title: 'Switch theme' },
  { id: 'dashboard', title: 'Dashboard' },
  { id: 'view-vendors', title: 'View vendors' },
  { id: 'create-a-vendor', title: 'Create a vendor' },
  { id: 'edit-a-vendor', title: 'Edit a vendor' },
  { id: 'view-warehouses', title: 'View warehouses' },
  { id: 'create-a-warehouse', title: 'Create a warehouse' },
  { id: 'edit-a-warehouse', title: 'Edit a warehouse' },
  { id: 'view-products', title: 'View products' },
  { id: 'create-a-product', title: 'Create a product' },
  { id: 'edit-a-product', title: 'Edit a product' },
  { id: 'view-purchase-orders', title: 'View purchase orders' },
  { id: 'create-a-purchase-order', title: 'Create a purchase order' },
] as const;

function HelpSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className='grid scroll-mt-6 gap-3'
    >
      <h2 className='text-xl font-semibold'>{title}</h2>
      <div className='text-muted-foreground [&_a]:hover:text-foreground [&_code]:bg-muted [&_strong]:text-foreground grid gap-3 text-sm leading-relaxed [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded-md [&_code]:px-1 [&_code]:py-0.5'>
        {children}
      </div>
    </section>
  );
}

const HelpGuide = () => {
  return (
    <div className='grid w-full max-w-3xl gap-8'>
      <div className='grid gap-2'>
        <h1 className='text-3xl font-bold'>Help</h1>
        <p className='text-muted-foreground text-sm'>
          Use this guide for each feature that is available in the app today.
        </p>
      </div>

      <nav aria-label='Help topics'>
        <h2 className='mb-3 text-sm font-medium'>Topics</h2>
        <ul className='grid gap-1 text-sm'>
          {toc.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className='text-muted-foreground hover:text-foreground underline-offset-4 hover:underline'
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Separator />

      <HelpSection
        id='sign-up'
        title='Sign up'
      >
        <ol className='list-decimal space-y-2 pl-5'>
          <li>
            From the home page, click <strong>Get Started</strong>, or go to{' '}
            <Link href='/sign-up'>/sign-up</Link>.
          </li>
          <li>
            Enter your full name, email, password, and password confirmation.
            <ul className='mt-2 list-disc space-y-1 pl-5'>
              <li>Name must be 3–30 characters.</li>
              <li>Password must be 8–30 characters.</li>
            </ul>
          </li>
          <li>
            Click <strong>Sign Up</strong>.
          </li>
          <li>
            Check your email and open the verification link. You cannot sign in
            until the address is verified.
          </li>
        </ol>
        <p>
          If you already have an account, use the <strong>Sign In</strong> link
          on the form.
        </p>
      </HelpSection>

      <HelpSection
        id='sign-in'
        title='Sign in'
      >
        <ol className='list-decimal space-y-2 pl-5'>
          <li>
            From the home page, click <strong>Sign In</strong>, or go to{' '}
            <Link href='/sign-in'>/sign-in</Link>.
          </li>
          <li>Enter the email and password for a verified account.</li>
          <li>
            Click <strong>Sign In</strong>. You are redirected to the dashboard.
          </li>
        </ol>
        <p>
          If you do not have an account, use the <strong>Sign Up</strong> link
          on the form. If you are already signed in, visiting the home or auth
          pages sends you to the dashboard.
        </p>
      </HelpSection>

      <HelpSection
        id='sign-out'
        title='Sign out'
      >
        <ol className='list-decimal space-y-2 pl-5'>
          <li>Open the dashboard.</li>
          <li>In the sidebar footer, click your avatar.</li>
          <li>
            Click <strong>Log out</strong>. You are returned to the home page.
          </li>
        </ol>
      </HelpSection>

      <HelpSection
        id='switch-theme'
        title='Switch theme'
      >
        <p>
          Use the theme toggle in the public navbar or the dashboard sidebar
          footer to switch between light and dark mode.
        </p>
      </HelpSection>

      <HelpSection
        id='dashboard'
        title='Dashboard'
      >
        <p>
          After signing in, open <strong>Dashboard</strong> in the sidebar (
          <Link href='/dashboard'>/dashboard</Link>
          ). This is the signed-in home for purchasing and inventory work. The
          page shows:
        </p>
        <ul className='list-disc space-y-1 pl-5'>
          <li>Counts of vendors, warehouses, products, and purchase orders</li>
          <li>
            Open purchase orders, their total value, orders expected in the next
            7 days, and overdue shipments
          </li>
          <li>A breakdown of purchase orders by status</li>
          <li>
            Quick actions to create a vendor, warehouse, product, or purchase
            order
          </li>
          <li>The five most recently created purchase orders</li>
        </ul>
        <p>
          If a vendor, warehouse, or product is missing, an alert links to the
          create pages. If any ordered shipments are past their expected date,
          an overdue alert links to the purchase orders list.
        </p>
        <p>
          Use <strong>View</strong> on a summary card, or{' '}
          <strong>View all</strong> above recent orders, to open the related
          page. Additional pages are grouped in the sidebar.
        </p>
      </HelpSection>

      <HelpSection
        id='view-vendors'
        title='View vendors'
      >
        <p>
          Vendors are the suppliers you buy from. You need at least one vendor
          before you can create a purchase order.
        </p>
        <ol className='list-decimal space-y-2 pl-5'>
          <li>
            In the sidebar, open <strong>Vendors</strong>, or go to{' '}
            <Link href='/dashboard/vendors'>/dashboard/vendors</Link>.
          </li>
          <li>
            Review the table of existing vendors. Each row shows name, email,
            phone, created date, and an <strong>Edit</strong> button.
          </li>
        </ol>
        <p>
          If there are no vendors yet, use <strong>Create vendor</strong> from
          the empty state or the page header.
        </p>
        <p>You must be signed in to view vendors.</p>
      </HelpSection>

      <HelpSection
        id='create-a-vendor'
        title='Create a vendor'
      >
        <ol className='list-decimal space-y-2 pl-5'>
          <li>
            In the sidebar, open <strong>Create Vendor</strong>, or click{' '}
            <strong>Create vendor</strong> on the vendors page (
            <Link href='/dashboard/vendors/create'>
              /dashboard/vendors/create
            </Link>
            ).
          </li>
          <li>
            Fill in the form:
            <ul className='mt-2 list-disc space-y-1 pl-5'>
              <li>
                <strong>Name</strong> (required).
              </li>
              <li>
                <strong>Slug</strong> (optional). Leave it blank to generate a
                slug from the name.
              </li>
              <li>
                <strong>Email</strong> and <strong>Phone</strong> (optional).
              </li>
              <li>
                <strong>Notes</strong> (optional).
              </li>
            </ul>
          </li>
          <li>
            Click <strong>Create vendor</strong>. On success you are taken back
            to the vendors list.
          </li>
        </ol>
        <p>
          Use <strong>Reset</strong> to clear the form, or{' '}
          <strong>Cancel</strong> to return to the list without saving.
        </p>
        <p>You must be signed in to create a vendor.</p>
      </HelpSection>

      <HelpSection
        id='edit-a-vendor'
        title='Edit a vendor'
      >
        <ol className='list-decimal space-y-2 pl-5'>
          <li>
            Open <strong>Vendors</strong> in the sidebar (
            <Link href='/dashboard/vendors'>/dashboard/vendors</Link>
            ).
          </li>
          <li>
            Click <strong>Edit</strong> on the vendor you want to change.
          </li>
          <li>Update the same fields used when creating a vendor.</li>
          <li>
            Click <strong>Save changes</strong>. On success you are taken back
            to the vendors list.
          </li>
        </ol>
        <p>
          Use <strong>Reset</strong> to restore the saved values, or{' '}
          <strong>Cancel</strong> to return to the list without saving.
        </p>
        <p>
          To remove the vendor, click <strong>Delete vendor</strong> and
          confirm. A vendor cannot be deleted if it is used on a purchase order.
        </p>
        <p>You must be signed in to edit or delete a vendor.</p>
      </HelpSection>

      <HelpSection
        id='view-warehouses'
        title='View warehouses'
      >
        <p>
          Warehouses are the destinations for incoming purchase orders. You need
          at least one warehouse before you can create a purchase order.
        </p>
        <ol className='list-decimal space-y-2 pl-5'>
          <li>
            In the sidebar, open <strong>Warehouses</strong>, or go to{' '}
            <Link href='/dashboard/warehouse'>/dashboard/warehouse</Link>.
          </li>
          <li>
            Review the table of existing warehouses. Each row shows name, number
            of locations, created date, and an <strong>Edit</strong> button.
          </li>
        </ol>
        <p>
          If there are no warehouses yet, use <strong>Create warehouse</strong>{' '}
          from the empty state or the page header.
        </p>
        <p>You must be signed in to view warehouses.</p>
      </HelpSection>

      <HelpSection
        id='create-a-warehouse'
        title='Create a warehouse'
      >
        <ol className='list-decimal space-y-2 pl-5'>
          <li>
            In the sidebar, open <strong>Create Warehouse</strong>, or click{' '}
            <strong>Create warehouse</strong> on the warehouses page (
            <Link href='/dashboard/warehouse/create'>
              /dashboard/warehouse/create
            </Link>
            ).
          </li>
          <li>
            Enter a <strong>Name</strong> (required).
          </li>
          <li>
            Click <strong>Create warehouse</strong>. On success you are taken
            back to the warehouses list.
          </li>
        </ol>
        <p>
          Use <strong>Reset</strong> to clear the form, or{' '}
          <strong>Cancel</strong> to return to the list without saving.
        </p>
        <p>You must be signed in to create a warehouse.</p>
      </HelpSection>

      <HelpSection
        id='edit-a-warehouse'
        title='Edit a warehouse'
      >
        <ol className='list-decimal space-y-2 pl-5'>
          <li>
            Open <strong>Warehouses</strong> in the sidebar (
            <Link href='/dashboard/warehouse'>/dashboard/warehouse</Link>
            ).
          </li>
          <li>
            Click <strong>Edit</strong> on the warehouse you want to change.
          </li>
          <li>
            Update the <strong>Name</strong>.
          </li>
          <li>
            Click <strong>Save changes</strong>. On success you are taken back
            to the warehouses list.
          </li>
        </ol>
        <p>
          Use <strong>Reset</strong> to restore the saved name, or{' '}
          <strong>Cancel</strong> to return to the list without saving.
        </p>
        <p>
          To remove the warehouse, click <strong>Delete warehouse</strong> and
          confirm. A warehouse cannot be deleted if it is used on purchase
          orders or receipts.
        </p>
        <p>You must be signed in to edit or delete a warehouse.</p>
      </HelpSection>

      <HelpSection
        id='view-products'
        title='View products'
      >
        <p>
          Products are catalog items you can add to purchase order lines. You
          need at least one product before you can create a purchase order.
        </p>
        <ol className='list-decimal space-y-2 pl-5'>
          <li>
            In the sidebar, open <strong>Products</strong>, or go to{' '}
            <Link href='/dashboard/products'>/dashboard/products</Link>.
          </li>
          <li>
            Review the table of existing products. Each row shows:
            <ul className='mt-2 list-disc space-y-1 pl-5'>
              <li>Product name</li>
              <li>SKU</li>
              <li>Unit of measure</li>
              <li>Cost and price</li>
              <li>Reorder point</li>
              <li>Created date</li>
              <li>
                An <strong>Edit</strong> button
              </li>
            </ul>
          </li>
        </ol>
        <p>
          If there are no products yet, use <strong>Create product</strong> from
          the empty state or the page header.
        </p>
        <p>You must be signed in to view products.</p>
      </HelpSection>

      <HelpSection
        id='create-a-product'
        title='Create a product'
      >
        <ol className='list-decimal space-y-2 pl-5'>
          <li>
            In the sidebar, open <strong>Create Product</strong>, or click{' '}
            <strong>Create product</strong> on the products page (
            <Link href='/dashboard/products/create'>
              /dashboard/products/create
            </Link>
            ).
          </li>
          <li>
            Fill in the form:
            <ul className='mt-2 list-disc space-y-1 pl-5'>
              <li>
                <strong>Name</strong> (required).
              </li>
              <li>
                <strong>SKU</strong> (required). Must be unique.
              </li>
              <li>
                <strong>Slug</strong> (optional). Leave it blank to generate a
                slug from the name.
              </li>
              <li>
                <strong>Unit</strong> (required). Defaults to <code>EA</code>.
              </li>
              <li>
                <strong>Cost</strong> and <strong>Price</strong> (required).
                Cannot be negative.
              </li>
              <li>
                <strong>Reorder point</strong> and{' '}
                <strong>Lead time (days)</strong> (required). Whole numbers,
                default to <code>0</code>.
              </li>
              <li>
                <strong>Description</strong> (optional).
              </li>
              <li>
                <strong>Tags</strong> (optional). Press Enter or comma to add a
                tag.
              </li>
            </ul>
          </li>
          <li>
            Click <strong>Create product</strong>. On success you are taken back
            to the products list.
          </li>
        </ol>
        <p>
          Use <strong>Reset</strong> to clear the form, or{' '}
          <strong>Cancel</strong> to return to the list without saving.
        </p>
        <p>You must be signed in to create a product.</p>
      </HelpSection>

      <HelpSection
        id='edit-a-product'
        title='Edit a product'
      >
        <ol className='list-decimal space-y-2 pl-5'>
          <li>
            Open <strong>Products</strong> in the sidebar (
            <Link href='/dashboard/products'>/dashboard/products</Link>
            ).
          </li>
          <li>
            Click <strong>Edit</strong> on the product you want to change.
          </li>
          <li>
            Update the same fields used when creating a product. SKU must stay
            unique.
          </li>
          <li>
            Click <strong>Save changes</strong>. On success you are taken back
            to the products list.
          </li>
        </ol>
        <p>
          Use <strong>Reset</strong> to restore the saved values, or{' '}
          <strong>Cancel</strong> to return to the list without saving.
        </p>
        <p>
          To remove the product, click <strong>Delete product</strong> and
          confirm. A product cannot be deleted if it is used on purchase orders,
          receipts, or stock movements.
        </p>
        <p>You must be signed in to edit or delete a product.</p>
      </HelpSection>

      <HelpSection
        id='view-purchase-orders'
        title='View purchase orders'
      >
        <p>
          Purchase orders record what you buy from a vendor and which warehouse
          should receive the shipment.
        </p>
        <ol className='list-decimal space-y-2 pl-5'>
          <li>
            In the sidebar, open <strong>Purchase Orders</strong>, or go to{' '}
            <Link href='/dashboard/purchase-orders'>
              /dashboard/purchase-orders
            </Link>
            .
          </li>
          <li>
            Review the table of existing orders. Each row shows:
            <ul className='mt-2 list-disc space-y-1 pl-5'>
              <li>Purchase order number</li>
              <li>Vendor</li>
              <li>Destination warehouse</li>
              <li>
                Status (Draft, Ordered, Partially received, Received, or
                Cancelled)
              </li>
              <li>Expected date</li>
              <li>Number of line items</li>
              <li>Order total</li>
              <li>Created date and who created it</li>
            </ul>
          </li>
        </ol>
        <p>
          If there are no purchase orders yet, use{' '}
          <strong>Create purchase order</strong> from the empty state or the
          page header.
        </p>
        <p>You must be signed in to view purchase orders.</p>
      </HelpSection>

      <HelpSection
        id='create-a-purchase-order'
        title='Create a purchase order'
      >
        <p>
          Before you can create an order, the catalog must include at least one
          vendor, one warehouse, and one product. If any of those are missing,
          the form shows an alert with links to create the missing items, and
          the submit button stays disabled.
        </p>
        <ol className='list-decimal space-y-2 pl-5'>
          <li>
            In the sidebar, open <strong>Create Purchase Order</strong>, or
            click <strong>Create purchase order</strong> on the purchase orders
            page (
            <Link href='/dashboard/purchase-orders/create'>
              /dashboard/purchase-orders/create
            </Link>
            ).
          </li>
          <li>
            Fill in <strong>Order details</strong>:
            <ul className='mt-2 list-disc space-y-1 pl-5'>
              <li>
                <strong>Purchase order number</strong> (optional). Leave it
                blank to auto-generate a number such as{' '}
                <code>PO-20260816-0001</code>.
              </li>
              <li>
                <strong>Status</strong> (required). Use <strong>Draft</strong>{' '}
                while the order is being prepared, or <strong>Ordered</strong>{' '}
                when it has been sent to the vendor.
              </li>
              <li>
                <strong>Vendor</strong> (required). Who you are buying from.
              </li>
              <li>
                <strong>Warehouse</strong> (required). Where the shipment should
                be received.
              </li>
              <li>
                <strong>Ordered date</strong> and <strong>Expected date</strong>{' '}
                (optional). The expected date must be on or after the ordered
                date.
              </li>
              <li>
                <strong>Notes</strong> (optional). Receiving instructions,
                vendor terms, or other details.
              </li>
            </ul>
          </li>
          <li>
            Add <strong>Line items</strong>. At least one line is required.
            <ul className='mt-2 list-disc space-y-1 pl-5'>
              <li>
                Select a <strong>Product</strong>. The form fills unit cost from
                the product catalog and, if the description is empty, uses the
                product name.
              </li>
              <li>
                Optionally edit the <strong>Description</strong>.
              </li>
              <li>
                Enter <strong>Quantity</strong> (whole number, at least 1) and{' '}
                <strong>Unit cost</strong>.
              </li>
              <li>
                Click <strong>Add line</strong> for additional products, or{' '}
                <strong>Remove</strong> to delete a line (one line must remain).
              </li>
              <li>
                The running <strong>Order total</strong> updates as you edit
                quantities and costs.
              </li>
            </ul>
          </li>
          <li>
            Click <strong>Create purchase order</strong>. On success you are
            taken back to the purchase orders list.
          </li>
        </ol>
        <p>
          Use <strong>Reset</strong> to clear the form, or{' '}
          <strong>Cancel</strong> to return to the list without saving.
        </p>
        <p>You must be signed in to create a purchase order.</p>
      </HelpSection>
    </div>
  );
};

export default HelpGuide;
