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
    Heart,
    HeartCrack,
    RefreshCw,
    Share,
    TextIcon,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";





export default function Profile() {
  const { userId } = useParams();
  console.log("UserId from params:", userId);
  const { user, loading, error } = useFetchUser(userId ?? null);
  const [isFollowing, setIsFollowing] = useState(false);

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
            <Button
              variant={isFollowing ? "outline" : "default"}
              onClick={() => setIsFollowing(!isFollowing)}
              className="flex items-center gap-2"
            >
              <Heart className={`w-4 h-4 ${isFollowing ? "fill-red-500 text-red-500" : ""}`} />
              {isFollowing ? "Seguindo" : "Seguir"}
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Share className="w-4 h-4" />
              Compartilhar
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
            
            {user.createdAt && (
              <div>
                <strong className="text-sm font-medium text-gray-500">Membro desde:</strong>
                <p className="mt-1">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            )}
            
            {user.updatedAt && (
              <div>
                <strong className="text-sm font-medium text-gray-500">Última atualização:</strong>
                <p className="mt-1">{new Date(user.updatedAt).toLocaleDateString('pt-BR')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}