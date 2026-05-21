import type { ReactNode } from 'react'
import { toast, ToastContainer, type ToastOptions, type ToastPosition } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export type ToastVariant = 'success' | 'error' | 'warning' | 'infos'

type ToastProviderProps = {
  children: ReactNode
  position?: ToastPosition
}

type ShowToastOptions = ToastOptions & {
  position?: ToastPosition
}

const toastHandlers: Record<ToastVariant, (message: string, options?: ToastOptions) => void> = {
  success: toast.success,
  error: toast.error,
  warning: toast.warning,
  infos: toast.info,
}

export function useToast() {
  const show = (type: ToastVariant, message: string, options?: ShowToastOptions) => {
    toastHandlers[type](message, options)
  }

  return {
    success: (message: string, options?: ShowToastOptions) => show('success', message, options),
    error: (message: string, options?: ShowToastOptions) => show('error', message, options),
    warning: (message: string, options?: ShowToastOptions) => show('warning', message, options),
    infos: (message: string, options?: ShowToastOptions) => show('infos', message, options),
  }
}

function Toast({ children, position = 'top-center' }: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer
        position={position}
        newestOnTop
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  )
}

export default Toast