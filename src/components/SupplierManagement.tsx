import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Truck,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export function SupplierManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    nit: "",
    address: "",
    phone: "",
    email: "",
    contact: "",
    description: "",
    paymentTerms: ""
  });

  const suppliers = [
    {
      id: 1,
      name: "Distribuidora Gourmet S.A.",
      nit: "900123456-7",
      address: "Carrera 15 #45-67, Bogotá",
      phone: "(601) 234-5678",
      email: "ventas@gourmet.com",
      contact: "María García",
      description: "Proveedor especializado en ingredientes gourmet y aceites premium",
      paymentTerms: "30 días",
      totalPurchases: 45000000,
      lastPurchase: "2025-01-15",
      status: "Activo",
      invoices: 12
    },
    {
      id: 2,
      name: "Molinos del Valle Ltda.",
      nit: "800987654-3",
      address: "Zona Industrial Norte, Medellín",
      phone: "(604) 987-6543",
      email: "comercial@molinosvalle.com",
      contact: "Carlos Rodríguez",
      description: "Proveedor de harinas, cereales y granos para panadería",
      paymentTerms: "15 días",
      totalPurchases: 28500000,
      lastPurchase: "2025-01-14",
      status: "Activo",
      invoices: 8
    },
    {
      id: 3,
      name: "Vajillas y Más S.A.S.",
      nit: "901234567-8",
      address: "Calle 72 #11-34, Bogotá",
      phone: "(601) 345-6789",
      email: "info@vajillasmas.com",
      contact: "Ana López",
      description: "Proveedor de utensilios de cocina, vajillas y equipos menores",
      paymentTerms: "45 días",
      totalPurchases: 15200000,
      lastPurchase: "2025-01-13",
      status: "Activo",
      invoices: 6
    },
    {
      id: 4,
      name: "Equipos Profesionales Ltda.",
      nit: "800456789-1",
      address: "Autopista Norte Km 12, Bogotá",
      phone: "(601) 456-7890",
      email: "ventas@equipospro.com",
      contact: "Luis Martínez",
      description: "Proveedor de equipos industriales para cocina profesional",
      paymentTerms: "60 días",
      totalPurchases: 35000000,
      lastPurchase: "2025-01-10",
      status: "Inactivo",
      invoices: 4
    }
  ];

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.nit.includes(searchTerm) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSupplier) {
      toast.success("Proveedor actualizado exitosamente");
    } else {
      toast.success("Proveedor registrado exitosamente");
    }
    setIsDialogOpen(false);
    setEditingSupplier(null);
    setFormData({
      name: "",
      nit: "",
      address: "",
      phone: "",
      email: "",
      contact: "",
      description: "",
      paymentTerms: ""
    });
  };

  const handleEdit = (supplier: any) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      nit: supplier.nit,
      address: supplier.address,
      phone: supplier.phone,
      email: supplier.email,
      contact: supplier.contact,
      description: supplier.description,
      paymentTerms: supplier.paymentTerms
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    toast.success("Proveedor eliminado exitosamente");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Gestión de Proveedores</h1>
          <p className="text-muted-foreground">
            Administra los proveedores del restaurante y su historial de compras
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSupplier ? "Editar Proveedor" : "Registrar Nuevo Proveedor"}
              </DialogTitle>
              <DialogDescription>
                Complete la información del proveedor
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Razón Social *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Distribuidora Gourmet S.A."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nit">NIT *</Label>
                  <Input
                    id="nit"
                    value={formData.nit}
                    onChange={(e) => setFormData({...formData, nit: e.target.value})}
                    placeholder="Ej: 900123456-7"
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Dirección completa"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(601) 234-5678"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="contacto@proveedor.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Persona de Contacto *</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    placeholder="Nombre del contacto"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Términos de Pago</Label>
                  <Input
                    id="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                    placeholder="Ej: 30 días"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descripción de los productos o servicios que ofrece"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingSupplier ? "Actualizar" : "Registrar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas de proveedores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proveedores</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              +2 este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proveedores Activos</CardTitle>
            <Badge className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              80% del total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compras</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$123M</div>
            <p className="text-xs text-muted-foreground">
              Este año
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Pendientes</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Por validar
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <CardDescription>
            Información y historial de todos los proveedores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, NIT o contacto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Compras</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-sm text-muted-foreground">NIT: {supplier.nit}</p>
                        <p className="text-xs text-muted-foreground">{supplier.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {supplier.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {supplier.email}
                        </div>
                        <p className="text-xs text-muted-foreground">{supplier.contact}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start text-sm">
                        <MapPin className="h-3 w-3 mr-1 mt-0.5" />
                        <span>{supplier.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">${supplier.totalPurchases.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{supplier.invoices} facturas</p>
                        <p className="text-xs text-muted-foreground">Última: {supplier.lastPurchase}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={supplier.status === "Activo" ? "default" : "secondary"}>
                        {supplier.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(supplier)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará permanentemente el proveedor "{supplier.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(supplier.id)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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