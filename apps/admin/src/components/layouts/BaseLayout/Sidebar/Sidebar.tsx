import type { FC } from 'react'
import { css } from 'styled-system/css'
import { NavItem, type Props as NavItemProps } from './NavItem'

const NAV_ITEMS: NavItemProps[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Orders', href: '/orders' },
  { label: 'Products', href: '/products' },
  { label: 'Customers', href: '/customers' },
  { label: 'Settings', href: '/settings' },
]

const wrapperStyle = css({
  pt: '5',
  pl: '5',
})

const contentStyle = css({
  position: 'sticky',
  top: '20px',
  w: '16rem',
  minH: '95vh',
  maxH: '95vh',
  bg: 'stone.50',
  border: '1px solid',
  borderColor: 'stone.100',
  borderRadius: 'xl',
  boxShadow: 'md',
})

const titleStyle = css({
  px: '4',
  py: '3',
  fontSize: 'lg',
  fontWeight: 'medium',
})

const dividerStyle = css({
  w: 'full',
  h: '0.1px',
  border: '0.2px dashed',
  borderColor: 'stone.300',
})

const navStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1',
  p: '2',
})

export const Sidebar: FC = () => {
  return (
    <div className={wrapperStyle}>
      <div className={contentStyle}>
        <div className={titleStyle}>Sapporo EATS - admin</div>
        <div className={dividerStyle} />
        <div className={navStyle}>
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} label={item.label} href={item.href} />
          ))}
        </div>
      </div>
    </div>
  )
}
