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
import { Separator } from "./ui/separator";
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Edit
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export function RequestsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [formData, setFormData] = useState({
    // Información del solicitante
    solicitante: "",
    cedula: "",
    cargo: "",
    dependencia: "",
    centroCosto: "",
    telefono: "",
    email: "",
    
    // Información de la solicitud
    fechaSolicitud: new Date().toISOString().split('T')[0],
    tipoSolicitud: "",
    prioridad: "",
    fechaRequerida: "",
    
    // Justificación
    justificacion: "",
    objetivoUso: "",
    
    // Aprobaciones
    jefeDependencia: "",
    coordinadorInventario: "",
    
    // Items solicitados se manejan por separado
    items: []
  });

  const [itemData, setItemData] = useState({
    codigo: "",
    descripcion: "",
    cantidad: "",
    unidad: "",
    justificacionItem: "",
    urgencia: "Normal"
  });

  const requests = [
    {
      id: "SOL-2025-001",
      fecha: "2025-01-15",
      solicitante: "María González",
      dependencia: "Cocina Principal",
      centroCosto: "CC-001",
      tipoSolicitud: "Suministros de Cocina",
      prioridad: "Alta",
      estado: "Pendiente Aprobación",
      items: 3,
      valorEstimado: 450000,
      jefeDependencia: "Carlos Rodríguez",
      coordinadorInventario: "Ana López",
      aprobacionJefe: "Pendiente",
      aprobacionInventario: "Pendiente",
      fechaRequerida: "2025-01-20",
      justificacion: "Reposición de utensilios dañados durante práctica de estudiantes"
    },
    {
      id: "SOL-2025-002",
      fecha: "2025-01-14",
      solicitante: "Juan Pérez",
      dependencia: "Barismo",
      centroCosto: "CC-002",
      tipoSolicitud: "Equipos Especializados",
      prioridad: "Media",
      estado: "Aprobada",
      items: 2,
      valorEstimado: 1200000,
      jefeDependencia: "Luis Martínez",
      coordinadorInventario: "Ana López",
      aprobacionJefe: "Aprobada",
      aprobacionInventario: "Aprobada",
      fechaRequerida: "2025-01-25",
      justificacion: "Ampliación de equipos para nuevo programa de barismo avanzado"
    },
    {
      id: "SOL-2025-003",
      fecha: "2025-01-13",
      solicitante: "Sofia Martín",
      dependencia: "Panadería",
      centroCosto: "CC-003",
      tipoSolicitud: "Materia Prima",
      prioridad: "Media",
      estado: "Rechazada",
      items: 5,
      valorEstimado: 280000,
      jefeDependencia: "Pedro García",
      coordinadorInventario: "Ana López",
      aprobacionJefe: "Aprobada",
      aprobacionInventario: "Rechazada",
      fechaRequerida: "2025-01-18",
      justificacion: "Ingredientes especiales para práctica de repostería francesa",
      observacionRechazo: "Presupuesto insuficiente para el trimestre"
    },
    {
      id: "SOL-2025-004",
      fecha: "2025-01-12",
      solicitante: "Diego Herrera",
      dependencia: "Pastelería",
      centroCosto: "CC-004",
      tipoSolicitud: "Utensilios",
      prioridad: "Baja",
      estado: "En Proceso",
      items: 4,
      valorEstimado: 320000,
      jefeDependencia: "Carmen López",
      coordinadorInventario: "Ana López",
      aprobacionJefe: "Aprobada",
      aprobacionInventario: "Aprobada",
      fechaRequerida: "2025-01-30",
      justificacion: "Renovación de moldes y herramientas para técnicas modernas"
    },
    {
      id: "SOL-2025-005",
      fecha: "2025-01-10",
      solicitante: "Elena Vargas",
      dependencia: "Administración",
      centroCosto: "CC-005",
      tipoSolicitud: "Papelería y Oficina",
      prioridad: "Baja",
      estado: "Completada",
      items: 8,
      valorEstimado: 150000,
      jefeDependencia: "Roberto Silva",
      coordinadorInventario: "Ana López",
      aprobacionJefe: "Aprobada",
      aprobacionInventario: "Aprobada",
      fechaRequerida: "2025-01-15",
      justificacion: "Suministros de oficina para actividades administrativas del trimestre"
    }
  ];

  const tiposSolicitud = [
    "Suministros de Cocina",
    "Equipos Especializados", 
    "Materia Prima",
    "Utensilios",
    "Papelería y Oficina",
    "Mantenimiento",
    "Otros"
  ];

  const dependencias = [
    "Cocina Principal",
    "Barismo",
    "Panadería", 
    "Pastelería",
    "Administración",
    "Coordinación Académica",
    "Servicios Generales"
  ];

  const unidades = ["Unidad", "Kilogramo", "Litro", "Metro", "Caja", "Paquete", "Set"];

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.dependencia.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || request.estado === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const addItem = () => {
    if (itemData.codigo && itemData.descripcion && itemData.cantidad) {
      setSelectedItems([...selectedItems, {
        ...itemData,
        id: Date.now()
      }]);
      setItemData({
        codigo: "",
        descripcion: "",
        cantidad: "",
        unidad: "",
        justificacionItem: "",
        urgencia: "Normal"
      });
    }
  };

  const removeItem = (id: number) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      toast.error("Debe agregar al menos un ítem a la solicitud");
      return;
    }
    
    toast.success("Solicitud enviada exitosamente. Se notificará al jefe de dependencia para aprobación.");
    setIsDialogOpen(false);
    setFormData({
      solicitante: "",
      cedula: "",
      cargo: "",
      dependencia: "",
      centroCosto: "",
      telefono: "",
      email: "",
      fechaSolicitud: new Date().toISOString().split('T')[0],
      tipoSolicitud: "",
      prioridad: "",
      fechaRequerida: "",
      justificacion: "",
      objetivoUso: "",
      jefeDependencia: "",
      coordinadorInventario: "",
      items: []
    });
    setSelectedItems([]);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Aprobada":
      case "Completada":
        return "default";
      case "Pendiente Aprobación":
      case "En Proceso":
        return "secondary";
      case "Rechazada":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprobada":
      case "Completada":
        return <CheckCircle className="h-3 w-3 mr-1 text-green-600" />;
      case "Pendiente Aprobación":
      case "En Proceso":
        return <Clock className="h-3 w-3 mr-1 text-orange-600" />;
      case "Rechazada":
        return <XCircle className="h-3 w-3 mr-1 text-red-600" />;
      default:
        return <AlertCircle className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Solicitudes de Bienes</h1>
          <p className="text-muted-foreground">
            Formulario oficial del SENA para solicitud de bienes por cuentadantes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Solicitud
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Formato Oficial - Solicitud de Bienes SENA</DialogTitle>
              <DialogDescription>
                Complete todos los campos requeridos según el formato institucional
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Encabezado institucional */}
                <div className="text-center py-4 border-b">
                  <h3 className="font-bold">SERVICIO NACIONAL DE APRENDIZAJE - SENA</h3>
                  <h4 className="font-medium">FORMATO DE SOLICITUD DE BIENES</h4>
                  <p className="text-sm text-muted-foreground">Centro de Formación - Gestión de Inventarios</p>
                </div>

                {/* Información del solicitante */}
                <div>
                  <h4 className="font-medium mb-4">1. INFORMACIÓN DEL SOLICITANTE</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="solicitante">Nombre Completo *</Label>
                      <Input
                        id="solicitante"
                        value={formData.solicitante}
                        onChange={(e) => setFormData({...formData, solicitante: e.target.value})}
                        placeholder="Nombres y apellidos"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cedula">Cédula de Ciudadanía *</Label>
                      <Input
                        id="cedula"
                        value={formData.cedula}
                        onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                        placeholder="Número de cédula"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cargo">Cargo *</Label>
                      <Input
                        id="cargo"
                        value={formData.cargo}
                        onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                        placeholder="Instructor, Coordinador, etc."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dependencia">Dependencia *</Label>
                      <Select value={formData.dependencia} onValueChange={(value) => setFormData({...formData, dependencia: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar dependencia" />
                        </SelectTrigger>
                        <SelectContent>
                          {dependencias.map(dep => (
                            <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="centroCosto">Centro de Costo *</Label>
                      <Input
                        id="centroCosto"
                        value={formData.centroCosto}
                        onChange={(e) => setFormData({...formData, centroCosto: e.target.value})}
                        placeholder="Ej: CC-001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                        placeholder="Número de contacto"
                        required
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="email">Correo Electrónico Institucional *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="nombre@sena.edu.co"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Información de la solicitud */}
                <div>
                  <h4 className="font-medium mb-4">2. INFORMACIÓN DE LA SOLICITUD</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fechaSolicitud">Fecha de Solicitud</Label>
                      <Input
                        id="fechaSolicitud"
                        type="date"
                        value={formData.fechaSolicitud}
                        onChange={(e) => setFormData({...formData, fechaSolicitud: e.target.value})}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fechaRequerida">Fecha Requerida *</Label>
                      <Input
                        id="fechaRequerida"
                        type="date"
                        value={formData.fechaRequerida}
                        onChange={(e) => setFormData({...formData, fechaRequerida: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipoSolicitud">Tipo de Solicitud *</Label>
                      <Select value={formData.tipoSolicitud} onValueChange={(value) => setFormData({...formData, tipoSolicitud: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposSolicitud.map(tipo => (
                            <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prioridad">Prioridad *</Label>
                      <Select value={formData.prioridad} onValueChange={(value) => setFormData({...formData, prioridad: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Media">Media</SelectItem>
                          <SelectItem value="Baja">Baja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Justificación */}
                <div>
                  <h4 className="font-medium mb-4">3. JUSTIFICACIÓN DE LA SOLICITUD</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="justificacion">Justificación Detallada *</Label>
                      <Textarea
                        id="justificacion"
                        value={formData.justificacion}
                        onChange={(e) => setFormData({...formData, justificacion: e.target.value})}
                        placeholder="Describa detalladamente la necesidad y justificación de los bienes solicitados"
                        rows={4}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="objetivoUso">Objetivo de Uso *</Label>
                      <Textarea
                        id="objetivoUso"
                        value={formData.objetivoUso}
                        onChange={(e) => setFormData({...formData, objetivoUso: e.target.value})}
                        placeholder="Especifique el uso específico que se dará a los bienes solicitados"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Bienes solicitados */}
                <div>
                  <h4 className="font-medium mb-4">4. BIENES SOLICITADOS</h4>
                  
                  {/* Formulario para agregar items */}
                  <div className="grid grid-cols-6 gap-4 mb-4 p-4 border rounded-lg bg-muted/50">
                    <div className="space-y-2">
                      <Label htmlFor="itemCodigo">Código</Label>
                      <Input
                        id="itemCodigo"
                        value={itemData.codigo}
                        onChange={(e) => setItemData({...itemData, codigo: e.target.value})}
                        placeholder="Código"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="itemDescripcion">Descripción</Label>
                      <Input
                        id="itemDescripcion"
                        value={itemData.descripcion}
                        onChange={(e) => setItemData({...itemData, descripcion: e.target.value})}
                        placeholder="Descripción del bien"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemCantidad">Cantidad</Label>
                      <Input
                        id="itemCantidad"
                        type="number"
                        value={itemData.cantidad}
                        onChange={(e) => setItemData({...itemData, cantidad: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemUnidad">Unidad</Label>
                      <Select value={itemData.unidad} onValueChange={(value) => setItemData({...itemData, unidad: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Unidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {unidades.map(unidad => (
                            <SelectItem key={unidad} value={unidad}>{unidad}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemUrgencia">Urgencia</Label>
                      <Select value={itemData.urgencia} onValueChange={(value) => setItemData({...itemData, urgencia: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Baja">Baja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-6">
                      <Button type="button" onClick={addItem} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Ítem
                      </Button>
                    </div>
                  </div>

                  {/* Lista de items agregados */}
                  {selectedItems.length > 0 && (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Unidad</TableHead>
                            <TableHead>Urgencia</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-mono">{item.codigo}</TableCell>
                              <TableCell>{item.descripcion}</TableCell>
                              <TableCell>{item.cantidad}</TableCell>
                              <TableCell>{item.unidad}</TableCell>
                              <TableCell>
                                <Badge variant={item.urgencia === "Alta" ? "destructive" : "outline"}>
                                  {item.urgencia}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Información de aprobaciones */}
                <div>
                  <h4 className="font-medium mb-4">5. APROBACIONES REQUERIDAS</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jefeDependencia">Jefe de Dependencia *</Label>
                      <Input
                        id="jefeDependencia"
                        value={formData.jefeDependencia}
                        onChange={(e) => setFormData({...formData, jefeDependencia: e.target.value})}
                        placeholder="Nombre del jefe inmediato"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coordinadorInventario">Coordinador de Inventario</Label>
                      <Input
                        id="coordinadorInventario"
                        value={formData.coordinadorInventario}
                        onChange={(e) => setFormData({...formData, coordinadorInventario: e.target.value})}
                        placeholder="Se asignará automáticamente"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Declaración */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    <strong>DECLARACIÓN:</strong> Declaro que la información suministrada es veraz y que los bienes solicitados 
                    son necesarios para el cumplimiento de las actividades asignadas. Me comprometo a hacer uso adecuado de los 
                    mismos según los lineamientos institucionales del SENA.
                  </p>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Enviar Solicitud
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solicitudes</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Por aprobar
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              64% del total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8.4M</div>
            <p className="text-xs text-muted-foreground">
              Aprobado este mes
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Solicitudes</CardTitle>
          <CardDescription>
            Seguimiento y estado de todas las solicitudes de bienes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código, solicitante o dependencia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="Pendiente Aprobación">Pendiente Aprobación</SelectItem>
                <SelectItem value="Aprobada">Aprobada</SelectItem>
                <SelectItem value="En Proceso">En Proceso</SelectItem>
                <SelectItem value="Completada">Completada</SelectItem>
                <SelectItem value="Rechazada">Rechazada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Solicitud</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Dependencia</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Aprobaciones</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-mono font-medium">{request.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.fecha} • {request.tipoSolicitud}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{request.solicitante}</p>
                          <p className="text-sm text-muted-foreground">{request.centroCosto}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{request.dependencia}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.items} items</p>
                        <Badge variant={request.prioridad === "Alta" ? "destructive" : "outline"} className="text-xs">
                          {request.prioridad}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">${request.valorEstimado.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Estimado</p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-xs">
                          {request.aprobacionJefe === "Aprobada" ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : request.aprobacionJefe === "Rechazada" ? (
                            <XCircle className="h-3 w-3 text-red-600" />
                          ) : (
                            <Clock className="h-3 w-3 text-orange-600" />
                          )}
                          <span>Jefe Dep.</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs">
                          {request.aprobacionInventario === "Aprobada" ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : request.aprobacionInventario === "Rechazada" ? (
                            <XCircle className="h-3 w-3 text-red-600" />
                          ) : (
                            <Clock className="h-3 w-3 text-orange-600" />
                          )}
                          <span>Inventario</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(request.estado)}>
                        {getStatusIcon(request.estado)}
                        {request.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {request.estado === "Pendiente Aprobación" && (
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
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
    </div>
  );
}