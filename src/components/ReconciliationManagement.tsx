import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { 
  Plus, 
  Search, 
  BarChart3,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calculator,
  Download,
  Upload,
  Eye,
  Edit,
  Clock,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export function ReconciliationManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isReconciliationDialogOpen, setIsReconciliationDialogOpen] = useState(false);
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);

  const [reconciliationData, setReconciliationData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    responsable: "",
    ubicacion: "",
    tipo: "",
    observaciones: ""
  });

  const [adjustmentData, setAdjustmentData] = useState({
    producto: "",
    stockSistema: "",
    stockFisico: "",
    diferencia: "",
    motivo: "",
    observaciones: ""
  });

  const reconciliations = [
    {
      id: 1,
      codigo: "CON-2025-001",
      fecha: "2025-01-15",
      ubicacion: "Almacén A001",
      responsable: "Ana García",
      tipo: "Conciliación Trimestral",
      estado: "Completada",
      itemsRevisados: 145,
      diferenciasEncontradas: 8,
      valorDiferencias: 320000,
      porcentajePrecision: 94.5,
      duracion: "4.5 horas",
      observaciones: "Conciliación trimestral exitosa con diferencias menores"
    },
    {
      id: 2,
      codigo: "CON-2025-002",
      fecha: "2025-01-12",
      ubicacion: "Almacén B002",
      responsable: "Carlos López",
      tipo: "Conciliación Mensual",
      estado: "En Proceso",
      itemsRevisados: 67,
      diferenciasEncontradas: 3,
      valorDiferencias: 85000,
      porcentajePrecision: 96.2,
      duracion: "2.0 horas",
      observaciones: "En proceso de verificación de diferencias encontradas"
    },
    {
      id: 3,
      codigo: "CON-2025-003",
      fecha: "2025-01-10",
      ubicacion: "Almacén C001",
      responsable: "María Rodríguez",
      tipo: "Conciliación Especial",
      estado: "Pendiente Ajustes",
      itemsRevisados: 230,
      diferenciasEncontradas: 15,
      valorDiferencias: 750000,
      porcentajePrecision: 93.5,
      duracion: "6.0 horas",
      observaciones: "Requiere ajustes por diferencias significativas en vajillas"
    }
  ];

  const differences = [
    {
      id: 1,
      conciliacion: "CON-2025-001",
      producto: "Aceite de Oliva Extra Virgen",
      codigo: "AOL001",
      stockSistema: 25,
      stockFisico: 23,
      diferencia: -2,
      valorUnitario: 45000,
      valorDiferencia: -90000,
      tipo: "Faltante",
      causa: "Posible consumo no registrado",
      estado: "Ajustado",
      fechaAjuste: "2025-01-15"
    },
    {
      id: 2,
      conciliacion: "CON-2025-001",
      producto: "Tazas de Porcelana Premium",
      codigo: "TCP003",
      stockSistema: 48,
      stockFisico: 52,
      diferencia: 4,
      valorUnitario: 15000,
      valorDiferencia: 60000,
      tipo: "Sobrante",
      causa: "Entrada no registrada correctamente",
      estado: "Pendiente",
      fechaAjuste: null
    },
    {
      id: 3,
      conciliacion: "CON-2025-003",
      producto: "Harina de Trigo Premium",
      codigo: "HTP002",
      stockSistema: 15,
      stockFisico: 12,
      diferencia: -3,
      valorUnitario: 25000,
      valorDiferencia: -75000,
      tipo: "Faltante",
      causa: "Merma por vencimiento",
      estado: "En Revisión",
      fechaAjuste: null
    }
  ];

  const tipos = ["Conciliación Mensual", "Conciliación Trimestral", "Conciliación Anual", "Conciliación Especial", "Auditoría Externa"];
  const ubicaciones = ["Almacén A001", "Almacén B002", "Almacén C001", "Almacén D001", "Todas las Ubicaciones"];
  const estados = ["Pendiente", "En Proceso", "Completada", "Pendiente Ajustes", "Cancelada"];

  const filteredReconciliations = reconciliations.filter(rec => {
    const matchesSearch = rec.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.responsable.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || rec.estado === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalReconciliations = reconciliations.length;
  const completedReconciliations = reconciliations.filter(rec => rec.estado === "Completada").length;
  const totalDifferences = differences.length;
  const totalValueDifferences = differences.reduce((sum, diff) => sum + Math.abs(diff.valorDiferencia), 0);

  const handleReconciliationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Nueva conciliación iniciada exitosamente");
    setIsReconciliationDialogOpen(false);
    setReconciliationData({
      fecha: new Date().toISOString().split('T')[0],
      responsable: "",
      ubicacion: "",
      tipo: "",
      observaciones: ""
    });
  };

  const handleAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Ajuste registrado exitosamente");
    setIsAdjustmentDialogOpen(false);
    setAdjustmentData({
      producto: "",
      stockSistema: "",
      stockFisico: "",
      diferencia: "",
      motivo: "",
      observaciones: ""
    });
  };

  const handleApproveAdjustment = (id: number) => {
    toast.success("Ajuste aprobado y aplicado al sistema");
  };

  const handleRejectAdjustment = (id: number) => {
    toast.success("Ajuste rechazado y marcado para revisión");
  };

  const getStatusVariant = (estado: string) => {
    switch (estado) {
      case "Completada": return "default" as const;
      case "En Proceso": return "secondary" as const;
      case "Pendiente Ajustes": return "destructive" as const;
      case "Pendiente": return "outline" as const;
      default: return "outline" as const;
    }
  };

  const getDifferenceVariant = (tipo: string) => {
    switch (tipo) {
      case "Faltante": return "destructive" as const;
      case "Sobrante": return "default" as const;
      default: return "outline" as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Conciliación de Inventario</h1>
          <p className="text-muted-foreground">
            Comparación entre conteos físicos y registros digitales del sistema
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar Conteo
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
          <Dialog open={isReconciliationDialogOpen} onOpenChange={setIsReconciliationDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Conciliación
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Iniciar Nueva Conciliación</DialogTitle>
                <DialogDescription>
                  Configure los parámetros para la conciliación de inventario
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleReconciliationSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="recFecha">Fecha de Conciliación *</Label>
                    <Input
                      id="recFecha"
                      type="date"
                      value={reconciliationData.fecha}
                      onChange={(e) => setReconciliationData({...reconciliationData, fecha: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recTipo">Tipo de Conciliación *</Label>
                    <Select value={reconciliationData.tipo} onValueChange={(value) => setReconciliationData({...reconciliationData, tipo: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipos.map(tipo => (
                          <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recUbicacion">Ubicación *</Label>
                    <Select value={reconciliationData.ubicacion} onValueChange={(value) => setReconciliationData({...reconciliationData, ubicacion: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        {ubicaciones.map(ubicacion => (
                          <SelectItem key={ubicacion} value={ubicacion}>{ubicacion}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recResponsable">Responsable *</Label>
                    <Input
                      id="recResponsable"
                      value={reconciliationData.responsable}
                      onChange={(e) => setReconciliationData({...reconciliationData, responsable: e.target.value})}
                      placeholder="Nombre del responsable"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recObservaciones">Observaciones</Label>
                    <Textarea
                      id="recObservaciones"
                      value={reconciliationData.observaciones}
                      onChange={(e) => setReconciliationData({...reconciliationData, observaciones: e.target.value})}
                      placeholder="Observaciones adicionales"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsReconciliationDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Iniciar Conciliación
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estadísticas de conciliación */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conciliaciones</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReconciliations}</div>
            <p className="text-xs text-muted-foreground">
              Este trimestre
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedReconciliations}</div>
            <p className="text-xs text-muted-foreground">
              {((completedReconciliations / totalReconciliations) * 100).toFixed(0)}% del total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diferencias</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDifferences}</div>
            <p className="text-xs text-muted-foreground">
              Encontradas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Diferencias</CardTitle>
            <Calculator className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalValueDifferences / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              En revisión
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reconciliations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reconciliations">Conciliaciones</TabsTrigger>
          <TabsTrigger value="differences">Diferencias</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="reconciliations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Conciliaciones</CardTitle>
              <CardDescription>
                Registro de todas las conciliaciones realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por código o responsable..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los Estados</SelectItem>
                    {estados.map(estado => (
                      <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Conciliación</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Items Revisados</TableHead>
                      <TableHead>Diferencias</TableHead>
                      <TableHead>Precisión</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReconciliations.map((reconciliation) => (
                      <TableRow key={reconciliation.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium font-mono">{reconciliation.codigo}</p>
                            <p className="text-sm text-muted-foreground">{reconciliation.fecha}</p>
                            <p className="text-xs text-muted-foreground">{reconciliation.tipo}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{reconciliation.ubicacion}</p>
                            <p className="text-sm text-muted-foreground">{reconciliation.responsable}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{reconciliation.itemsRevisados}</p>
                          <p className="text-sm text-muted-foreground">productos</p>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className={`font-medium ${reconciliation.diferenciasEncontradas > 0 ? "text-orange-600" : "text-green-600"}`}>
                              {reconciliation.diferenciasEncontradas}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ${(reconciliation.valorDiferencias / 1000).toFixed(0)}K
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{reconciliation.porcentajePrecision}%</p>
                            <Progress value={reconciliation.porcentajePrecision} className="w-16 h-1" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-sm">{reconciliation.duracion}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(reconciliation.estado)}>
                            {reconciliation.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
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

        <TabsContent value="differences" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3>Diferencias Encontradas</h3>
              <p className="text-sm text-muted-foreground">
                Discrepancias entre registros digitales y conteos físicos
              </p>
            </div>
            <Dialog open={isAdjustmentDialogOpen} onOpenChange={setIsAdjustmentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Ajuste
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Registrar Ajuste Manual</DialogTitle>
                  <DialogDescription>
                    Registre un ajuste de inventario por diferencias encontradas
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAdjustmentSubmit}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="adjProducto">Producto *</Label>
                      <Input
                        id="adjProducto"
                        value={adjustmentData.producto}
                        onChange={(e) => setAdjustmentData({...adjustmentData, producto: e.target.value})}
                        placeholder="Código o nombre del producto"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="adjStockSistema">Stock Sistema *</Label>
                        <Input
                          id="adjStockSistema"
                          type="number"
                          value={adjustmentData.stockSistema}
                          onChange={(e) => setAdjustmentData({...adjustmentData, stockSistema: e.target.value})}
                          placeholder="25"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adjStockFisico">Stock Físico *</Label>
                        <Input
                          id="adjStockFisico"
                          type="number"
                          value={adjustmentData.stockFisico}
                          onChange={(e) => setAdjustmentData({...adjustmentData, stockFisico: e.target.value})}
                          placeholder="23"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adjMotivo">Motivo de la Diferencia *</Label>
                      <Select value={adjustmentData.motivo} onValueChange={(value) => setAdjustmentData({...adjustmentData, motivo: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar motivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consumo_no_registrado">Consumo no registrado</SelectItem>
                          <SelectItem value="entrada_no_registrada">Entrada no registrada</SelectItem>
                          <SelectItem value="merma_vencimiento">Merma por vencimiento</SelectItem>
                          <SelectItem value="rotura_dano">Rotura o daño</SelectItem>
                          <SelectItem value="error_conteo">Error de conteo</SelectItem>
                          <SelectItem value="otros">Otros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adjObservaciones">Observaciones</Label>
                      <Textarea
                        id="adjObservaciones"
                        value={adjustmentData.observaciones}
                        onChange={(e) => setAdjustmentData({...adjustmentData, observaciones: e.target.value})}
                        placeholder="Detalles adicionales del ajuste"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAdjustmentDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      Registrar Ajuste
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Stock Sistema</TableHead>
                  <TableHead>Stock Físico</TableHead>
                  <TableHead>Diferencia</TableHead>
                  <TableHead>Valor Impacto</TableHead>
                  <TableHead>Causa</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {differences.map((difference) => (
                  <TableRow key={difference.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{difference.producto}</p>
                        <p className="text-sm text-muted-foreground font-mono">{difference.codigo}</p>
                        <p className="text-xs text-muted-foreground">{difference.conciliacion}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{difference.stockSistema}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{difference.stockFisico}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {difference.diferencia > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`font-medium ${difference.diferencia > 0 ? "text-green-600" : "text-red-600"}`}>
                          {difference.diferencia > 0 ? "+" : ""}{difference.diferencia}
                        </span>
                      </div>
                      <Badge variant={getDifferenceVariant(difference.tipo)} className="mt-1">
                        {difference.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className={`font-medium ${difference.valorDiferencia > 0 ? "text-green-600" : "text-red-600"}`}>
                        ${difference.valorDiferencia.toLocaleString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{difference.causa}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={difference.estado === "Ajustado" ? "default" : "secondary"}>
                        {difference.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {difference.estado === "Pendiente" && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleApproveAdjustment(difference.id)}>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleRejectAdjustment(difference.id)}>
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reportes de Conciliación</CardTitle>
                <CardDescription>
                  Genere reportes detallados de las conciliaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Reporte Trimestral</p>
                    <p className="text-sm text-muted-foreground">Resumen de todas las conciliaciones</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Análisis de Diferencias</p>
                    <p className="text-sm text-muted-foreground">Detalle de discrepancias encontradas</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Indicadores de Precisión</p>
                    <p className="text-sm text-muted-foreground">Métricas de calidad del inventario</p>
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
                <CardTitle>Indicadores de Gestión</CardTitle>
                <CardDescription>
                  Métricas de desempeño del inventario
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Precisión Promedio</span>
                  <span className="font-medium text-green-600">94.7%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo Promedio por Item</span>
                  <span className="font-medium">2.3 min</span>
                </div>
                <div className="flex justify-between">
                  <span>Diferencias Resueltas</span>
                  <span className="font-medium text-blue-600">89%</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor de Ajustes</span>
                  <span className="font-medium text-orange-600">0.8% del total</span>
                </div>
                <div className="flex justify-between">
                  <span>Frecuencia de Conciliación</span>
                  <span className="font-medium">Mensual</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}