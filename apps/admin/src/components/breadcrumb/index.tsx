import { useBreadcrumb } from '@refinedev/core'
import { Link } from 'react-router-dom'

import * as styles from './breadcrumb.module.scss'

export const Breadcrumb = () => {
  const { breadcrumbs } = useBreadcrumb()

  return (
    <ul className={styles.breadcrumb}>
      {breadcrumbs.map((breadcrumb) => {
        return (
          <li key={`breadcrumb-${breadcrumb.label}`}>
            {breadcrumb.href ? (
              <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
            ) : (
              <span>{breadcrumb.label}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
