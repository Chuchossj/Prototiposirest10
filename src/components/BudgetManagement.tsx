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
import { Chart } from "./ui/chart";
import { 
  Plus, 
  Search, 
  Filter, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  PieChart,
  BarChart3,
  Target,
  Edit,
  Download,
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export function BudgetManagement() {
  const [selectedPeriod, setSelectedPeriod] = useState("2025-Q1");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);

  const [expenseData, setExpenseData] = useState({
    categoria: "",
    subcategoria: "",
    descripcion: "",
    valorEstimado: "",
    fechaRequerida: "",
    prioridad: "",
    justificacion: "",
    proveedor: "",
    centroCosto: ""
  });

  const [budgetData, setBudgetData] = useState({
    periodo: "",
    categoria: "",
    presupuestoAsignado: "",
    observaciones: ""
  });

  // Datos del presupuesto por categorías
  const budgetCategories = [
    {
      categoria: "Insumos de Cocina",
      presupuestoTotal: 25000000,
      ejecutado: 16250000,
      comprometido: 3500000,
      disponible: 5250000,
      porcentajeEjecutado: 65,
      alertas: 2,
      ultimaCompra: "2025-01-15"
    },
    {
      categoria: "Equipos Especializados",
      presupuestoTotal: 35000000,
      ejecutado: 28000000,
      comprometido: 5000000,
      disponible: 2000000,
      porcentajeEjecutado: 80,
      alertas: 1,
      ultimaCompra: "2025-01-10"
    },
    {
      categoria: "Materia Prima",
      presupuestoTotal: 18000000,
      ejecutado: 9720000,
      comprometido: 2800000,
      disponible: 5480000,
      porcentajeEjecutado: 54,
      alertas: 0,
      ultimaCompra: "2025-01-14"
    },
    {
      categoria: "Utensilios",
      presupuestoTotal: 12000000,
      ejecutado: 8400000,
      comprometido: 1200000,
      disponible: 2400000,
      porcentajeEjecutado: 70,
      alertas: 0,
      ultimaCompra: "2025-01-12"
    },
    {
      categoria: "Mantenimiento",
      presupuestoTotal: 8000000,
      ejecutado: 3200000,
      comprometido: 1600000,
      disponible: 3200000,
      porcentajeEjecutado: 40,
      alertas: 0,
      ultimaCompra: "2025-01-08"
    }
  ];

  // Planificación de compras
  const plannedExpenses = [
    {
      id: 1,
      categoria: "Equipos Especializados",
      descripcion: "Horno Industrial para Panadería",
      valorEstimado: 4500000,
      fechaRequerida: "2025-02-15",
      prioridad: "Alta",
      estado: "Planificada",
      proveedor: "Equipos Profesionales Ltda.",
      centroCosto: "CC-003",
      aprobacion: "Pendiente"
    },
    {
      id: 2,
      categoria: "Insumos de Cocina",
      descripcion: "Aceites y Condimentos Especiales",
      valorEstimado: 850000,
      fechaRequerida: "2025-01-25",
      prioridad: "Media",
      estado: "Aprobada",
      proveedor: "Distribuidora Gourmet S.A.",
      centroCosto: "CC-001",
      aprobacion: "Aprobada"
    },
    {
      id: 3,
      categoria: "Materia Prima",
      descripcion: "Harinas Especializadas",
      valorEstimado: 1200000,
      fechaRequerida: "2025-02-01",
      prioridad: "Media",
      estado: "En Evaluación",
      proveedor: "Molinos del Valle Ltda.",
      centroCosto: "CC-003",
      aprobacion: "Pendiente"
    },
    {
      id: 4,
      categoria: "Utensilios",
      descripcion: "Vajilla Nueva para Barismo",
      valorEstimado: 650000,
      fechaRequerida: "2025-02-10",
      prioridad: "Baja",
      estado: "Planificada",
      proveedor: "Vajillas y Más S.A.S.",
      centroCosto: "CC-002",
      aprobacion: "Pendiente"
    }
  ];

  // Historial de ejecución mensual
  const monthlyExecution = [
    { mes: "Oct 2024", presupuesto: 98000000, ejecutado: 89200000, porcentaje: 91 },
    { mes: "Nov 2024", presupuesto: 98000000, ejecutado: 92400000, porcentaje: 94 },
    { mes: "Dic 2024", presupuesto: 98000000, ejecutado: 95600000, porcentaje: 98 },
    { mes: "Ene 2025", presupuesto: 98000000, ejecutado: 65570000, porcentaje: 67 }
  ];

  const categories = ["Insumos de Cocina", "Equipos Especializados", "Materia Prima", "Utensilios", "Mantenimiento", "Papelería", "Otros"];
  const priorities = ["Alta", "Media", "Baja"];
  const periods = ["2025-Q1", "2025-Q2", "2025-Q3", "2025-Q4", "2024-Q4"];

  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.presupuestoTotal, 0);
  const totalExecuted = budgetCategories.reduce((sum, cat) => sum + cat.ejecutado, 0);
  const totalCommitted = budgetCategories.reduce((sum, cat) => sum + cat.comprometido, 0);
  const totalAvailable = budgetCategories.reduce((sum, cat) => sum + cat.disponible, 0);

  const filteredCategories = selectedCategory === "all" 
    ? budgetCategories 
    : budgetCategories.filter(cat => cat.categoria === selectedCategory);

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Gasto planificado agregado exitosamente");
    setIsDialogOpen(false);
    setExpenseData({
      categoria: "",
      subcategoria: "",
      descripcion: "",
      valorEstimado: "",
      fechaRequerida: "",
      prioridad: "",
      justificacion: "",
      proveedor: "",
      centroCosto: ""
    });
  };

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Presupuesto actualizado exitosamente");
    setIsBudgetDialogOpen(false);
    setBudgetData({
      periodo: "",
      categoria: "",
      presupuestoAsignado: "",
      observaciones: ""
    });
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-orange-600";
    return "text-green-600";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Presupuesto General de Inventario</h1>
          <p className="text-muted-foreground">
            Planificación de compras, asignación de recursos y control de gastos
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map(period => (
                <SelectItem key={period} value={period}>{period}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Asignar Presupuesto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Asignar Presupuesto por Categoría</DialogTitle>
                <DialogDescription>
                  Configure el presupuesto para una categoría específica
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleBudgetSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="budgetPeriodo">Período *</Label>
                    <Select value={budgetData.periodo} onValueChange={(value) => setBudgetData({...budgetData, periodo: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar período" />
                      </SelectTrigger>
                      <SelectContent>
                        {periods.map(period => (
                          <SelectItem key={period} value={period}>{period}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetCategoria">Categoría *</Label>
                    <Select value={budgetData.categoria} onValueChange={(value) => setBudgetData({...budgetData, categoria: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetAsignado">Presupuesto Asignado *</Label>
                    <Input
                      id="budgetAsignado"
                      type="number"
                      value={budgetData.presupuestoAsignado}
                      onChange={(e) => setBudgetData({...budgetData, presupuestoAsignado: e.target.value})}
                      placeholder="25000000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetObservaciones">Observaciones</Label>
                    <Textarea
                      id="budgetObservaciones"
                      value={budgetData.observaciones}
                      onChange={(e) => setBudgetData({...budgetData, observaciones: e.target.value})}
                      placeholder="Observaciones sobre la asignación presupuestal"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsBudgetDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Asignar Presupuesto
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {/* Resumen ejecutivo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalBudget / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              Trimestre {selectedPeriod}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ejecutado</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalExecuted / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              {((totalExecuted / totalBudget) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comprometido</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalCommitted / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              {((totalCommitted / totalBudget) * 100).toFixed(1)}% reservado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponible</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalAvailable / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              {((totalAvailable / totalBudget) * 100).toFixed(1)}% libre
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen General</TabsTrigger>
          <TabsTrigger value="categories">Por Categorías</TabsTrigger>
          <TabsTrigger value="planning">Planificación</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Gráfico de ejecución presupuestal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ejecución Presupuestal por Categoría</CardTitle>
                <CardDescription>
                  Distribución del presupuesto ejecutado vs asignado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{category.categoria}</span>
                        <span className={getStatusColor(category.porcentajeEjecutado)}>
                          {category.porcentajeEjecutado}%
                        </span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={category.porcentajeEjecutado} 
                          className="h-2"
                        />
                        <div 
                          className={`absolute top-0 left-0 h-2 rounded-full ${getProgressColor(category.porcentajeEjecutado)}`}
                          style={{ width: `${category.porcentajeEjecutado}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${(category.ejecutado / 1000000).toFixed(1)}M ejecutado</span>
                        <span>${(category.presupuestoTotal / 1000000).toFixed(1)}M total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendencia Mensual</CardTitle>
                <CardDescription>
                  Ejecución presupuestal por mes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyExecution.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{month.mes}</p>
                        <p className="text-sm text-muted-foreground">
                          ${(month.ejecutado / 1000000).toFixed(1)}M / ${(month.presupuesto / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${getStatusColor(month.porcentaje)}`}>
                          {month.porcentaje}%
                        </p>
                        <Badge variant={month.porcentaje >= 90 ? "destructive" : "default"}>
                          {month.porcentaje >= 90 ? "Alto" : month.porcentaje >= 75 ? "Medio" : "Normal"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertas presupuestales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>Alertas Presupuestales</span>
              </CardTitle>
              <CardDescription>
                Categorías que requieren atención inmediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {budgetCategories
                  .filter(cat => cat.porcentajeEjecutado >= 75)
                  .map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="font-medium">{category.categoria}</p>
                          <p className="text-sm text-muted-foreground">
                            {category.porcentajeEjecutado}% ejecutado - Disponible: ${(category.disponible / 1000).toFixed(0)}K
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {category.porcentajeEjecutado >= 90 ? "Crítico" : "Atención"}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="flex space-x-4 mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Presupuesto</TableHead>
                  <TableHead>Ejecutado</TableHead>
                  <TableHead>Comprometido</TableHead>
                  <TableHead>Disponible</TableHead>
                  <TableHead>% Ejecución</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{category.categoria}</p>
                        <p className="text-sm text-muted-foreground">
                          Última compra: {category.ultimaCompra}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">${(category.presupuestoTotal / 1000000).toFixed(1)}M</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">${(category.ejecutado / 1000000).toFixed(1)}M</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">${(category.comprometido / 1000000).toFixed(1)}M</p>
                    </TableCell>
                    <TableCell>
                      <p className={`font-medium ${category.disponible < 1000000 ? "text-red-600" : "text-green-600"}`}>
                        ${(category.disponible / 1000000).toFixed(1)}M
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className={`font-medium ${getStatusColor(category.porcentajeEjecutado)}`}>
                          {category.porcentajeEjecutado}%
                        </p>
                        <Progress value={category.porcentajeEjecutado} className="w-16 h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        category.porcentajeEjecutado >= 90 ? "destructive" :
                        category.porcentajeEjecutado >= 75 ? "secondary" :
                        "default"
                      }>
                        {category.porcentajeEjecutado >= 90 ? "Crítico" :
                         category.porcentajeEjecutado >= 75 ? "Atención" :
                         "Normal"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
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

        <TabsContent value="planning" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3>Planificación de Compras</h3>
              <p className="text-sm text-muted-foreground">
                Gastos planificados y programados para el período
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Planificar Gasto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Planificar Nuevo Gasto</DialogTitle>
                  <DialogDescription>
                    Agregue un gasto planificado al presupuesto
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleExpenseSubmit}>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoría *</Label>
                      <Select value={expenseData.categoria} onValueChange={(value) => setExpenseData({...expenseData, categoria: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valorEstimado">Valor Estimado *</Label>
                      <Input
                        id="valorEstimado"
                        type="number"
                        value={expenseData.valorEstimado}
                        onChange={(e) => setExpenseData({...expenseData, valorEstimado: e.target.value})}
                        placeholder="4500000"
                        required
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="descripcion">Descripción *</Label>
                      <Input
                        id="descripcion"
                        value={expenseData.descripcion}
                        onChange={(e) => setExpenseData({...expenseData, descripcion: e.target.value})}
                        placeholder="Descripción detallada del gasto"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fechaRequerida">Fecha Requerida *</Label>
                      <Input
                        id="fechaRequerida"
                        type="date"
                        value={expenseData.fechaRequerida}
                        onChange={(e) => setExpenseData({...expenseData, fechaRequerida: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prioridad">Prioridad *</Label>
                      <Select value={expenseData.prioridad} onValueChange={(value) => setExpenseData({...expenseData, prioridad: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map(priority => (
                            <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proveedor">Proveedor</Label>
                      <Input
                        id="proveedor"
                        value={expenseData.proveedor}
                        onChange={(e) => setExpenseData({...expenseData, proveedor: e.target.value})}
                        placeholder="Proveedor estimado"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="centroCosto">Centro de Costo</Label>
                      <Input
                        id="centroCosto"
                        value={expenseData.centroCosto}
                        onChange={(e) => setExpenseData({...expenseData, centroCosto: e.target.value})}
                        placeholder="CC-001"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="justificacion">Justificación</Label>
                      <Textarea
                        id="justificacion"
                        value={expenseData.justificacion}
                        onChange={(e) => setExpenseData({...expenseData, justificacion: e.target.value})}
                        placeholder="Justificación del gasto planificado"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      Planificar Gasto
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
                  <TableHead>Descripción</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Valor Estimado</TableHead>
                  <TableHead>Fecha Requerida</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Aprobación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plannedExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{expense.descripcion}</p>
                        <p className="text-sm text-muted-foreground">{expense.proveedor}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{expense.categoria}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">${expense.valorEstimado.toLocaleString()}</p>
                    </TableCell>
                    <TableCell>{expense.fechaRequerida}</TableCell>
                    <TableCell>
                      <Badge variant={expense.prioridad === "Alta" ? "destructive" : "outline"}>
                        {expense.prioridad}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{expense.estado}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {expense.aprobacion === "Aprobada" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-orange-600" />
                        )}
                        <span className="text-sm">{expense.aprobacion}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
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
                <CardTitle>Reportes Disponibles</CardTitle>
                <CardDescription>
                  Genere reportes detallados del presupuesto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Reporte Trimestral</p>
                    <p className="text-sm text-muted-foreground">Ejecución por categorías</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Análisis de Variaciones</p>
                    <p className="text-sm text-muted-foreground">Comparativo vs planificado</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Proyección Anual</p>
                    <p className="text-sm text-muted-foreground">Estimaciones y tendencias</p>
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
                <CardTitle>Análisis de Eficiencia</CardTitle>
                <CardDescription>
                  Métricas de gestión presupuestal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Eficiencia de Ejecución</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
                <div className="flex justify-between">
                  <span>Precisión de Planificación</span>
                  <span className="font-medium text-blue-600">87%</span>
                </div>
                <div className="flex justify-between">
                  <span>Control de Sobrecostos</span>
                  <span className="font-medium text-orange-600">3.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo Promedio Aprobación</span>
                  <span className="font-medium">2.5 días</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}