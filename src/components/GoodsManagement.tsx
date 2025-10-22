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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Package,
  Download,
  Upload,
  History
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export function GoodsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    category: "",
    minStock: "",
    supplier: "",
    value: "",
    iva: "",
    storageCode: "",
    unit: ""
  });

  const goods = [
    {
      id: 1,
      name: "Aceite de Oliva Extra Virgen",
      code: "AOL001",
      category: "Insumos",
      stock: 25,
      minStock: 10,
      value: 45000,
      supplier: "Distribuidora Gourmet S.A.",
      unit: "Litro",
      storageCode: "A001",
      status: "Activo"
    },
    {
      id: 2,
      name: "Harina de Trigo Premium",
      code: "HTP002",
      category: "Materia Prima",
      stock: 5,
      minStock: 20,
      value: 25000,
      supplier: "Molinos del Valle Ltda.",
      unit: "Kilogramo",
      storageCode: "B002",
      status: "Bajo Stock"
    },
    {
      id: 3,
      name: "Tazas de Porcelana Premium",
      code: "TCP003",
      category: "Utensilios",
      stock: 48,
      minStock: 20,
      value: 15000,
      supplier: "Vajillas y Más S.A.S.",
      unit: "Unidad",
      storageCode: "C001",
      status: "Activo"
    },
    {
      id: 4,
      name: "Licuadora Industrial 5L",
      code: "LIN004",
      category: "Equipos",
      stock: 3,
      minStock: 2,
      value: 850000,
      supplier: "Equipos Profesionales Ltda.",
      unit: "Unidad",
      storageCode: "D001",
      status: "Activo"
    },
    {
      id: 5,
      name: "Azúcar Refinada",
      code: "AZR005",
      category: "Insumos",
      stock: 15,
      minStock: 30,
      value: 12000,
      supplier: "Ingenio San Carlos",
      unit: "Kilogramo",
      storageCode: "A002",
      status: "Bajo Stock"
    }
  ];

  const categories = ["Insumos", "Materia Prima", "Utensilios", "Equipos"];
  const suppliers = ["Distribuidora Gourmet S.A.", "Molinos del Valle Ltda.", "Vajillas y Más S.A.S.", "Equipos Profesionales Ltda.", "Ingenio San Carlos"];
  const units = ["Unidad", "Kilogramo", "Litro", "Gramo", "Metro", "Caja"];

  const filteredGoods = goods.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      toast.success("Bien actualizado exitosamente");
    } else {
      toast.success("Bien registrado exitosamente");
    }
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      category: "",
      minStock: "",
      supplier: "",
      value: "",
      iva: "",
      storageCode: "",
      unit: ""
    });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      code: item.code,
      description: item.description || "",
      category: item.category,
      minStock: item.minStock.toString(),
      supplier: item.supplier,
      value: item.value.toString(),
      iva: "19",
      storageCode: item.storageCode,
      unit: item.unit
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    toast.success("Bien eliminado exitosamente");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Gestión de Bienes</h1>
          <p className="text-muted-foreground">
            Administra el inventario de bienes del restaurante
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Bien
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Editar Bien" : "Registrar Nuevo Bien"}
                </DialogTitle>
                <DialogDescription>
                  Complete la información del bien para el inventario
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Bien *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ej: Aceite de Oliva Extra Virgen"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Código *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      placeholder="Ej: AOL001"
                      required
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Descripción detallada del bien"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
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
                    <Label htmlFor="minStock">Stock Mínimo *</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                      placeholder="Ej: 10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Proveedor *</Label>
                    <Select value={formData.supplier} onValueChange={(value) => setFormData({...formData, supplier: value})}>
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
                    <Label htmlFor="value">Valor Unitario *</Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      placeholder="Ej: 45000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="iva">IVA (%)</Label>
                    <Input
                      id="iva"
                      type="number"
                      value={formData.iva}
                      onChange={(e) => setFormData({...formData, iva: e.target.value})}
                      placeholder="Ej: 19"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storageCode">Código de Almacén</Label>
                    <Input
                      id="storageCode"
                      value={formData.storageCode}
                      onChange={(e) => setFormData({...formData, storageCode: e.target.value})}
                      placeholder="Ej: A001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unidad de Medida *</Label>
                    <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map(unit => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingItem ? "Actualizar" : "Registrar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Bienes</CardTitle>
          <CardDescription>
            Filtros y búsqueda de bienes registrados
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
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Stock Mín.</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGoods.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.code}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.supplier}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={item.stock <= item.minStock ? "text-red-600 font-medium" : ""}>
                        {item.stock} {item.unit}
                      </span>
                    </TableCell>
                    <TableCell>{item.minStock} {item.unit}</TableCell>
                    <TableCell>${item.value.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Activo" ? "default" : "destructive"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <History className="h-4 w-4" />
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
                                Esta acción eliminará permanentemente el bien "{item.name}" del inventario.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item.id)}>
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