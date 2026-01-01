import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'

function LoginPage() {
      const { authUser , isLoading , login } = useAuthStore() ;
  return (
    <div>
      LoginPage
    </div>
  )
}

export default LoginPage
