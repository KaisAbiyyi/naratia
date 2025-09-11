'use client'

import React, { Component, ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

export interface ErrorFallbackProps {
  error: Error | null
  resetError: () => void
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to external service
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call onError callback if provided
    this.props.onError?.(error, errorInfo)
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent 
          error={this.state.error} 
          resetError={this.resetError}
        />
      )
    }

    return this.props.children
  }
}

// Default error fallback component
function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const goHome = () => {
    window.location.href = '/'
  }

  const reloadPage = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <AlertTriangle className="h-16 w-16 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Oops! Something went wrong
          </h1>
          <p className="text-muted-foreground">
            We&apos;re sorry, but something unexpected happened. Please try again.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <div className="text-left bg-muted p-4 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Error Details:</h3>
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={resetError} variant="default" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button onClick={reloadPage} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </Button>
          <Button onClick={goHome} variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}

// Page-level error boundary
export function PageErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={DefaultErrorFallback}
      onError={(error, errorInfo) => {
        // Here you can send errors to your error reporting service
        console.error('Page Error:', error, errorInfo)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

// Component-level error boundary for smaller UI sections
export function ComponentErrorBoundary({ 
  children, 
  name 
}: { 
  children: React.ReactNode
  name?: string 
}) {
  const ComponentFallback = ({ error, resetError }: ErrorFallbackProps) => (
    <div className="border border-destructive/20 bg-destructive/5 rounded-lg p-4 text-center">
      <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
      <p className="text-sm font-medium text-destructive">
        {name ? `${name} failed to load` : 'Component failed to load'}
      </p>
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-2 text-xs text-left">
          <summary className="cursor-pointer">Error details</summary>
          <pre className="mt-1 whitespace-pre-wrap">{error.message}</pre>
        </details>
      )}
      <Button size="sm" variant="outline" onClick={resetError} className="mt-3">
        Retry
      </Button>
    </div>
  )

  return (
    <ErrorBoundary
      fallback={ComponentFallback}
      onError={(error, errorInfo) => {
        console.error(`Component Error (${name}):`, error, errorInfo)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary