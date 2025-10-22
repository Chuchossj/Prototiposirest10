import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { 
  Plus, 
  Search, 
  MapPin,
  Building,
  Package,
  Edit,
  Trash2,
  Eye,
  QrCode,
  Move,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export function LocationsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  const [locationData, setLocationData] = useState({
    codigo: "",
    nombre: "",
    tipo: "",
    area: "",
    capacidad: "",
    responsable: "",
    descripcion: "",
    estado: "Activo"
  });

  const [assignData, setAssignData] = useState({
    producto: "",
    ubicacionOrigen: "",
    ubicacionDestino: "",
    cantidad: "",
    motivo: ""
  });

  const locations = [
    {
      id: 1,
      codigo: "A001",
      nombre: "Almacén Principal de Insumos",
      tipo: "Almacén",
      area: "Cocina",
      capacidad: "500 m³",
      responsable: "Ana García",
      estado: "Activo",
      bienes: 145,
      valorTotal: 45000000,
      descripcion: "Almacén principal para insumos de cocina y materias primas",
      ultimaInspeccion: "2025-01-10",
      temperatura: "18-22°C",
      humedad: "45-55%"
    },
    {
      id: 2,
      codigo: "B002",
      nombre: "Depósito de Harinas y Cereales",
      tipo: "Almacén Especializado",
      area: "Panadería",
      capacidad: "200 m³",
      responsable: "Carlos López",
      estado: "Activo",
      bienes: 87,
      valorTotal: 28000000,
      descripcion: "Depósito especializado para harinas, cereales y productos de panadería",
      ultimaInspeccion: "2025-01-12",
      temperatura: "15-20°C",
      humedad: "40-50%"
    },
    {
      id: 3,
      codigo: "C001",
      nombre: "Bodega de Utensilios y Vajillas",
      tipo: "Bodega",
      area: "Barismo",
      capacidad: "150 m³",
      responsable: "María Rodríguez",
      estado: "Activo",
      bienes: 230,
      valorTotal: 15000000,
      descripcion: "Bodega para almacenamiento de utensilios, vajillas y equipos menores",
      ultimaInspeccion: "2025-01-08",
      temperatura: "Ambiente",
      humedad: "< 60%"
    },
    {
      id: 4,
      codigo: "D001",
      nombre: "Depósito de Equipos Especializados",
      tipo: "Almacén de Equipos",
      area: "General",
      capacidad: "300 m³",
      responsable: "Juan Pérez",
      estado: "Activo",
      bienes: 45,
      valorTotal: 75000000,
      descripcion: "Almacén para equipos industriales y maquinaria especializada",
      ultimaInspeccion: "2025-01-15",
      temperatura: "Controlada",
      humedad: "< 50%"
    },
    {
      id: 5,
      codigo: "E001",
      nombre: "Cuarto Frío",
      tipo: "Almacén Refrigerado",
      area: "Cocina",
      capacidad: "50 m³",
      responsable: "Sofia Martín",
      estado: "Mantenimiento",
      bienes: 25,
      valorTotal: 8000000,
      descripcion: "Cámara frigorífica para productos perecederos",
      ultimaInspeccion: "2025-01-05",
      temperatura: "2-4°C",
      humedad: "85-90%"
    }
  ];

  const assignments = [
    {
      id: 1,
      producto: "Licuadora Industrial 5L",
      codigo: "LIN004",
      ubicacionActual: "D001",
      nombreUbicacion: "Depósito de Equipos Especializados",
      fechaAsignacion: "2025-01-10",
      responsable: "Juan Pérez",
      estado: "Asignado",
      motivo: "Uso en cocina principal"
    },
    {
      id: 2,
      producto: "Tazas de Porcelana Premium",
      codigo: "TCP003",
      ubicacionActual: "C001",
      nombreUbicacion: "Bodega de Utensilios y Vajillas",
      fechaAsignacion: "2025-01-12",
      responsable: "María Rodríguez",
      estado: "Asignado",
      motivo: "Stock de vajilla para barismo"
    }
  ];

  const areas = ["Cocina", "Panadería", "Barismo", "Pastelería", "General", "Administración"];
  const tipos = ["Almacén", "Almacén Especializado", "Bodega", "Almacén de Equipos", "Almacén Refrigerado", "Oficina"];
  const estados = ["Activo", "Inactivo", "Mantenimiento", "Remodelación"];

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || location.tipo === selectedType;
    return matchesSearch && matchesType;
  });

  const totalLocations = locations.length;
  const activeLocations = locations.filter(loc => loc.estado === "Activo").length;
  const totalGoods = locations.reduce((sum, loc) => sum + loc.bienes, 0);
  const totalValue = locations.reduce((sum, loc) => sum + loc.valorTotal, 0);

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLocation) {
      toast.success("Ubicación actualizada exitosamente");
    } else {
      toast.success("Nueva ubicación creada exitosamente");
    }
    setIsLocationDialogOpen(false);
    setEditingLocation(null);
    setLocationData({
      codigo: "",
      nombre: "",
      tipo: "",
      area: "",
      capacidad: "",
      responsable: "",
      descripcion: "",
      estado: "Activo"
    });
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Producto reasignado exitosamente");
    setIsAssignDialogOpen(false);
    setAssignData({
      producto: "",
      ubicacionOrigen: "",
      ubicacionDestino: "",
      cantidad: "",
      motivo: ""
    });
  };

  const handleEdit = (location: any) => {
    setEditingLocation(location);
    setLocationData({
      codigo: location.codigo,
      nombre: location.nombre,
      tipo: location.tipo,
      area: location.area,
      capacidad: location.capacidad,
      responsable: location.responsable,
      descripcion: location.descripcion,
      estado: location.estado
    });
    setIsLocationDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    toast.success("Ubicación eliminada exitosamente");
  };

  const getStatusVariant = (estado: string) => {
    switch (estado) {
      case "Activo": return "default" as const;
      case "Inactivo": return "secondary" as const;
      case "Mantenimiento": return "destructive" as const;
      case "Remodelación": return "outline" as const;
      default: return "outline" as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Ubicaciones Físicas</h1>
          <p className="text-muted-foreground">
            Gestión de ubicaciones y ambientes específicos del centro de formación
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Move className="h-4 w-4 mr-2" />
                Reasignar Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Reasignar Producto a Ubicación</DialogTitle>
                <DialogDescription>
                  Mueva un producto entre ubicaciones
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAssignSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignProducto">Producto a Reasignar *</Label>
                    <Input
                      id="assignProducto"
                      value={assignData.producto}
                      onChange={(e) => setAssignData({...assignData, producto: e.target.value})}
                      placeholder="Código o nombre del producto"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignOrigen">Ubicación Origen *</Label>
                    <Select value={assignData.ubicacionOrigen} onValueChange={(value) => setAssignData({...assignData, ubicacionOrigen: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar origen" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(location => (
                          <SelectItem key={location.codigo} value={location.codigo}>
                            {location.codigo} - {location.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignDestino">Ubicación Destino *</Label>
                    <Select value={assignData.ubicacionDestino} onValueChange={(value) => setAssignData({...assignData, ubicacionDestino: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar destino" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(location => (
                          <SelectItem key={location.codigo} value={location.codigo}>
                            {location.codigo} - {location.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignCantidad">Cantidad *</Label>
                    <Input
                      id="assignCantidad"
                      type="number"
                      value={assignData.cantidad}
                      onChange={(e) => setAssignData({...assignData, cantidad: e.target.value})}
                      placeholder="Cantidad a reasignar"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignMotivo">Motivo *</Label>
                    <Textarea
                      id="assignMotivo"
                      value={assignData.motivo}
                      onChange={(e) => setAssignData({...assignData, motivo: e.target.value})}
                      placeholder="Justificación de la reasignación"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Reasignar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Ubicación
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingLocation ? "Editar Ubicación" : "Crear Nueva Ubicación"}
                </DialogTitle>
                <DialogDescription>
                  Configure los detalles de la ubicación física
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleLocationSubmit}>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código de Ubicación *</Label>
                    <Input
                      id="codigo"
                      value={locationData.codigo}
                      onChange={(e) => setLocationData({...locationData, codigo: e.target.value})}
                      placeholder="Ej: A001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre de la Ubicación *</Label>
                    <Input
                      id="nombre"
                      value={locationData.nombre}
                      onChange={(e) => setLocationData({...locationData, nombre: e.target.value})}
                      placeholder="Ej: Almacén Principal"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Ubicación *</Label>
                    <Select value={locationData.tipo} onValueChange={(value) => setLocationData({...locationData, tipo: value})}>
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
                    <Label htmlFor="area">Área de Formación *</Label>
                    <Select value={locationData.area} onValueChange={(value) => setLocationData({...locationData, area: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar área" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map(area => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacidad">Capacidad</Label>
                    <Input
                      id="capacidad"
                      value={locationData.capacidad}
                      onChange={(e) => setLocationData({...locationData, capacidad: e.target.value})}
                      placeholder="Ej: 500 m³"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsable">Responsable *</Label>
                    <Input
                      id="responsable"
                      value={locationData.responsable}
                      onChange={(e) => setLocationData({...locationData, responsable: e.target.value})}
                      placeholder="Nombre del responsable"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select value={locationData.estado} onValueChange={(value) => setLocationData({...locationData, estado: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {estados.map(estado => (
                          <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={locationData.descripcion}
                      onChange={(e) => setLocationData({...locationData, descripcion: e.target.value})}
                      placeholder="Descripción detallada de la ubicación y su propósito"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsLocationDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingLocation ? "Actualizar" : "Crear"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estadísticas de ubicaciones */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ubicaciones</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLocations}</div>
            <p className="text-xs text-muted-foreground">
              Espacios configurados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ubicaciones Activas</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLocations}</div>
            <p className="text-xs text-muted-foreground">
              {((activeLocations / totalLocations) * 100).toFixed(0)}% operativas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bienes Almacenados</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGoods.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Items en ubicaciones
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              Valor inventario
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de ubicaciones */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Ubicaciones Registradas</CardTitle>
              <CardDescription>
                Gestión de espacios físicos y ambientes de formación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre o código..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tipo de ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {tipos.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Área</TableHead>
                      <TableHead>Capacidad</TableHead>
                      <TableHead>Bienes</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLocations.map((location) => (
                      <TableRow key={location.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{location.nombre}</p>
                            <p className="text-sm text-muted-foreground font-mono">{location.codigo}</p>
                            <p className="text-xs text-muted-foreground">{location.tipo}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge variant="outline">{location.area}</Badge>
                            <p className="text-sm text-muted-foreground mt-1">{location.responsable}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{location.capacidad}</p>
                            <p className="text-xs text-muted-foreground">
                              Inspección: {location.ultimaInspeccion}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{location.bienes} items</p>
                            <p className="text-sm text-muted-foreground">
                              ${(location.valorTotal / 1000000).toFixed(1)}M
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(location.estado)}>
                            {location.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(location)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <QrCode className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(location.id)}>
                              <Trash2 className="h-4 w-4" />
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
        </div>

        {/* Panel lateral con asignaciones */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Asignaciones Recientes</CardTitle>
              <CardDescription>
                Últimos movimientos entre ubicaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{assignment.producto}</p>
                      <Badge variant="outline">{assignment.estado}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Código: {assignment.codigo}</p>
                      <p>Ubicación: {assignment.ubicacionActual}</p>
                      <p>Fecha: {assignment.fechaAsignacion}</p>
                      <p>Responsable: {assignment.responsable}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Distribución por Área</CardTitle>
              <CardDescription>
                Bienes por área de formación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {areas.map((area) => {
                  const areaLocations = locations.filter(loc => loc.area === area);
                  const areaGoods = areaLocations.reduce((sum, loc) => sum + loc.bienes, 0);
                  return (
                    <div key={area} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{area}</p>
                        <p className="text-sm text-muted-foreground">
                          {areaLocations.length} ubicaciones
                        </p>
                      </div>
                      <Badge variant="secondary">{areaGoods} items</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}