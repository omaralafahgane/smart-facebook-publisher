import React from 'react'

interface CardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  footer?: React.ReactNode
}

const Card: React.FC<CardProps> = ({ title, subtitle, children, className = '', footer }) => {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b">
          {title && <h2 className="text-lg font-bold text-gray-900">{title}</h2>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="px-6 py-4">{children}</div>

      {footer && <div className="px-6 py-4 border-t bg-gray-50">{footer}</div>}
    </div>
  )
}

export default Card
