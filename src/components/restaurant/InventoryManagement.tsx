import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { toast } from "sonner@2.0.3";
import { 
  Package, 
  AlertTriangle, 
  Plus,
  Edit,
  Trash2,
  Search,
  TrendingDown,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { useRealtimeData, apiRequest } from "../../utils/useRealtimeData";

interface InventoryManagementProps {
  accessToken?: string;
}

export function InventoryManagement({ accessToken }: InventoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Platos Fuertes",
    price: 0,
    stock: 0,
    minStock: 10
  });

  // Obtener productos en tiempo real
  const { data: productsData, loading, refetch } = useRealtimeData<{ success: boolean; products: any[] }>({
    endpoint: "/products",
    accessToken,
    refreshInterval: 3000 // Actualizar cada 3 segundos
  });

  const products = productsData?.products || [];

  // Filtrar productos
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estadísticas
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: "Agotado", color: "bg-red-100 text-red-800 border-red-300" };
    if (stock <= minStock) return { label: "Stock Bajo", color: "bg-yellow-100 text-yellow-800 border-yellow-300" };
    return { label: "Normal", color: "bg-green-100 text-green-800 border-green-300" };
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || newProduct.price <= 0) {
      toast.error("Complete todos los campos requeridos");
      return;
    }

    setIsSaving(true);
    try {
      await apiRequest("/products", {
        method: "POST",
        body: newProduct,
        accessToken
      });

      toast.success("Producto agregado exitosamente");
      setIsAddDialogOpen(false);
      setNewProduct({
        name: "",
        category: "Platos Fuertes",
        price: 0,
        stock: 0,
        minStock: 10
      });
      refetch();
    } catch (error) {
      console.error("Error agregando producto:", error);
      toast.error("Error al agregar producto");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;

    setIsSaving(true);
    try {
      await apiRequest(`/products/${selectedProduct.id}`, {
        method: "PUT",
        body: {
          name: selectedProduct.name,
          category: selectedProduct.category,
          price: selectedProduct.price,
          stock: selectedProduct.stock,
          minStock: selectedProduct.minStock
        },
        accessToken
      });

      toast.success("Producto actualizado exitosamente");
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      refetch();
    } catch (error) {
      console.error("Error actualizando producto:", error);
      toast.error("Error al actualizar producto");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("¿Está seguro de eliminar este producto?")) return;

    try {
      await apiRequest(`/products/${productId}`, {
        method: "DELETE",
        accessToken
      });

      toast.success("Producto eliminado exitosamente");
      refetch();
    } catch (error) {
      console.error("Error eliminando producto:", error);
      toast.error("Error al eliminar producto");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
              <p className="text-blue-100">Administra productos y stock en tiempo real</p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">
            {totalProducts} Productos
          </Badge>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Productos</CardDescription>
            <CardTitle className="text-3xl">{totalProducts}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-600">
              <BarChart3 className="h-4 w-4 mr-1" />
              En catálogo
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Productos con Stock Bajo</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{lowStockProducts}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Requieren reabastecimiento
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Valor Total del Inventario</CardDescription>
            <CardTitle className="text-3xl">
              ${totalValue.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-600">
              <TrendingDown className="h-4 w-4 mr-1" />
              COP
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Productos</CardTitle>
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
                    Agregar Producto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nuevo Producto</DialogTitle>
                    <DialogDescription>
                      Agrega un nuevo producto al inventario
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del Producto</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="Ej: Bandeja Paisa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Platos Fuertes">Platos Fuertes</SelectItem>
                          <SelectItem value="Entradas">Entradas</SelectItem>
                          <SelectItem value="Bebidas">Bebidas</SelectItem>
                          <SelectItem value="Postres">Postres</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Precio</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock Inicial</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minStock">Stock Mínimo</Label>
                      <Input
                        id="minStock"
                        type="number"
                        value={newProduct.minStock}
                        onChange={(e) => setNewProduct({...newProduct, minStock: parseInt(e.target.value)})}
                      />
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
                      onClick={handleAddProduct}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-blue-900 to-purple-900"
                    >
                      {isSaving ? "Guardando..." : "Guardar"}
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
                placeholder="Buscar productos..."
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
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Cargando productos...
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No se encontraron productos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const status = getStockStatus(product.stock, product.minStock);
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price?.toLocaleString()}</TableCell>
                        <TableCell>
                          {product.stock} / {product.minStock} min
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={status.color}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      {/* Dialog de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Modifica la información del producto
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre del Producto</Label>
                <Input
                  id="edit-name"
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Categoría</Label>
                <Select
                  value={selectedProduct.category}
                  onValueChange={(value) => setSelectedProduct({...selectedProduct, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Platos Fuertes">Platos Fuertes</SelectItem>
                    <SelectItem value="Entradas">Entradas</SelectItem>
                    <SelectItem value="Bebidas">Bebidas</SelectItem>
                    <SelectItem value="Postres">Postres</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Precio</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={selectedProduct.price}
                    onChange={(e) => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={selectedProduct.stock}
                    onChange={(e) => setSelectedProduct({...selectedProduct, stock: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-minStock">Stock Mínimo</Label>
                <Input
                  id="edit-minStock"
                  type="number"
                  value={selectedProduct.minStock}
                  onChange={(e) => setSelectedProduct({...selectedProduct, minStock: parseInt(e.target.value)})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedProduct(null);
              }}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEditProduct}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-900 to-purple-900"
            >
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
