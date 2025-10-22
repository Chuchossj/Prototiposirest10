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

  const filteredProducts = products.filter((product: any) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalStockProducts = products.filter((p: any) => p.stock <= p.minStock);

  const handleAddProduct = async () => {
    if (!newProduct.name || newProduct.price <= 0) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    setIsSaving(true);
    try {
      await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify(newProduct),
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
      toast.error("Error al agregar producto");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    setIsSaving(true);
    try {
      await apiRequest(`/products/${selectedProduct.id}`, {
        method: "PUT",
        body: JSON.stringify(selectedProduct),
        accessToken
      });

      toast.success("Producto actualizado exitosamente");
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      refetch();
    } catch (error) {
      toast.error("Error al actualizar producto");
      console.error(error);
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
      toast.error("Error al eliminar producto");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0B2240] to-[#5B2C90] bg-clip-text text-transparent">
          Gestión de Inventario
        </h1>
        <p className="text-gray-600 mt-1">
          Administra productos, stock y categorías del menú
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#0B2240] border-l-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0B2240]">{products.length}</div>
          </CardContent>
        </Card>

        <Card className="border-[#5B2C90] border-l-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Valor Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#5B2C90]">
              ${products.reduce((sum: number, p: any) => sum + (p.price * p.stock), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#F28C1B] border-l-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Stock Crítico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F28C1B] flex items-center gap-2">
              {criticalStockProducts.length}
              {criticalStockProducts.length > 0 && (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#FFD23F] border-l-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0B2240]">
              {new Set(products.map((p: any) => p.category)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de stock crítico */}
      {criticalStockProducts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Stock Crítico
            </CardTitle>
            <CardDescription className="text-red-600">
              {criticalStockProducts.length} productos requieren reposición
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalStockProducts.slice(0, 3).map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-red-900">{product.name}</p>
                    <p className="text-sm text-red-600">Stock actual: {product.stock} unidades</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800 border-red-300">
                    Crítico
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Búsqueda y acciones */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-[#0B2240]">Productos</CardTitle>
              <CardDescription>Lista completa de productos disponibles</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="icon"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#0B2240] hover:bg-[#5B2C90] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                    <DialogDescription>
                      Complete los detalles del producto
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Nombre del Producto</Label>
                      <Input
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Ej: Bandeja Paisa"
                      />
                    </div>
                    <div>
                      <Label>Categoría</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Platos Fuertes">Platos Fuertes</SelectItem>
                          <SelectItem value="Bebidas">Bebidas</SelectItem>
                          <SelectItem value="Postres">Postres</SelectItem>
                          <SelectItem value="Entradas">Entradas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Precio</Label>
                      <Input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Stock Inicial</Label>
                      <Input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Stock Mínimo</Label>
                      <Input
                        type="number"
                        value={newProduct.minStock}
                        onChange={(e) => setNewProduct({ ...newProduct, minStock: parseInt(e.target.value) })}
                        placeholder="10"
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
                      className="bg-[#0B2240] hover:bg-[#5B2C90] text-white"
                    >
                      {isSaving ? "Guardando..." : "Agregar Producto"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando productos...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No se encontraron productos</div>
          ) : (
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
                {filteredProducts.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price?.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {product.stock} unidades
                        {product.stock <= product.minStock && (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        product.stock <= product.minStock
                          ? "bg-red-100 text-red-800 border-red-300"
                          : product.stock <= product.minStock * 2
                          ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                          : "bg-green-100 text-green-800 border-green-300"
                      }>
                        {product.stock <= product.minStock ? "Crítico" : 
                         product.stock <= product.minStock * 2 ? "Bajo" : "Normal"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Modifique los detalles del producto
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <Label>Nombre del Producto</Label>
                <Input
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Categoría</Label>
                <Select
                  value={selectedProduct.category}
                  onValueChange={(value) => setSelectedProduct({ ...selectedProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Platos Fuertes">Platos Fuertes</SelectItem>
                    <SelectItem value="Bebidas">Bebidas</SelectItem>
                    <SelectItem value="Postres">Postres</SelectItem>
                    <SelectItem value="Entradas">Entradas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Precio</Label>
                <Input
                  type="number"
                  value={selectedProduct.price}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={selectedProduct.stock}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Stock Mínimo</Label>
                <Input
                  type="number"
                  value={selectedProduct.minStock}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, minStock: parseInt(e.target.value) })}
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
              onClick={handleUpdateProduct}
              disabled={isSaving}
              className="bg-[#0B2240] hover:bg-[#5B2C90] text-white"
            >
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
