import { Outlet } from 'react-router-dom'
import Header from './components/header'
import { AuthProvider } from './contexts/AuthProvider'
import { Toaster } from 'sonner'

function App() {

   return (
    <AuthProvider>
      <Header />
      <main className="max-w-7xl mx-auto p-4 h-full w-full">
        <Outlet />
      </main>
      <Toaster />
    </AuthProvider>
  )
}

export default App
