'use client'

import { CircleAlert, CircleCheck } from 'lucide-react'
import type React from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { match } from 'ts-pattern'

type ToastType = 'info' | 'success' | 'error'

type Toast = {
  id: string
  type: ToastType
  message: string
}

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

const toastBgColors: Record<ToastType, string> = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-stone-700',
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [mounted, setMounted] = useState(false)
  const portalRef = useRef<HTMLElement | null>(null)

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, type, message }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  useEffect(() => {
    setMounted(true)
    portalRef.current = document.body
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {mounted &&
        portalRef.current &&
        createPortal(
          <div className="fixed top-4 right-4 z-[var(--z-toast)] flex flex-col gap-2">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`flex items-center gap-3 px-4 py-2 rounded-sm text-white text-xs shadow-md animate-[slide-in-right_0.3s_ease-out] ${toastBgColors[toast.type]}`}
              >
                {match(toast.type)
                  .with('error', () => <CircleAlert className="w-3.5 h-3.5" />)
                  .with('success', () => (
                    <CircleCheck className="w-3.5 h-3.5" />
                  ))
                  .with('info', () => null)
                  .exhaustive()}
                {toast.message}
              </div>
            ))}
          </div>,
          portalRef.current,
        )}
    </ToastContext.Provider>
  )
}
