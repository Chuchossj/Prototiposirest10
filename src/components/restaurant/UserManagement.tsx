import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner@2.0.3";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  UserCheck,
  CreditCard,
  ChefHat,
  User,
  Shield,
  UserX,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useRealtimeData, apiRequest } from "../../utils/useRealtimeData";

interface UserManagementProps {
  accessToken?: string;
}

const getRoleIcon = (role: string) => {
  const icons: Record<string, any> = {
    administrador: UserCheck,
    mesero: Users,
    cajero: CreditCard,
    cocinero: ChefHat,
    cliente: User
  };
  return icons[role] || User;
};

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    administrador: "bg-blue-100 text-blue-800 border-blue-300",
    mesero: "bg-purple-100 text-purple-800 border-purple-300",
    cajero: "bg-orange-100 text-orange-800 border-orange-300",
    cocinero: "bg-yellow-100 text-yellow-800 border-yellow-300",
    cliente: "bg-gray-100 text-gray-800 border-gray-300"
  };
  return colors[role] || "bg-gray-100 text-gray-800";
};

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    administrador: "Administrador",
    mesero: "Mesero",
    cajero: "Cajero",
    cocinero: "Cocinero",
    cliente: "Cliente"
  };
  return labels[role] || role;
};

export function UserManagement({ accessToken }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deactivationNote, setDeactivationNote] = useState("");
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "mesero"
  });

  // Obtener usuarios en tiempo real
  const { data: usersData, loading, refetch } = useRealtimeData<{ success: boolean; users: any[] }>({
    endpoint: "/users",
    accessToken,
    refreshInterval: 5000
  });

  const users = usersData?.users || [];

  // Filtrar usuarios
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estadísticas por rol
  const usersByRole = users.reduce((acc: Record<string, number>, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Complete todos los campos requeridos");
      return;
    }

    if (newUser.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsSaving(true);
    try {
      await apiRequest("/auth/signup", {
        method: "POST",
        body: newUser,
        accessToken
      });

      toast.success("Usuario creado exitosamente");
      setIsAddDialogOpen(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "mesero"
      });
      refetch();
    } catch (error) {
      console.error("Error creando usuario:", error);
      toast.error(error instanceof Error ? error.message : "Error al crear usuario");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivateUser = async () => {
    if (!deactivationNote.trim()) {
      toast.error("Debe especificar el motivo de desactivación");
      return;
    }

    setIsSaving(true);
    try {
      await apiRequest(`/users/${selectedUser.id}`, {
        method: "PUT",
        body: {
          active: false,
          deactivationNote: deactivationNote.trim()
        },
        accessToken
      });

      toast.success("Usuario desactivado exitosamente");
      setIsDeactivateDialogOpen(false);
      setSelectedUser(null);
      setDeactivationNote("");
      refetch();
    } catch (error) {
      console.error("Error desactivando usuario:", error);
      toast.error(error instanceof Error ? error.message : "Error al desactivar usuario");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReactivateUser = async (user: any) => {
    if (!confirm(`¿Está seguro que desea reactivar al usuario ${user.name}?`)) {
      return;
    }

    try {
      await apiRequest(`/users/${user.id}`, {
        method: "PUT",
        body: {
          active: true
        },
        accessToken
      });

      toast.success("Usuario reactivado exitosamente");
      refetch();
    } catch (error) {
      console.error("Error reactivando usuario:", error);
      toast.error(error instanceof Error ? error.message : "Error al reactivar usuario");
    }
  };

  const openDeactivateDialog = (user: any) => {
    setSelectedUser(user);
    setDeactivationNote("");
    setIsDeactivateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
              <p className="text-blue-100">Administra los usuarios del sistema</p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">
            {users.length} Usuarios
          </Badge>
        </div>
      </div>

      {/* Estadísticas por Rol */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center">
              <UserCheck className="h-4 w-4 mr-1" />
              Administradores
            </CardDescription>
            <CardTitle className="text-2xl">{usersByRole.administrador || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Meseros
            </CardDescription>
            <CardTitle className="text-2xl">{usersByRole.mesero || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center">
              <CreditCard className="h-4 w-4 mr-1" />
              Cajeros
            </CardDescription>
            <CardTitle className="text-2xl">{usersByRole.cajero || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center">
              <ChefHat className="h-4 w-4 mr-1" />
              Cocineros
            </CardDescription>
            <CardTitle className="text-2xl">{usersByRole.cocinero || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              Clientes
            </CardDescription>
            <CardTitle className="text-2xl">{usersByRole.cliente || 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabla de Usuarios */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Usuarios</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-900 to-purple-900">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                      Agrega un nuevo usuario al sistema SIREST
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        placeholder="Juan Pérez"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="juan.perez@globatech.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rol</Label>
                      <select
                        id="role"
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                      >
                        <option value="administrador">Administrador</option>
                        <option value="mesero">Mesero</option>
                        <option value="cajero">Cajero</option>
                        <option value="cocinero">Cocinero</option>
                        <option value="cliente">Cliente</option>
                      </select>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800 flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        Solo los administradores pueden crear usuarios de staff. 
                        Los usuarios recibirán sus credenciales por correo electrónico.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddUser}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-blue-900 to-purple-900"
                    >
                      {isSaving ? "Creando..." : "Crear Usuario"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Correo Electrónico</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Cargando usuarios...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const RoleIcon = getRoleIcon(user.role);
                    const isActive = user.active !== false;
                    
                    return (
                      <TableRow key={user.id} className={!isActive ? "bg-gray-50" : ""}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isActive 
                                ? "bg-gradient-to-br from-blue-900 to-purple-900" 
                                : "bg-gray-400"
                            }`}>
                              <RoleIcon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              {!isActive && user.deactivationNote && (
                                <div className="text-xs text-gray-500 mt-1 flex items-start">
                                  <AlertCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                                  <span>{user.deactivationNote}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRoleColor(user.role)}>
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {getRoleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          {isActive ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Activo
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                              <UserX className="h-3 w-3 mr-1" />
                              Inactivo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {user.role !== "administrador" && (
                            isActive ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDeactivateDialog(user)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <UserX className="h-4 w-4 mr-1" />
                                Desactivar
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReactivateUser(user)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Reactivar
                              </Button>
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de Desactivación */}
      <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <UserX className="h-5 w-5 mr-2" />
              Desactivar Usuario
            </DialogTitle>
            <DialogDescription>
              Está a punto de desactivar a <strong>{selectedUser?.name}</strong>. 
              El usuario no podrá iniciar sesión hasta que sea reactivado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deactivationNote">
                Motivo de desactivación <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="deactivationNote"
                value={deactivationNote}
                onChange={(e) => setDeactivationNote(e.target.value)}
                placeholder="Explique el motivo por el cual se desactiva este usuario..."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Esta nota será visible para otros administradores y quedará registrada en el historial del usuario.
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-800 flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                Esta acción no elimina al usuario, solo impide que pueda acceder al sistema. 
                Puede reactivarlo en cualquier momento desde esta misma pantalla.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeactivateDialogOpen(false);
                setSelectedUser(null);
                setDeactivationNote("");
              }}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeactivateUser}
              disabled={isSaving || !deactivationNote.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSaving ? "Desactivando..." : "Desactivar Usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
