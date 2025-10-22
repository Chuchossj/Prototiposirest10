import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { 
  Plus, 
  Search, 
  FileText, 
  Edit, 
  Eye,
  Calculator,
  AlertCircle,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export function InvoiceManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [invoiceProducts, setInvoiceProducts] = useState([]);

  const [invoiceData, setInvoiceData] = useState({
    number: "",
    date: "",
    supplier: "",
    orderNumber: "",
    program: "",
    instructor: "",
    products: []
  });

  const [productData, setProductData] = useState({
    code: "",
    description: "",
    quantity: "",
    unitPrice: "",
    storageCode: ""
  });

  const invoices = [
    {
      id: 1,
      number: "FAC-2025-001",
      date: "2025-01-15",
      supplier: "Distribuidora Gourmet S.A.",
      orderNumber: "ORD-001",
      program: "Técnico en Cocina",
      instructor: "Chef María González",
      total: 2850000,
      subtotal: 2394958,
      iva: 455042,
      status: "Validada",
      products: 5
    },
    {
      id: 2,
      number: "FAC-2025-002",
      date: "2025-01-14",
      supplier: "Molinos del Valle Ltda.",
      orderNumber: "",
      program: "Técnico en Panadería",
      instructor: "Maestro Carlos Rodríguez",
      total: 1450000,
      subtotal: 1218487,
      iva: 231513,
      status: "Pendiente",
      products: 3
    },
    {
      id: 3,
      number: "FAC-2025-003",
      date: "2025-01-13",
      supplier: "Vajillas y Más S.A.S.",
      orderNumber: "ORD-002",
      program: "Técnico en Barismo",
      instructor: "Barista Ana López",
      total: 950000,
      subtotal: 798319,
      iva: 151681,
      status: "Con Diferencias",
      products: 8
    }
  ];

  const suppliers = ["Distribuidora Gourmet S.A.", "Molinos del Valle Ltda.", "Vajillas y Más S.A.S.", "Equipos Profesionales Ltda.", "Ingenio San Carlos"];
  const programs = ["Técnico en Cocina", "Técnico en Panadería", "Técnico en Barismo", "Técnico en Pastelería"];

  const filteredInvoices = invoices.filter(invoice =>
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProduct = () => {
    if (productData.code && productData.description && productData.quantity && productData.unitPrice) {
      const newProduct = {
        ...productData,
        total: parseFloat(productData.quantity) * parseFloat(productData.unitPrice)
      };
      setInvoiceProducts([...invoiceProducts, newProduct]);
      setProductData({
        code: "",
        description: "",
        quantity: "",
        unitPrice: "",
        storageCode: ""
      });
    }
  };

  const removeProduct = (index: number) => {
    setInvoiceProducts(invoiceProducts.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = invoiceProducts.reduce((sum, product) => sum + product.total, 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;
    return { subtotal, iva, total };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (invoiceProducts.length === 0) {
      toast.error("Debe agregar al menos un producto a la factura");
      return;
    }
    
    // Verificar duplicidad de número de factura
    const isDuplicate = invoices.some(inv => inv.number === invoiceData.number);
    if (isDuplicate) {
      toast.error("El número de factura ya existe en el sistema");
      return;
    }

    toast.success("Factura registrada exitosamente");
    setIsDialogOpen(false);
    setInvoiceData({
      number: "",
      date: "",
      supplier: "",
      orderNumber: "",
      program: "",
      instructor: "",
      products: []
    });
    setInvoiceProducts([]);
  };

  const viewInvoiceDetails = (invoice: any) => {
    setCurrentInvoice(invoice);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Gestión de Facturas</h1>
          <p className="text-muted-foreground">
            Registro y validación de facturas de proveedores
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Factura
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Factura</DialogTitle>
              <DialogDescription>
                Complete la información de la factura y agregue los productos
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Información de la factura */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="number">Número de Factura *</Label>
                    <Input
                      id="number"
                      value={invoiceData.number}
                      onChange={(e) => setInvoiceData({...invoiceData, number: e.target.value})}
                      placeholder="Ej: FAC-2025-004"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={invoiceData.date}
                      onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Proveedor *</Label>
                    <Select value={invoiceData.supplier} onValueChange={(value) => setInvoiceData({...invoiceData, supplier: value})}>
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
                    <Label htmlFor="orderNumber">Número de Pedido</Label>
                    <Input
                      id="orderNumber"
                      value={invoiceData.orderNumber}
                      onChange={(e) => setInvoiceData({...invoiceData, orderNumber: e.target.value})}
                      placeholder="Ej: ORD-003"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="program">Programa *</Label>
                    <Select value={invoiceData.program} onValueChange={(value) => setInvoiceData({...invoiceData, program: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar programa" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map(program => (
                          <SelectItem key={program} value={program}>{program}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor *</Label>
                    <Input
                      id="instructor"
                      value={invoiceData.instructor}
                      onChange={(e) => setInvoiceData({...invoiceData, instructor: e.target.value})}
                      placeholder="Nombre del instructor"
                      required
                    />
                  </div>
                </div>

                <Separator />

                {/* Productos */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Productos de la Factura</h3>
                  
                  {/* Formulario para agregar productos */}
                  <div className="grid grid-cols-5 gap-4 mb-4 p-4 border rounded-lg bg-muted/50">
                    <div className="space-y-2">
                      <Label htmlFor="productCode">Código</Label>
                      <Input
                        id="productCode"
                        value={productData.code}
                        onChange={(e) => setProductData({...productData, code: e.target.value})}
                        placeholder="Código"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productDescription">Descripción</Label>
                      <Input
                        id="productDescription"
                        value={productData.description}
                        onChange={(e) => setProductData({...productData, description: e.target.value})}
                        placeholder="Descripción del producto"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Cantidad</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={productData.quantity}
                        onChange={(e) => setProductData({...productData, quantity: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unitPrice">Precio Unitario</Label>
                      <Input
                        id="unitPrice"
                        type="number"
                        value={productData.unitPrice}
                        onChange={(e) => setProductData({...productData, unitPrice: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storageCode">Cód. Almacén</Label>
                      <Input
                        id="storageCode"
                        value={productData.storageCode}
                        onChange={(e) => setProductData({...productData, storageCode: e.target.value})}
                        placeholder="A001"
                      />
                    </div>
                    <div className="col-span-5">
                      <Button type="button" onClick={addProduct} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Producto
                      </Button>
                    </div>
                  </div>

                  {/* Lista de productos */}
                  {invoiceProducts.length > 0 && (
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Precio Unit.</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoiceProducts.map((product, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono">{product.code}</TableCell>
                              <TableCell>{product.description}</TableCell>
                              <TableCell>{product.quantity}</TableCell>
                              <TableCell>${parseFloat(product.unitPrice).toLocaleString()}</TableCell>
                              <TableCell>${product.total.toLocaleString()}</TableCell>
                              <TableCell>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeProduct(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Totales */}
                      <div className="flex justify-end">
                        <div className="w-80 space-y-2 p-4 border rounded-lg bg-muted/50">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${calculateTotals().subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>IVA (19%):</span>
                            <span>${calculateTotals().iva.toLocaleString()}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-medium">
                            <span>Total:</span>
                            <span>${calculateTotals().total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Registrar Factura
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Facturas</CardTitle>
          <CardDescription>
            Facturas registradas y su estado de validación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número de factura o proveedor..."
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
                  <TableHead>Número</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Programa</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono">{invoice.number}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{invoice.supplier}</p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.products} productos
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{invoice.program}</p>
                        <p className="text-xs text-muted-foreground">{invoice.instructor}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">${invoice.total.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          IVA: ${invoice.iva.toLocaleString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        invoice.status === "Validada" ? "default" :
                        invoice.status === "Pendiente" ? "secondary" :
                        "destructive"
                      }>
                        {invoice.status === "Validada" && <Check className="h-3 w-3 mr-1" />}
                        {invoice.status === "Con Diferencias" && <AlertCircle className="h-3 w-3 mr-1" />}
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => viewInvoiceDetails(invoice)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Calculator className="h-4 w-4" />
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
  );
}