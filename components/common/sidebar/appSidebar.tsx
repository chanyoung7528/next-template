'use client';

import { LayoutDashboard, ShoppingBag } from 'lucide-react';

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

import { NavMain } from './navMain';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },

  navMain: [
    {
      title: '대시보드',
      url: '/dashboard',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: '상품관리',
      url: '/products',
      icon: ShoppingBag,
      isActive: true,
      items: [
        {
          title: '상품 목록',
          url: '/products/list',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-x-6 group-data-[collapsible=icon]:hidden">
          <div className="bg-primary-500 h-14 w-14 rounded-md" />
          <div className="text-2xl font-bold text-gray-900">Dabang</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
