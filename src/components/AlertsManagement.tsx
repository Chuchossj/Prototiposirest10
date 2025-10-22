import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";
import { 
  Search, 
  Filter, 
  AlertTriangle,
  Bell,
  BellRing,
  Settings,
  Package,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Mail,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export function AlertsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    emailEnabled: true,
    smsEnabled: false,
    systemEnabled: true,
    dailyReport: true,
    weeklyReport: false,
    criticalThreshold: 10,
    warningThreshold: 20
  });

  const alerts = [
    {
      id: 1,
      producto: "Aceite de Oliva Extra Virgen",
      codigo: "AOL001",
      categoria: "Insumos",
      stockActual: 5,
      stockMinimo: 20,
      porcentaje: 25,
      prioridad: "Crítica",
      fechaAlerta: "2025-01-15",
      horaAlerta: "14:30",
      estado: "Activa",
      diasSinReposicion: 3,
      valorUnitario: 45000,
      proveedor: "Distribuidora Gourmet S.A.",
      ubicacion: "Almacén A001",
      consumoPromedio: 8,
      tiempoReposicion: 7
    },
    {
      id: 2,
      producto: "Harina de Trigo Premium",
      codigo: "HTP002",
      categoria: "Materia Prima",
      stockActual: 8,
      stockMinimo: 25,
      porcentaje: 32,
      prioridad: "Crítica",
      fechaAlerta: "2025-01-15",
      horaAlerta: "11:20",
      estado: "Activa",
      diasSinReposicion: 5,
      valorUnitario: 25000,
      proveedor: "Molinos del Valle Ltda.",
      ubicacion: "Almacén B002",
      consumoPromedio: 12,
      tiempoReposicion: 5
    },
    {
      id: 3,
      producto: "Tazas de Porcelana Premium",
      codigo: "TCP003",
      categoria: "Utensilios",
      stockActual: 12,
      stockMinimo: 30,
      porcentaje: 40,
      prioridad: "Alta",
      fechaAlerta: "2025-01-14",
      horaAlerta: "16:45",
      estado: "Activa",
      diasSinReposicion: 1,
      valorUnitario: 15000,
      proveedor: "Vajillas y Más S.A.S.",
      ubicacion: "Almacén C001",
      consumoPromedio: 5,
      tiempoReposicion: 10
    },
    {
      id: 4,
      producto: "Azúcar Refinada",
      codigo: "AZR005",
      categoria: "Insumos",
      stockActual: 15,
      stockMinimo: 40,
      porcentaje: 38,
      prioridad: "Alta",
      fechaAlerta: "2025-01-14",
      horaAlerta: "09:15",
      estado: "Activa",
      diasSinReposicion: 2,
      valorUnitario: 12000,
      proveedor: "Ingenio San Carlos",
      ubicacion: "Almacén A002",
      consumoPromedio: 15,
      tiempoReposicion: 3
    },
    {
      id: 5,
      producto: "Cafetera Industrial",
      codigo: "CAF006",
      categoria: "Equipos",
      stockActual: 1,
      stockMinimo: 3,
      porcentaje: 33,
      prioridad: "Media",
      fechaAlerta: "2025-01-13",
      horaAlerta: "13:00",
      estado: "Resuelta",
      diasSinReposicion: 0,
      valorUnitario: 1200000,
      proveedor: "Equipos Profesionales Ltda.",
      ubicacion: "Almacén D001",
      consumoPromedio: 1,
      tiempoReposicion: 15
    }
  ];

  const categories = ["Insumos", "Materia Prima", "Utensilios", "Equipos"];
  const priorities = ["Crítica", "Alta", "Media", "Baja"];

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || alert.categoria === selectedCategory;
    const matchesPriority = selectedPriority === "all" || alert.prioridad === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const activeAlerts = alerts.filter(alert => alert.estado === "Activa");
  const criticalAlerts = alerts.filter(alert => alert.prioridad === "Crítica" && alert.estado === "Activa");
  const totalValue = activeAlerts.reduce((sum, alert) => sum + (alert.valorUnitario * alert.stockActual), 0);

  const handleConfigSave = () => {
    toast.success("Configuración de alertas actualizada exitosamente");
    setIsConfigDialogOpen(false);
  };

  const handleResolveAlert = (id: number) => {
    toast.success("Alerta marcada como resuelta");
  };

  const handleCreatePurchaseOrder = (alert: any) => {
    toast.success(`Orden de compra generada para ${alert.producto}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Crítica": return "text-red-600";
      case "Alta": return "text-orange-600";
      case "Media": return "text-yellow-600";
      case "Baja": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "Crítica": return "destructive" as const;
      case "Alta": return "secondary" as const;
      case "Media": return "outline" as const;
      case "Baja": return "default" as const;
      default: return "outline" as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Alertas de Stock Mínimo</h1>
          <p className="text-muted-foreground">
            Sistema de notificaciones automáticas para control de inventario
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Enviar Reporte
          </Button>
          <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Configurar Alertas
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Configuración de Alertas</DialogTitle>
                <DialogDescription>
                  Configure las preferencias del sistema de alertas
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div>
                  <h4 className="font-medium mb-3">Canales de Notificación</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailEnabled">Notificaciones por Email</Label>
                      <Switch
                        id="emailEnabled"
                        checked={alertConfig.emailEnabled}
                        onCheckedChange={(checked) => setAlertConfig({...alertConfig, emailEnabled: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="smsEnabled">Notificaciones SMS</Label>
                      <Switch
                        id="smsEnabled"
                        checked={alertConfig.smsEnabled}
                        onCheckedChange={(checked) => setAlertConfig({...alertConfig, smsEnabled: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="systemEnabled">Notificaciones del Sistema</Label>
                      <Switch
                        id="systemEnabled"
                        checked={alertConfig.systemEnabled}
                        onCheckedChange={(checked) => setAlertConfig({...alertConfig, systemEnabled: checked})}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Reportes Automáticos</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dailyReport">Reporte Diario</Label>
                      <Switch
                        id="dailyReport"
                        checked={alertConfig.dailyReport}
                        onCheckedChange={(checked) => setAlertConfig({...alertConfig, dailyReport: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="weeklyReport">Reporte Semanal</Label>
                      <Switch
                        id="weeklyReport"
                        checked={alertConfig.weeklyReport}
                        onCheckedChange={(checked) => setAlertConfig({...alertConfig, weeklyReport: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Umbrales de Alerta</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="criticalThreshold">Umbral Crítico (%)</Label>
                      <Input
                        id="criticalThreshold"
                        type="number"
                        value={alertConfig.criticalThreshold}
                        onChange={(e) => setAlertConfig({...alertConfig, criticalThreshold: parseInt(e.target.value)})}
                        placeholder="10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="warningThreshold">Umbral de Advertencia (%)</Label>
                      <Input
                        id="warningThreshold"
                        type="number"
                        value={alertConfig.warningThreshold}
                        onChange={(e) => setAlertConfig({...alertConfig, warningThreshold: parseInt(e.target.value)})}
                        placeholder="20"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleConfigSave}>
                  Guardar Configuración
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estadísticas de alertas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <Bell className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Urgente reposición
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor en Riesgo</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              Stock bajo mínimo
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8</div>
            <p className="text-xs text-muted-foreground">
              Días sin reposición
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Alertas Activas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Stock Mínimo</CardTitle>
              <CardDescription>
                Productos que han alcanzado o están por debajo del stock mínimo configurado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por producto o código..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {priorities.map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Progreso</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Días Sin Reposición</TableHead>
                      <TableHead>Proyección</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{alert.producto}</p>
                            <p className="text-sm text-muted-foreground font-mono">{alert.codigo}</p>
                            <p className="text-xs text-muted-foreground">{alert.categoria} • {alert.ubicacion}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-red-600">{alert.stockActual}</p>
                            <p className="text-sm text-muted-foreground">Min: {alert.stockMinimo}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{alert.porcentaje}%</span>
                            </div>
                            <Progress value={alert.porcentaje} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityVariant(alert.prioridad)}>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {alert.prioridad}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className={`font-medium ${alert.diasSinReposicion > 3 ? "text-red-600" : "text-orange-600"}`}>
                              {alert.diasSinReposicion}
                            </p>
                            <p className="text-xs text-muted-foreground">días</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">
                              {Math.ceil(alert.stockActual / alert.consumoPromedio)} días
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Consumo: {alert.consumoPromedio}/día
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={alert.estado === "Activa" ? "destructive" : "default"}>
                            {alert.estado === "Activa" ? (
                              <BellRing className="h-3 w-3 mr-1" />
                            ) : (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            )}
                            {alert.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleCreatePurchaseOrder(alert)}>
                              <Package className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {alert.estado === "Activa" && (
                              <Button variant="ghost" size="sm" onClick={() => handleResolveAlert(alert.id)}>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Alertas</CardTitle>
              <CardDescription>
                Registro completo de todas las alertas generadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Aceite de Oliva Extra Virgen</p>
                      <p className="text-sm text-muted-foreground">
                        Alerta crítica resuelta • 2025-01-10 - 2025-01-15
                      </p>
                    </div>
                    <Badge variant="default">Resuelta</Badge>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Harina de Trigo Premium</p>
                      <p className="text-sm text-muted-foreground">
                        Alerta crítica activa • Desde 2025-01-12
                      </p>
                    </div>
                    <Badge variant="destructive">Activa</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Frecuencia de Alertas por Categoría</CardTitle>
                <CardDescription>
                  Análisis de categorías más propensas a alertas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category, index) => {
                    const categoryAlerts = alerts.filter(alert => alert.categoria === category).length;
                    const percentage = (categoryAlerts / alerts.length) * 100;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{category}</span>
                          <span className="font-medium">{categoryAlerts} alertas</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eficiencia del Sistema</CardTitle>
                <CardDescription>
                  Métricas de desempeño de las alertas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Tiempo Promedio de Resolución</span>
                  <span className="font-medium">3.2 días</span>
                </div>
                <div className="flex justify-between">
                  <span>Alertas Preventivas</span>
                  <span className="font-medium text-green-600">78%</span>
                </div>
                <div className="flex justify-between">
                  <span>Alertas Críticas Evitadas</span>
                  <span className="font-medium text-blue-600">45%</span>
                </div>
                <div className="flex justify-between">
                  <span>Precisión de Predicciones</span>
                  <span className="font-medium">91%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}