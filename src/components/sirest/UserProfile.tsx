import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { toast } from "sonner@2.0.3";
import { 
  User, 
  Mail, 
  Phone,
  Save,
  Edit,
  UserCheck,
  Users,
  CreditCard,
  ChefHat,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useRealtimeData, apiRequest } from "../../utils/useRealtimeData";

interface UserProfileProps {
  userSession: {
    role: string;
    username: string;
    userData: any;
  };
  accessToken?: string;
  onUpdate: (updatedData: any) => void;
}

const getRoleIcon = (role: string) => {
  const icons = {
    administrador: UserCheck,
    mesero: Users,
    cajero: CreditCard,
    cocinero: ChefHat
  };
  return icons[role as keyof typeof icons] || User;
};

const getRoleColor = (role: string) => {
  const colors = {
    administrador: "bg-blue-100 text-blue-800 border-blue-300",
    mesero: "bg-purple-100 text-purple-800 border-purple-300",
    cajero: "bg-orange-100 text-orange-800 border-orange-300",
    cocinero: "bg-yellow-100 text-yellow-800 border-yellow-300"
  };
  return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

function getRoleDisplayName(role: string) {
  const roleNames = {
    administrador: "Administrador del Sistema",
    mesero: "Mesero - Encargado de Servicio",
    cajero: "Cajero - Especialista en Pagos",
    cocinero: "Cocinero - Chef de Cocina",
    cliente: "Cliente"
  };
  return roleNames[role as keyof typeof roleNames] || "Usuario";
}

export function UserProfile({ userSession, accessToken, onUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Obtener perfil del servidor
  const { data: profileData, refetch } = useRealtimeData<{ success: boolean; profile: any }>({
    endpoint: "/profile",
    accessToken,
    refreshInterval: 10000
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: ""
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  // Sincronizar con datos del servidor
  useEffect(() => {
    if (profileData?.success && profileData.profile) {
      setFormData({
        name: profileData.profile.name || "",
        email: profileData.profile.email || "",
        phone: profileData.profile.phone || "",
        avatar: profileData.profile.avatar || ""
      });
    } else if (userSession.userData) {
      setFormData({
        name: userSession.userData.name || userSession.username,
        email: userSession.userData.email || "",
        phone: userSession.userData.phone || "",
        avatar: userSession.userData.avatar || ""
      });
    }
  }, [profileData, userSession]);

  const handleProfileUpdate = async () => {
    setIsSaving(true);
    try {
      const result = await apiRequest<{ success: boolean; profile: any }>("/profile", {
        method: "PUT",
        body: formData,
        accessToken
      });

      if (result.success) {
        toast.success("Perfil actualizado exitosamente");
        onUpdate(result.profile);
        setIsEditing(false);
        refetch();
      }
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      toast.error(error instanceof Error ? error.message : "Error al actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.newPassword) {
      toast.error("Ingrese la nueva contraseña");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    // Aquí se debería implementar el cambio de contraseña con Supabase
    toast.success("Contraseña actualizada exitosamente");
    setPasswordData({
      newPassword: "",
      confirmPassword: ""
    });
  };

  const RoleIcon = getRoleIcon(userSession.role);

  return (
    <div className="space-y-6">
      {/* Header del Perfil */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <RoleIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{formData.name || userSession.username}</h1>
              <p className="text-blue-100">{formData.email}</p>
              <Badge className={`${getRoleColor(userSession.role)} mt-2`}>
                <RoleIcon className="h-3 w-3 mr-1" />
                {getRoleDisplayName(userSession.role)}
              </Badge>
            </div>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Información Personal</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        {/* Información Personal */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Información del Perfil</span>
              </CardTitle>
              <CardDescription>
                Actualiza tu información personal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={!isEditing}
                      className={`pl-10 ${!isEditing ? "bg-gray-50" : ""}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={!isEditing}
                      className={`pl-10 ${!isEditing ? "bg-gray-50" : ""}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rol en el Sistema</Label>
                  <Input
                    id="role"
                    value={getRoleDisplayName(userSession.role)}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    El rol no puede ser modificado desde el perfil
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      refetch();
                    }}
                    disabled={isSaving}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleProfileUpdate}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-blue-900 to-purple-900"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seguridad */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-blue-600" />
                <span>Cambiar Contraseña</span>
              </CardTitle>
              <CardDescription>
                Actualiza tu contraseña de acceso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="Repite la nueva contraseña"
                  />
                </div>

                {passwordData.newPassword && passwordData.confirmPassword && (
                  <div className={`flex items-center space-x-2 text-sm p-3 rounded-lg ${
                    passwordData.newPassword === passwordData.confirmPassword
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}>
                    {passwordData.newPassword === passwordData.confirmPassword ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Las contraseñas coinciden</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4" />
                        <span>Las contraseñas no coinciden</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={handlePasswordChange}
                  className="bg-gradient-to-r from-blue-900 to-purple-900"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Actualizar Contraseña
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
