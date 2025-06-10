"use client"

import { X, AlertTriangle, CheckCircle, Info } from "lucide-react"

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}) => {
  if (!isOpen) return null

  const variantConfig = {
    danger: {
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonBg: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
      borderColor: "border-red-200",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      buttonBg: "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
      borderColor: "border-yellow-200",
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonBg: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      borderColor: "border-blue-200",
    },
    success: {
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      buttonBg: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      borderColor: "border-green-200",
    },
  }

  const config = variantConfig[variant]
  const IconComponent = config.icon

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="flex items-center justify-center min-h-screen p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        {/* Dialog */}
        <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all animate-in zoom-in-95 duration-200">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">
            {/* Icon and Title */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 ${config.iconBg} rounded-full flex items-center justify-center`}>
                <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <div className={`w-12 h-0.5 ${config.iconColor.replace("text-", "bg-")} mt-1 rounded-full`}></div>
              </div>
            </div>

            {/* Message */}
            <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                {cancelLabel}
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-3 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${config.buttonBg}`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog

