'use client'

import React from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// Loading spinner component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  }

  return (
    <Loader2 
      className={cn(
        'animate-spin',
        sizeClasses[size],
        className
      )} 
    />
  )
}

// Full page loading
interface PageLoadingProps {
  message?: string
  className?: string
}

export function PageLoading({ message = 'Loading...', className }: PageLoadingProps) {
  return (
    <div className={cn(
      'min-h-screen flex flex-col items-center justify-center bg-background',
      className
    )}>
      <LoadingSpinner size="xl" className="text-primary" />
      <p className="mt-4 text-lg text-muted-foreground">{message}</p>
    </div>
  )
}

// Section loading
interface SectionLoadingProps {
  message?: string
  className?: string
  minHeight?: string
}

export function SectionLoading({ 
  message = 'Loading...', 
  className,
  minHeight = 'min-h-48'
}: SectionLoadingProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center',
      minHeight,
      className
    )}>
      <LoadingSpinner size="lg" className="text-primary" />
      <p className="mt-3 text-muted-foreground">{message}</p>
    </div>
  )
}

// Card loading skeleton
interface CardSkeletonProps {
  className?: string
  lines?: number
}

export function CardSkeleton({ className, lines = 3 }: CardSkeletonProps) {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="bg-muted rounded-lg h-4 mb-3"></div>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            'bg-muted rounded h-3 mb-2',
            i === lines - 1 && 'w-3/4' // Last line shorter
          )}
        />
      ))}
    </div>
  )
}

// Story card skeleton
export function StoryCardSkeleton() {
  return (
    <div className="bg-card border rounded-lg p-6 animate-pulse">
      <div className="bg-muted rounded h-6 mb-3"></div>
      <div className="bg-muted rounded h-4 mb-2"></div>
      <div className="bg-muted rounded h-4 mb-4 w-2/3"></div>
      <div className="flex flex-col gap-2">
        <div className="bg-muted rounded h-3"></div>
        <div className="bg-muted rounded h-3"></div>
        <div className="bg-muted rounded h-3 w-4/5"></div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="bg-muted rounded h-4 w-20"></div>
        <div className="bg-muted rounded h-4 w-16"></div>
      </div>
    </div>
  )
}

// List loading with skeletons
interface ListLoadingProps {
  count?: number
  SkeletonComponent?: React.ComponentType
  className?: string
}

export function ListLoading({ 
  count = 3, 
  SkeletonComponent = CardSkeleton,
  className 
}: ListLoadingProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  )
}

// Button loading state
interface LoadingButtonProps {
  loading?: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  [key: string]: unknown
}

export function LoadingButton({ 
  loading, 
  children, 
  className, 
  disabled,
  ...props 
}: LoadingButtonProps) {
  return (
    <button
      className={cn(
        'relative',
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <LoadingSpinner 
          size="sm" 
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" 
        />
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  )
}

// Empty state
interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center p-6',
      className
    )}>
      <div className="mb-4 text-muted-foreground">
        {icon || <AlertCircle className="h-12 w-12" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground mb-4 max-w-sm">
          {description}
        </p>
      )}
      {action && action}
    </div>
  )
}

// Loading wrapper for conditional rendering
interface LoadingWrapperProps {
  loading: boolean
  error?: string | null
  empty?: boolean
  emptyMessage?: string
  children: React.ReactNode
  loadingComponent?: React.ReactNode
  className?: string
}

export function LoadingWrapper({
  loading,
  error,
  empty,
  emptyMessage = 'No data available',
  children,
  loadingComponent,
  className
}: LoadingWrapperProps) {
  if (loading) {
    return (
      <div className={className}>
        {loadingComponent || <SectionLoading />}
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        <EmptyState
          title="Error occurred"
          description={error}
          icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        />
      </div>
    )
  }

  if (empty) {
    return (
      <div className={className}>
        <EmptyState
          title={emptyMessage}
          description="Try adjusting your search or filters"
        />
      </div>
    )
  }

  return <div className={className}>{children}</div>
}