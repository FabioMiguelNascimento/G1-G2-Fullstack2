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
import { registerWithConfirmSchema, type RegisterWithConfirmInput } from "@/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle, Eye, EyeOff, Loader2, XCircle } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser } = useAuthContext()
  const navigate = useNavigate()

  const form = useForm<RegisterWithConfirmInput>({
    resolver: zodResolver(registerWithConfirmSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const watchedPassword = form.watch("password")

  const passwordRequirements = [
    { text: "Pelo menos 6 caracteres", met: (watchedPassword?.length || 0) >= 6 },
    { text: "Uma letra minúscula", met: /[a-z]/.test(watchedPassword || "") },
    { text: "Uma letra maiúscula", met: /[A-Z]/.test(watchedPassword || "") },
    { text: "Um número", met: /\d/.test(watchedPassword || "") },
  ]

  const onSubmit = async (data: RegisterWithConfirmInput) => {
    setIsLoading(true)
    try {
      const result = await registerUser({
        email: data.email,
        password: data.password,
        name: data.name
      })

      if (!result.user) {
        toast.error(result.message || "Erro ao criar conta")
        return
      }

      toast.success("Conta criada com sucesso! Você foi logado automaticamente.")
      navigate('/')
    } catch (error) {
      toast.error("Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Registre uma conta gratuitamente</CardTitle>
          <CardDescription className="text-center">
            Preencha o formulário para se cadastrar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="João Silva"
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
                    {watchedPassword && (
                      <div className="space-y-1 mt-2">
                        {passwordRequirements.map((req, index) => (
                          <p key={index} className={`text-xs flex items-center gap-1 ${
                            req.met ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {req.met ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {req.text}
                          </p>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Confirmar Senha</FormLabel>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-xs text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <><EyeOff className="h-3 w-3 inline mr-1" />Ocultar</>
                        ) : (
                          <><Eye className="h-3 w-3 inline mr-1" />Mostrar</>
                        )}
                      </button>
                    </div>
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
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
                    Criando conta...
                  </>
                ) : (
                  'Cadastrar'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline"
            >
              Já tem conta? Faça Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}