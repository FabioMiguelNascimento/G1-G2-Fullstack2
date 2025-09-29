import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAuthContext from "@/hooks/useAthContext"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuthContext()
  const navigate = useNavigate()

  const handleLogin = async (email: string, password: string) => {
    const authedUser = await login({ email, password})

    if(!authedUser) {
      toast("Credenciais invalidas")
      return
    }

    navigate('/')
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md ">
        <CardHeader>
          <CardTitle className="text-xl">Faça login na sua conta</CardTitle>
          <CardDescription>
            Digite seu e-mail abaixo para acessar sua conta
          </CardDescription>
          <CardAction></CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}/>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full" onClick={() => handleLogin(email, password)}>
            Login
          </Button>
          <Link to="/register" className="w-full text-sm underline">
            Nao tem conta? Cadastre-se
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
