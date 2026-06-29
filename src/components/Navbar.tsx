'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLink {
  href: string
  label: string
}

interface NavbarProps {
  title: string
  links?: NavLink[]
  actions?: React.ReactNode
}

const Navbar: React.FC<NavbarProps> = ({ title, links = [], actions }) => {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {links.length > 0 && (
            <div className="flex gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition ${
                    pathname === link.href
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        {actions && <div className="flex items-center gap-4">{actions}</div>}
      </div>
    </nav>
  )
}

export default Navbar
