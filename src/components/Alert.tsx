import React from 'react'

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  onClose?: () => void
}

const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: '✅',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: '❌',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: '⚠️',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'ℹ️',
    },
  }

  const style = typeStyles[type]

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 mb-4`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-xl">{style.icon}</span>
          <div>
            {title && <h3 className={`${style.text} font-semibold`}>{title}</h3>}
            <p className={`${style.text} text-sm`}>{message}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.text} hover:opacity-75 transition`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert
