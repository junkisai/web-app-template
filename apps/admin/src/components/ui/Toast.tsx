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
import { css } from 'styled-system/css'
import { match } from 'ts-pattern'

const iconStyle = css({ w: '3.5', h: '3.5' })

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
      {mounted && portalRef.current &&
        createPortal(
          <div
            className={css({
              position: 'fixed',
              top: '4',
              right: '4',
              zIndex: 'toast',
              display: 'flex',
              flexDirection: 'column',
              gap: '2',
            })}
          >
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3',
                  px: '4',
                  py: '2',
                  borderRadius: 'sm',
                  bg:
                    toast.type === 'success'
                      ? 'green.600'
                      : toast.type === 'error'
                        ? 'red.600'
                        : 'stone.700',
                  color: 'white',
                  fontSize: 'xs',
                  boxShadow: 'md',
                  animation: 'slide-in-right 0.3s ease-out',
                })}
              >
                {match(toast.type)
                  .with('error', () => <CircleAlert className={iconStyle} />)
                  .with('success', () => <CircleCheck className={iconStyle} />)
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
