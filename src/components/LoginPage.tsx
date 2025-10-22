import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ChefHat, Users, CreditCard, UserCheck, Smartphone } from "lucide-react";

interface LoginPageProps {
  onLogin: (role: string, username: string) => void;
}

const roleIcons = {
  administrador: UserCheck,
  mesero: Users,
  cajero: CreditCard,
  cocinero: ChefHat,
  cliente: Smartphone
};

const roleColors = {
  administrador: "bg-red-500",
  mesero: "bg-blue-500", 
  cajero: "bg-green-500",
  cocinero: "bg-orange-500",
  cliente: "bg-purple-500"
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole && username) {
      onLogin(selectedRole, username);
    }
  };

  const quickLogin = (role: string, user: string) => {
    setSelectedRole(role);
    setUsername(user);
    setPassword("demo");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Logo y descripción */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <ChefHat className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">RestaurantPOS</h1>
                <p className="text-gray-600">Sistema de Gestión Integral</p>
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-8">
              Gestiona tu restaurante de manera eficiente con nuestro sistema completo de punto de venta, 
              inventario, pedidos y administración.
            </p>
          </div>

          {/* Accesos rápidos por rol */}
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => quickLogin("administrador", "admin")}
            >
              <CardContent className="p-4 text-center">
                <UserCheck className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <h3 className="font-semibold">Administrador</h3>
                <p className="text-sm text-gray-600">Gestión completa</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => quickLogin("mesero", "mesero1")}
            >
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold">Mesero</h3>
                <p className="text-sm text-gray-600">Tomar pedidos</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => quickLogin("cajero", "cajero1")}
            >
              <CardContent className="p-4 text-center">
                <CreditCard className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold">Cajero</h3>
                <p className="text-sm text-gray-600">Procesar pagos</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => quickLogin("cocinero", "chef1")}
            >
              <CardContent className="p-4 text-center">
                <ChefHat className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h3 className="font-semibold">Cocinero</h3>
                <p className="text-sm text-gray-600">Preparar platos</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Formulario de login */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Selecciona tu rol e ingresa tus credenciales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Rol de Usuario</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrador">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4 text-red-500" />
                        <span>Administrador</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="mesero">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span>Mesero</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="cajero">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-green-500" />
                        <span>Cajero</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="cocinero">
                      <div className="flex items-center space-x-2">
                        <ChefHat className="h-4 w-4 text-orange-500" />
                        <span>Cocinero</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="cliente">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4 text-purple-500" />
                        <span>Cliente</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                {selectedRole && (
                  <>
                    {(() => {
                      const Icon = roleIcons[selectedRole as keyof typeof roleIcons];
                      return Icon ? <Icon className="h-4 w-4 mr-2" /> : null;
                    })()}
                  </>
                )}
                Iniciar Sesión
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Eres cliente? 
                <Button 
                  variant="link" 
                  className="p-0 ml-1 h-auto"
                  onClick={() => quickLogin("cliente", "cliente_demo")}
                >
                  Accede aquí
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}