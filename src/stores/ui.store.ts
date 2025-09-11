// UI Store following Single Responsibility Principle
import { create } from 'zustand'

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system'
  
  // Navigation
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  
  // Modals
  modals: {
    login: boolean
    register: boolean
    createStory: boolean
    contribute: boolean
  }
  
  // Loading states
  globalLoading: boolean
  
  // Toast notifications
  toasts: Toast[]
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
}

interface UIActions {
  // Theme actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // Navigation actions
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void
  
  // Modal actions
  openModal: (modal: keyof UIState['modals']) => void
  closeModal: (modal: keyof UIState['modals']) => void
  closeAllModals: () => void
  
  // Loading actions
  setGlobalLoading: (loading: boolean) => void
  
  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useUIStore = create<UIState & UIActions>((set, get) => ({
  // Initial state
  theme: 'system',
  sidebarOpen: false,
  mobileMenuOpen: false,
  modals: {
    login: false,
    register: false,
    createStory: false,
    contribute: false,
  },
  globalLoading: false,
  toasts: [],

  // Theme actions
  setTheme: (theme) => set({ theme }),

  // Navigation actions
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  // Modal actions
  openModal: (modal) =>
    set((state) => ({
      modals: { ...state.modals, [modal]: true },
    })),
  closeModal: (modal) =>
    set((state) => ({
      modals: { ...state.modals, [modal]: false },
    })),
  closeAllModals: () =>
    set({
      modals: {
        login: false,
        register: false,
        createStory: false,
        contribute: false,
      },
    }),

  // Loading actions
  setGlobalLoading: (globalLoading) => set({ globalLoading }),

  // Toast actions
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    }
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }))

    // Auto remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id)
      }, newToast.duration)
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}))

// Custom hooks for easier usage
export const useTheme = () => {
  const theme = useUIStore((state) => state.theme)
  const setTheme = useUIStore((state) => state.setTheme)
  return { theme, setTheme }
}

export const useSidebar = () => {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  return { sidebarOpen, setSidebarOpen, toggleSidebar }
}

export const useMobileMenu = () => {
  const mobileMenuOpen = useUIStore((state) => state.mobileMenuOpen)
  const setMobileMenuOpen = useUIStore((state) => state.setMobileMenuOpen)
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu)
  return { mobileMenuOpen, setMobileMenuOpen, toggleMobileMenu }
}

export const useModals = () => {
  const modals = useUIStore((state) => state.modals)
  const openModal = useUIStore((state) => state.openModal)
  const closeModal = useUIStore((state) => state.closeModal)
  const closeAllModals = useUIStore((state) => state.closeAllModals)
  return { modals, openModal, closeModal, closeAllModals }
}

export const useToast = () => {
  const toasts = useUIStore((state) => state.toasts)
  const addToast = useUIStore((state) => state.addToast)
  const removeToast = useUIStore((state) => state.removeToast)
  const clearToasts = useUIStore((state) => state.clearToasts)
  return { toasts, addToast, removeToast, clearToasts }
}