"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "react-query"
import { AuthProvider } from "@/contexts/auth-context"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
