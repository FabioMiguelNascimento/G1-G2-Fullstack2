import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import Header from './components/header'
import { AuthProvider } from './contexts/AuthProvider'
import { CartProvider } from './contexts/CartContext'

function App() {

   return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <main className="max-w-7xl mx-auto p-4 h-full w-full">
          <Outlet />
        </main>
        <Toaster />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
