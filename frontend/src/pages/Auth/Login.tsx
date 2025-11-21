import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useAuthContext from "@/hooks/useAthContext"
import { type LoginInput, loginSchema } from "@/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuthContext()
  const navigate = useNavigate()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    try {
      const authedUser = await login(data)

      if (!authedUser) {
        toast.error("Credenciais inválidas")
        return
      }

      toast.success("Login realizado com sucesso!")
      navigate('/')
    } catch (error) {
      toast.error("Erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Faça login na sua conta</CardTitle>
          <CardDescription className="text-center">
            Digite seu e-mail abaixo para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Senha</FormLabel>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <><EyeOff className="h-3 w-3 inline mr-1" />Ocultar</>
                        ) : (
                          <><Eye className="h-3 w-3 inline mr-1" />Mostrar</>
                        )}
                      </button>
                    </div>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <div className="text-center">
            <Link
              to="/register"
              className="text-sm text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline"
            >
              Não tem conta? Cadastre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}