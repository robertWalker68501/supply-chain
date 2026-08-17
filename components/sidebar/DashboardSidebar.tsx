import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import ThemeToggle from '../ui/theme-toggle';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import UserMenu from '../UserMenu';
import SiteLogo from '../SiteLogo';
import {
  Building2,
  CircleHelp,
  LayoutDashboard,
  Package,
  PackagePlus,
  Plus,
  Warehouse,
} from 'lucide-react';
import Link from 'next/link';
import { HiOutlineDocumentDuplicate } from 'react-icons/hi';
import { HiOutlineDocumentAdd } from 'react-icons/hi';

const DashboardSidebar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  return (
    <Sidebar>
      <SidebarHeader className='border-border border-b'>
        <SiteLogo href='/dashboard' />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className='mt-5'>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href='/dashboard' />}>
                  <LayoutDashboard />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href='/dashboard/help' />}>
                  <CircleHelp />
                  Help
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Vendors</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href='/dashboard/vendors' />}>
                  <Building2 />
                  Vendors
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href='/dashboard/vendors/create' />}
                >
                  <Plus />
                  Create Vendor
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Warehouses */}
        <SidebarGroup>
          <SidebarGroupLabel>Warehouese</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href='/dashboard/warehouse' />}
                >
                  <Warehouse />
                  Warehouses
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href='/dashboard/warehouse/create' />}
                >
                  <Plus />
                  Create Warehouse
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Products */}
        <SidebarGroup>
          <SidebarGroupLabel>Products</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href='/dashboard/products' />}>
                  <Package />
                  Products
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href='/dashboard/products/create' />}
                >
                  <PackagePlus />
                  Create Product
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Purchase Orders */}
        <SidebarGroup>
          <SidebarGroupLabel>Purchase Orders</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href='/dashboard/purchase-orders' />}
                >
                  <HiOutlineDocumentDuplicate />
                  Purchase Orders
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href='/dashboard/purchase-orders/create' />}
                >
                  <HiOutlineDocumentAdd />
                  Create Purchase Order
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='border-border border-t'>
        <div className='flex items-center justify-between'>
          <ThemeToggle />
          {user && <UserMenu user={user} />}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
