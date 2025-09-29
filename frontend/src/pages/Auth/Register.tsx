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

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName ] = useState('')
  const { register } = useAuthContext()
  const navigate = useNavigate()

  const handleRegister = async (email: string, password: string, name: string) => {
    const result = await register({ email, password, name})

    if(!result.user) {
      toast(result.message)
      return
    }

    navigate('/')
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md ">
        <CardHeader>
          <CardTitle className="text-xl">Registre uma conta gratuitamente</CardTitle>
          <CardDescription>
            Preencha o formulario para se cadastrar
          </CardDescription>
          <CardAction></CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Nome</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
          <Button className="w-full"  onClick={() => handleRegister(email, password, name)}>
            Cadastrar
          </Button>
          <Link to="/login" className="w-full text-sm underline">
            Ja tem conta? Faça Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
