import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Search, 
  Filter, 
  History,
  User,
  Calendar,
  FileText,
  Activity,
  Database,
  Shield,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Edit,
  Package,
  TrendingUp
} from "lucide-react";

export function AuditManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("today");

  const auditLogs = [
    {
      id: 1,
      timestamp: "2025-01-15 14:30:25",
      user: "Ana García",
      rol: "Administrador",
      accion: "Crear Bien",
      modulo: "Gestión de Bienes",
      descripcion: "Registró nuevo bien: Aceite de Oliva Extra Virgen (AOL001)",
      ip: "192.168.1.45",
      dispositivoId: "DESK-001",
      exito: true,
      detalles: {
        entidad: "Bien",
        entidadId: "AOL001",
        valoresAnteriores: null,
        valoresNuevos: {
          nombre: "Aceite de Oliva Extra Virgen",
          codigo: "AOL001",
          categoria: "Insumos",
          proveedor: "Distribuidora Gourmet S.A."
        }
      }
    },
    {
      id: 2,
      timestamp: "2025-01-15 14:25:12",
      user: "Carlos López",
      rol: "Instructor",
      accion: "Registrar Salida",
      modulo: "Entradas y Salidas",
      descripcion: "Registró salida de 10kg de Harina de Trigo Premium para Cocina Principal",
      ip: "192.168.1.32",
      dispositivoId: "TAB-003",
      exito: true,
      detalles: {
        entidad: "Movimiento",
        entidadId: "MOV-145",
        productoAfectado: "HTP002",
        cantidadAnterior: 25,
        cantidadNueva: 15
      }
    },
    {
      id: 3,
      timestamp: "2025-01-15 14:20:08",
      user: "María Rodríguez",
      rol: "Coordinador",
      accion: "Actualizar Stock",
      modulo: "Gestión de Bienes",
      descripcion: "Actualizó stock mínimo de Tazas de Porcelana de 20 a 30 unidades",
      ip: "192.168.1.28",
      dispositivoId: "DESK-002",
      exito: true,
      detalles: {
        entidad: "Bien",
        entidadId: "TCP003",
        valoresAnteriores: { stockMinimo: 20 },
        valoresNuevos: { stockMinimo: 30 }
      }
    },
    {
      id: 4,
      timestamp: "2025-01-15 14:15:45",
      user: "Juan Pérez",
      rol: "Administrador",
      accion: "Crear Factura",
      modulo: "Registro de Facturas",
      descripcion: "Registró nueva factura FAC-2025-004 por $2,850,000",
      ip: "192.168.1.15",
      dispositivoId: "DESK-001",
      exito: true,
      detalles: {
        entidad: "Factura",
        entidadId: "FAC-2025-004",
        proveedor: "Distribuidora Gourmet S.A.",
        valor: 2850000
      }
    },
    {
      id: 5,
      timestamp: "2025-01-15 14:10:33",
      user: "Sofia Martín",
      rol: "Instructor",
      accion: "Solicitar Bienes",
      modulo: "Solicitudes",
      descripcion: "Creó solicitud SOL-2025-005 para equipos de panadería",
      ip: "192.168.1.67",
      dispositivoId: "TAB-007",
      exito: true,
      detalles: {
        entidad: "Solicitud",
        entidadId: "SOL-2025-005",
        items: 3,
        valorEstimado: 450000
      }
    },
    {
      id: 6,
      timestamp: "2025-01-15 14:05:21",
      user: "Diego Herrera",
      rol: "Instructor",
      accion: "Intentar Eliminar",
      modulo: "Gestión de Bienes",
      descripcion: "Intento fallido de eliminar bien AOL001 - Sin permisos",
      ip: "192.168.1.89",
      dispositivoId: "TAB-012",
      exito: false,
      detalles: {
        error: "Permisos insuficientes",
        intentoAcceso: "Eliminar bien crítico"
      }
    }
  ];

  const systemEvents = [
    {
      id: 1,
      timestamp: "2025-01-15 00:00:15",
      tipo: "Backup Automático",
      descripcion: "Respaldo automático de base de datos completado exitosamente",
      estado: "Exitoso",
      detalles: "Tamaño: 2.3GB, Duración: 4m 32s"
    },
    {
      id: 2,
      timestamp: "2025-01-14 23:55:00",
      tipo: "Alerta Automática",
      descripcion: "Sistema generó 5 nuevas alertas de stock mínimo",
      estado: "Completado",
      detalles: "Productos críticos identificados y notificaciones enviadas"
    },
    {
      id: 3,
      timestamp: "2025-01-14 18:30:45",
      tipo: "Actualización Sistema",
      descripcion: "Aplicación de parche de seguridad v1.2.3",
      estado: "Exitoso",
      detalles: "Sin impacto en operaciones, tiempo de inactividad: 0"
    }
  ];

  const actions = [
    "Crear Bien", "Actualizar Bien", "Eliminar Bien",
    "Registrar Entrada", "Registrar Salida", 
    "Crear Factura", "Actualizar Factura",
    "Crear Proveedor", "Actualizar Proveedor",
    "Solicitar Bienes", "Aprobar Solicitud",
    "Conciliar Inventario", "Ajustar Stock"
  ];

  const users = ["Ana García", "Carlos López", "María Rodríguez", "Juan Pérez", "Sofia Martín", "Diego Herrera"];
  const modules = ["Gestión de Bienes", "Entradas y Salidas", "Registro de Facturas", "Gestión de Proveedores", "Solicitudes", "Conciliación"];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.modulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === "all" || log.accion === selectedAction;
    const matchesUser = selectedUser === "all" || log.user === selectedUser;
    
    let matchesDate = true;
    if (selectedDateRange !== "all") {
      const today = new Date();
      const logDate = new Date(log.timestamp);
      
      switch (selectedDateRange) {
        case "today":
          matchesDate = logDate.toDateString() === today.toDateString();
          break;
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesAction && matchesUser && matchesDate;
  });

  const totalLogs = auditLogs.length;
  const successfulActions = auditLogs.filter(log => log.exito).length;
  const failedActions = auditLogs.filter(log => !log.exito).length;
  const uniqueUsers = [...new Set(auditLogs.map(log => log.user))].length;

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Crear Bien":
      case "Actualizar Bien":
        return <Package className="h-4 w-4" />;
      case "Registrar Entrada":
      case "Registrar Salida":
        return <Activity className="h-4 w-4" />;
      case "Crear Factura":
      case "Actualizar Factura":
        return <FileText className="h-4 w-4" />;
      default:
        return <Edit className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (exito: boolean) => {
    return exito ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Historial y Auditoría</h1>
          <p className="text-muted-foreground">
            Registro completo de movimientos con trazabilidad y auditoría del sistema
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Logs
          </Button>
          <Button variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Reporte de Seguridad
          </Button>
        </div>
      </div>

      {/* Estadísticas de auditoría */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
            <History className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLogs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Eventos registrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acciones Exitosas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successfulActions}</div>
            <p className="text-xs text-muted-foreground">
              {((successfulActions / totalLogs) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acciones Fallidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedActions}</div>
            <p className="text-xs text-muted-foreground">
              Requieren revisión
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">
              En este período
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="user-actions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="user-actions">Acciones de Usuario</TabsTrigger>
          <TabsTrigger value="system-events">Eventos del Sistema</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="user-actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Acciones de Usuario</CardTitle>
              <CardDescription>
                Historial detallado de todas las acciones realizadas por los usuarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por descripción, usuario o módulo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Acción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Acciones</SelectItem>
                    {actions.map(action => (
                      <SelectItem key={action} value={action}>{action}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los Usuarios</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user} value={user}>{user}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mes</SelectItem>
                    <SelectItem value="all">Todo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha/Hora</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Acción</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div>
                            <p className="font-mono text-sm">{log.timestamp}</p>
                            <p className="text-xs text-muted-foreground">IP: {log.ip}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.user}</p>
                            <Badge variant="outline" className="text-xs">{log.rol}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getActionIcon(log.accion)}
                            <span className="font-medium">{log.accion}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm max-w-md">{log.descripcion}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{log.modulo}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(log.exito)}
                            <span className={log.exito ? "text-green-600" : "text-red-600"}>
                              {log.exito ? "Exitoso" : "Fallido"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Eventos del Sistema</CardTitle>
              <CardDescription>
                Eventos automáticos y de mantenimiento del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Database className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{event.tipo}</p>
                        <p className="text-sm text-muted-foreground">{event.descripcion}</p>
                        <p className="text-xs text-muted-foreground">{event.detalles}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">{event.estado}</Badge>
                      <p className="text-sm text-muted-foreground mt-1">{event.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Intentos de Acceso Fallidos</CardTitle>
                <CardDescription>
                  Registro de intentos de acceso no autorizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.filter(log => !log.exito).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="font-medium">{log.user}</p>
                          <p className="text-sm text-muted-foreground">{log.descripcion}</p>
                          <p className="text-xs text-muted-foreground">IP: {log.ip} • {log.timestamp}</p>
                        </div>
                      </div>
                      <Badge variant="destructive">Fallido</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actividad por Usuario</CardTitle>
                <CardDescription>
                  Estadísticas de actividad de usuarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => {
                    const userActions = auditLogs.filter(log => log.user === user).length;
                    const userSuccess = auditLogs.filter(log => log.user === user && log.exito).length;
                    const successRate = userActions > 0 ? (userSuccess / userActions) * 100 : 0;
                    
                    return (
                      <div key={user} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <User className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{user}</p>
                            <p className="text-sm text-muted-foreground">{userActions} acciones</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{successRate.toFixed(1)}%</p>
                          <p className="text-sm text-muted-foreground">éxito</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reportes de Auditoría</CardTitle>
                <CardDescription>
                  Genere reportes detallados de auditoría
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Reporte de Actividad Diaria</p>
                    <p className="text-sm text-muted-foreground">Acciones realizadas en las últimas 24 horas</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Reporte de Seguridad</p>
                    <p className="text-sm text-muted-foreground">Intentos de acceso y actividades sospechosas</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Análisis de Trazabilidad</p>
                    <p className="text-sm text-muted-foreground">Seguimiento completo de cambios en bienes</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Reporte de Cumplimiento</p>
                    <p className="text-sm text-muted-foreground">Adherencia a políticas y procedimientos</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Integridad</CardTitle>
                <CardDescription>
                  Indicadores de calidad y confiabilidad del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Tasa de Éxito</span>
                  <span className="font-medium text-green-600">
                    {((successfulActions / totalLogs) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo Promedio de Respuesta</span>
                  <span className="font-medium">245ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Disponibilidad del Sistema</span>
                  <span className="font-medium text-green-600">99.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Registros por Día</span>
                  <span className="font-medium">487</span>
                </div>
                <div className="flex justify-between">
                  <span>Retención de Logs</span>
                  <span className="font-medium">2 años</span>
                </div>
                <div className="flex justify-between">
                  <span>Última Copia de Seguridad</span>
                  <span className="font-medium text-blue-600">Hace 2 horas</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}