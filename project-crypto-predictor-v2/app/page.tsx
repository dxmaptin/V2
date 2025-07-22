"use client"

import { useState } from "react"
import { CryptoProductSite } from "@/components/crypto-product-site"
import LoadingScreen from "@/components/loading-screen"
import LoginScreen from "@/components/login-screen" // 导入 LoginScreen

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // 新增登录状态

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <CryptoProductSite />
    </main>
  )
}
