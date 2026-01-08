import { Button } from '@/components/ui/Button'
import type { FC } from 'react'
import { NavItem, type Props as NavItemProps } from './NavItem'

const NAV_ITEMS: NavItemProps[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Orders', href: '/orders' },
  { label: 'Products', href: '/products' },
  { label: 'Customers', href: '/customers' },
  { label: 'Settings', href: '/settings' },
]

export const Sidebar: FC = () => {
  return (
    <div className="pt-5 pl-5">
      <div className="flex flex-col sticky top-5 w-64 min-h-[95vh] max-h-[95vh] bg-stone-50 border border-stone-100 rounded-xl shadow-md">
        <div className="px-4 py-3 text-lg font-medium">
          web-app-template - admin
        </div>
        <div className="w-full h-px border-t border-dashed border-stone-300" />
        <div className="flex-1 flex flex-col justify-between p-2">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.label} label={item.label} href={item.href} />
            ))}
          </div>
          <Button as="a" href="/auth/logout" size="sm" variant="solid">
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
