import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  charLimit?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, charLimit, value = '', className = '', ...props }, ref) => {
    const charCount = typeof value === 'string' ? value.length : 0
    const isNearLimit = charLimit && charCount > charLimit * 0.8

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          value={value}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        <div className="flex justify-between items-center mt-1">
          <div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {helperText && !error && <p className="text-gray-500 text-sm">{helperText}</p>}
          </div>
          {charLimit && (
            <p
              className={`text-sm ${
                isNearLimit ? 'text-yellow-600 font-semibold' : 'text-gray-500'
              }`}
            >
              {charCount} / {charLimit}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
