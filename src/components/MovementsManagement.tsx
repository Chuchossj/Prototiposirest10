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
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  Package,
  Calendar,
  User,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export function MovementsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  const [entryData, setEntryData] = useState({
    productCode: "",
    productName: "",
    quantity: "",
    supplier: "",
    invoiceNumber: "",
    storageLocation: "",
    unitPrice: "",
    notes: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [exitData, setExitData] = useState({
    productCode: "",
    productName: "",
    quantity: "",
    destinationArea: "",
    responsible: "",
    purpose: "",
    notes: "",
    date: new Date().toISOString().split('T')[0]
  });

  const movements = [
    {
      id: 1,
      type: "Entrada",
      productCode: "AOL001",
      productName: "Aceite de Oliva Extra Virgen",
      quantity: 24,
      unit: "Litro",
      date: "2025-01-15",
      time: "14:30",
      user: "Ana García",
      supplier: "Distribuidora Gourmet S.A.",
      invoiceNumber: "FAC-2025-001",
      destinationArea: "Almacén A001",
      responsible: "Ana García",
      unitPrice: 45000,
      totalValue: 1080000,
      notes: "Entrada por factura validada",
      status: "Completado"
    },
    {
      id: 2,
      type: "Salida",
      productCode: "HTP002",
      productName: "Harina de Trigo Premium",
      quantity: 10,
      unit: "Kilogramo",
      date: "2025-01-15",
      time: "11:45",
      user: "Carlos López",
      supplier: "",
      invoiceNumber: "",
      destinationArea: "Cocina Principal",
      responsible: "Chef María González",
      unitPrice: 25000,
      totalValue: 250000,
      notes: "Salida para preparación de pan",
      status: "Completado"
    },
    {
      id: 3,
      type: "Entrada",
      productCode: "TCP003",
      productName: "Tazas de Porcelana Premium",
      quantity: 48,
      unit: "Unidad",
      date: "2025-01-14",
      time: "16:20",
      user: "María Rodríguez",
      supplier: "Vajillas y Más S.A.S.",
      invoiceNumber: "FAC-2025-003",
      destinationArea: "Almacén C001",
      responsible: "María Rodríguez",
      unitPrice: 15000,
      totalValue: 720000,
      notes: "Nueva vajilla para barismo",
      status: "Completado"
    },
    {
      id: 4,
      type: "Salida",
      productCode: "AZR005",
      productName: "Azúcar Refinada",
      quantity: 5,
      unit: "Kilogramo",
      date: "2025-01-14",
      time: "09:15",
      user: "Juan Pérez",
      supplier: "",
      invoiceNumber: "",
      destinationArea: "Barismo",
      responsible: "Barista Ana López",
      unitPrice: 12000,
      totalValue: 60000,
      notes: "Consumo diario barismo",
      status: "Completado"
    },
    {
      id: 5,
      type: "Entrada",
      productCode: "LIN004",
      productName: "Licuadora Industrial 5L",
      quantity: 2,
      unit: "Unidad",
      date: "2025-01-13",
      time: "13:00",
      user: "Sofia Martín",
      supplier: "Equipos Profesionales Ltda.",
      invoiceNumber: "FAC-2025-002",
      destinationArea: "Almacén D001",
      responsible: "Sofia Martín",
      unitPrice: 850000,
      totalValue: 1700000,
      notes: "Equipos nuevos para cocina",
      status: "Pendiente Verificación"
    }
  ];

  const products = [
    { code: "AOL001", name: "Aceite de Oliva Extra Virgen", stock: 25, unit: "Litro" },
    { code: "HTP002", name: "Harina de Trigo Premium", stock: 15, unit: "Kilogramo" },
    { code: "TCP003", name: "Tazas de Porcelana Premium", stock: 48, unit: "Unidad" },
    { code: "AZR005", name: "Azúcar Refinada", stock: 35, unit: "Kilogramo" },
    { code: "LIN004", name: "Licuadora Industrial 5L", stock: 3, unit: "Unidad" }
  ];

  const suppliers = ["Distribuidora Gourmet S.A.", "Molinos del Valle Ltda.", "Vajillas y Más S.A.S.", "Equipos Profesionales Ltda."];
  const areas = ["Cocina Principal", "Barismo", "Panadería", "Pastelería", "Almacén A001", "Almacén B002", "Almacén C001", "Almacén D001"];
  const purposes = ["Producción", "Consumo Diario", "Mantenimiento", "Préstamo", "Transferencia", "Otros"];

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || movement.type === selectedType;
    
    let matchesDate = true;
    if (selectedDateRange !== "all") {
      const today = new Date();
      const movementDate = new Date(movement.date);
      
      switch (selectedDateRange) {
        case "today":
          matchesDate = movementDate.toDateString() === today.toDateString();
          break;
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = movementDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = movementDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryData.productCode || !entryData.quantity) {
      toast.error("Complete todos los campos obligatorios");
      return;
    }
    
    toast.success("Entrada registrada exitosamente. Stock actualizado automáticamente.");
    setIsEntryDialogOpen(false);
    setEntryData({
      productCode: "",
      productName: "",
      quantity: "",
      supplier: "",
      invoiceNumber: "",
      storageLocation: "",
      unitPrice: "",
      notes: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleExitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exitData.productCode || !exitData.quantity || !exitData.destinationArea || !exitData.responsible) {
      toast.error("Complete todos los campos obligatorios");
      return;
    }
    
    toast.success("Salida registrada exitosamente. Stock actualizado automáticamente.");
    setIsExitDialogOpen(false);
    setExitData({
      productCode: "",
      productName: "",
      quantity: "",
      destinationArea: "",
      responsible: "",
      purpose: "",
      notes: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleProductSelect = (productCode: string, isEntry: boolean) => {
    const product = products.find(p => p.code === productCode);
    if (product) {
      if (isEntry) {
        setEntryData({...entryData, productCode, productName: product.name});
      } else {
        setExitData({...exitData, productCode, productName: product.name});
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Entradas y Salidas de Productos</h1>
          <p className="text-muted-foreground">
            Registro de movimientos de inventario con actualización automática de stock
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <ArrowUp className="h-4 w-4 mr-2" />
                Nueva Entrada
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Entrada de Producto</DialogTitle>
                <DialogDescription>
                  Complete la información de la entrada al inventario
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEntrySubmit}>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="entryProductCode">Código del Producto *</Label>
                    <Select value={entryData.productCode} onValueChange={(value) => handleProductSelect(value, true)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(product => (
                          <SelectItem key={product.code} value={product.code}>
                            {product.code} - {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entryProductName">Nombre del Producto</Label>
                    <Input
                      id="entryProductName"
                      value={entryData.productName}
                      onChange={(e) => setEntryData({...entryData, productName: e.target.value})}
                      placeholder="Se completa automáticamente"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entryQuantity">Cantidad *</Label>
                    <Input
                      id="entryQuantity"
                      type="number"
                      value={entryData.quantity}
                      onChange={(e) => setEntryData({...entryData, quantity: e.target.value})}
                      placeholder="Ej: 50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entryDate">Fecha *</Label>
                    <Input
                      id="entryDate"
                      type="date"
                      value={entryData.date}
                      onChange={(e) => setEntryData({...entryData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entrySupplier">Proveedor *</Label>
                    <Select value={entryData.supplier} onValueChange={(value) => setEntryData({...entryData, supplier: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map(supplier => (
                          <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entryInvoiceNumber">Número de Factura</Label>
                    <Input
                      id="entryInvoiceNumber"
                      value={entryData.invoiceNumber}
                      onChange={(e) => setEntryData({...entryData, invoiceNumber: e.target.value})}
                      placeholder="Ej: FAC-2025-004"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entryStorageLocation">Ubicación de Almacén</Label>
                    <Select value={entryData.storageLocation} onValueChange={(value) => setEntryData({...entryData, storageLocation: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.filter(area => area.includes("Almacén")).map(area => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entryUnitPrice">Precio Unitario</Label>
                    <Input
                      id="entryUnitPrice"
                      type="number"
                      value={entryData.unitPrice}
                      onChange={(e) => setEntryData({...entryData, unitPrice: e.target.value})}
                      placeholder="Ej: 45000"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="entryNotes">Observaciones</Label>
                    <Textarea
                      id="entryNotes"
                      value={entryData.notes}
                      onChange={(e) => setEntryData({...entryData, notes: e.target.value})}
                      placeholder="Observaciones adicionales sobre la entrada"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEntryDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Registrar Entrada
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ArrowDown className="h-4 w-4 mr-2" />
                Nueva Salida
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Salida de Producto</DialogTitle>
                <DialogDescription>
                  Complete la información de la salida del inventario
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleExitSubmit}>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="exitProductCode">Código del Producto *</Label>
                    <Select value={exitData.productCode} onValueChange={(value) => handleProductSelect(value, false)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(product => (
                          <SelectItem key={product.code} value={product.code}>
                            {product.code} - {product.name} (Stock: {product.stock})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exitProductName">Nombre del Producto</Label>
                    <Input
                      id="exitProductName"
                      value={exitData.productName}
                      onChange={(e) => setExitData({...exitData, productName: e.target.value})}
                      placeholder="Se completa automáticamente"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exitQuantity">Cantidad *</Label>
                    <Input
                      id="exitQuantity"
                      type="number"
                      value={exitData.quantity}
                      onChange={(e) => setExitData({...exitData, quantity: e.target.value})}
                      placeholder="Ej: 10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exitDate">Fecha *</Label>
                    <Input
                      id="exitDate"
                      type="date"
                      value={exitData.date}
                      onChange={(e) => setExitData({...exitData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exitDestinationArea">Área de Destino *</Label>
                    <Select value={exitData.destinationArea} onValueChange={(value) => setExitData({...exitData, destinationArea: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar área" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.filter(area => !area.includes("Almacén")).map(area => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exitResponsible">Responsable *</Label>
                    <Input
                      id="exitResponsible"
                      value={exitData.responsible}
                      onChange={(e) => setExitData({...exitData, responsible: e.target.value})}
                      placeholder="Nombre del responsable"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exitPurpose">Propósito</Label>
                    <Select value={exitData.purpose} onValueChange={(value) => setExitData({...exitData, purpose: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar propósito" />
                      </SelectTrigger>
                      <SelectContent>
                        {purposes.map(purpose => (
                          <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="exitNotes">Observaciones</Label>
                    <Textarea
                      id="exitNotes"
                      value={exitData.notes}
                      onChange={(e) => setExitData({...exitData, notes: e.target.value})}
                      placeholder="Observaciones adicionales sobre la salida"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsExitDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Registrar Salida
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estadísticas de movimientos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas Hoy</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +2 vs ayer
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salidas Hoy</CardTitle>
            <ArrowDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              +3 vs ayer
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Entradas</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.8M</div>
            <p className="text-xs text-muted-foreground">
              Esta semana
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movimientos Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Por verificar
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Movimientos</CardTitle>
          <CardDescription>
            Registro completo de entradas y salidas con trazabilidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por producto, código o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Entrada">Entradas</SelectItem>
                <SelectItem value="Salida">Salidas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Origen/Destino</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {movement.type === "Entrada" ? (
                          <ArrowUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-600" />
                        )}
                        <Badge variant={movement.type === "Entrada" ? "default" : "secondary"}>
                          {movement.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{movement.productName}</p>
                        <p className="text-sm text-muted-foreground font-mono">{movement.productCode}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={movement.type === "Entrada" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {movement.type === "Entrada" ? "+" : "-"}{movement.quantity} {movement.unit}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{movement.date}</p>
                        <p className="text-sm text-muted-foreground">{movement.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3" />
                        <span>{movement.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {movement.type === "Entrada" ? (
                          <div>
                            <p className="text-sm">{movement.supplier}</p>
                            <p className="text-xs text-muted-foreground">
                              {movement.invoiceNumber && `Factura: ${movement.invoiceNumber}`}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span className="text-sm">{movement.destinationArea}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{movement.responsible}</p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">${movement.totalValue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        @${movement.unitPrice.toLocaleString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={movement.status === "Completado" ? "default" : "secondary"}>
                        {movement.status === "Completado" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {movement.status}
                      </Badge>
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