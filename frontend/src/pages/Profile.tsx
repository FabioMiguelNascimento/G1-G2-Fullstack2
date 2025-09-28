import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import useFetchUser from "@/hooks/useFetchUser";
import {
    Edit,
    HeartCrack,
    RefreshCw,
    TextIcon,
} from "lucide-react";
import { useParams } from "react-router-dom";





export default function Profile() {
  console.log('👤 PROFILE RENDERIZADO');
  const { userId } = useParams();
  const { user, loading, error } = useFetchUser(userId ?? null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="animate-spin h-8 w-8" />
        <span className="ml-2">Carregando perfil...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <HeartCrack className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Usuário não encontrado ou erro ao carregar</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header do Perfil */}
      <Card className="mb-8">
        <CardHeader className="text-center">
          <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
          <CardDescription className="text-lg">
            {user.email}
          </CardDescription>

          {/* Botões de Ação */}
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="default" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Editar dados
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Informações do Usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TextIcon className="w-5 h-5" />
            Informações do Usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong className="text-sm font-medium text-gray-500">ID:</strong>
              <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded mt-1">{user.id}</p>
            </div>
            
            <div>
              <strong className="text-sm font-medium text-gray-500">Nome:</strong>
              <p className="mt-1">{user.name}</p>
            </div>
            
            <div>
              <strong className="text-sm font-medium text-gray-500">Email:</strong>
              <p className="mt-1">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}