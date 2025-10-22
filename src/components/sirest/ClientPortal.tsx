import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner@2.0.3";
import { 
  Clock, 
  CheckCircle, 
  ChefHat,
  Users,
  Receipt,
  Phone,
  LogOut,
  Building2,
  Utensils,
  Info,
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Search,
  Filter,
  Send,
  Loader2,
  X
} from "lucide-react";
import { useRealtimeData, apiRequest } from "../../utils/useRealtimeData";

interface ClientPortalProps {
  userData: any;
  onLogout: () => void;
  accessToken: string;
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Confirmado",
    color: "bg-[#0B2240] text-white border-[#0B2240]",
    description: "Su pedido ha sido confirmado y enviado a cocina"
  },
  preparing: {
    icon: ChefHat,
    label: "En Preparación",
    color: "bg-[#F28C1B] text-white border-[#F28C1B]",
    description: "Nuestros chefs están preparando su pedido"
  },
  ready: {
    icon: CheckCircle,
    label: "Listo para Servir",
    color: "bg-[#5B2C90] text-white border-[#5B2C90]",
    description: "Su pedido está listo, el mesero lo llevará pronto"
  },
  served: {
    icon: Users,
    label: "Servido",
    color: "bg-gray-500 text-white border-gray-500",
    description: "Su pedido ha sido servido. ¡Disfrute!"
  }
};

export function ClientPortal({ userData, onLogout, accessToken }: ClientPortalProps) {
  const [requestedBill, setRequestedBill] = useState(false);
  const [currentTab, setCurrentTab] = useState("menu");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [cart, setCart] = useState<any[]>([]);
  const [orderNotes, setOrderNotes] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener datos en tiempo real
  const { data: productsData } = useRealtimeData({
    endpoint: "/products",
    accessToken,
    refreshInterval: 5000
  });

  const { data: ordersData, refetch: refetchOrders } = useRealtimeData({
    endpoint: "/orders",
    accessToken,
    refreshInterval: 2000
  });

  const { data: tablesData } = useRealtimeData({
    endpoint: "/tables",
    accessToken,
    refreshInterval: 5000
  });

  const products = productsData?.products || [];
  const allOrders = ordersData?.orders || [];
  const tables = tablesData?.tables || [];

  // Filtrar pedidos del usuario actual
  const myOrders = allOrders.filter((order: any) => 
    order.customerId === userData.id || order.customerEmail === userData.email
  );

  // Obtener categorías únicas
  const categories = ["todos", ...Array.from(new Set(products.map((p: any) => p.category)))];

  // Filtrar productos
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.stock > 0;
  });

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.name} agregado al carrito`);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
    toast.info("Producto eliminado del carrito");
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const submitOrder = async () => {
    if (cart.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    console.log("Submitting order with accessToken:", accessToken ? "Present" : "Missing");
    console.log("User data:", userData);

    setIsSubmitting(true);

    try {
      // Buscar una mesa disponible o asignar una específica
      const availableTable = tables.find((t: any) => t.status === "disponible");
      
      const orderData = {
        tableNumber: availableTable?.number || "Online",
        tableId: availableTable?.id || "online-order",
        customerId: userData.id,
        customerEmail: userData.email,
        customerName: userData.name,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        subtotal: getCartTotal(),
        notes: orderNotes,
        status: "pending",
        orderType: "cliente"
      };

      console.log("Order data:", orderData);

      const response = await apiRequest("/orders", {
        method: "POST",
        body: orderData,
        accessToken
      });

      console.log("Order response:", response);

      if (response.success) {
        toast.success("✅ ¡Pedido enviado exitosamente!");
        setCart([]);
        setOrderNotes("");
        setIsCheckoutOpen(false);
        setCurrentTab("orders");
        refetchOrders();
      }
    } catch (error) {
      console.error("Error enviando pedido:", error);
      toast.error("❌ Error al enviar el pedido. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestBill = () => {
    setRequestedBill(true);
    toast.success("Cuenta solicitada. El mesero se acercará pronto.");
  };

  const getStatusStep = (status: string) => {
    const steps = ["pending", "preparing", "ready", "served"];
    return steps.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0B2240] to-[#5B2C90] rounded-xl flex items-center justify-center">
                <Utensils className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl bg-gradient-to-r from-[#0B2240] to-[#5B2C90] bg-clip-text text-transparent">
                  SIREST
                </h1>
                <p className="text-sm text-gray-600">Portal del Cliente</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-[#FFD23F]/10 border-[#FFD23F] text-[#0B2240]">
                {userData.name}
              </Badge>
              
              {/* Carrito */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentTab("cart")}
                  className="border-[#5B2C90] text-[#5B2C90] hover:bg-[#5B2C90]/10"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Carrito
                  {cart.length > 0 && (
                    <Badge className="ml-2 bg-[#F28C1B] text-white">{cart.length}</Badge>
                  )}
                </Button>
              </div>

              <Button 
                variant="outline" 
                size="sm"
                onClick={onLogout}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Bienvenida */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl bg-gradient-to-r from-[#0B2240] to-[#5B2C90] bg-clip-text text-transparent">
            ¡Bienvenido, {userData.name}!
          </h2>
          <p className="text-gray-600">
            Explore nuestro menú y realice su pedido en línea
          </p>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger value="menu" className="data-[state=active]:bg-[#0B2240] data-[state=active]:text-white">
              <Utensils className="h-4 w-4 mr-2" />
              Menú
            </TabsTrigger>
            <TabsTrigger value="cart" className="data-[state=active]:bg-[#5B2C90] data-[state=active]:text-white">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Carrito
              {cart.length > 0 && (
                <Badge className="ml-2 bg-[#F28C1B] text-white text-xs">{cart.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-[#F28C1B] data-[state=active]:text-white">
              <Receipt className="h-4 w-4 mr-2" />
              Mis Pedidos
            </TabsTrigger>
          </TabsList>

          {/* MENÚ */}
          <TabsContent value="menu" className="space-y-6">
            {/* Filtros y búsqueda */}
            <Card className="border-2 border-gray-100">
              <CardHeader>
                <CardTitle className="text-[#0B2240]">Nuestro Menú</CardTitle>
                <CardDescription>Seleccione los productos que desea ordenar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-[#5B2C90]"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category 
                          ? "bg-[#5B2C90] text-white hover:bg-[#5B2C90]/90" 
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Info className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No se encontraron productos</p>
                </div>
              ) : (
                filteredProducts.map((product: any) => (
                  <Card key={product.id} className="border-2 border-gray-100 hover:border-[#5B2C90] transition-all hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-[#0B2240]">{product.name}</CardTitle>
                          <Badge variant="outline" className="mt-2 border-[#F28C1B] text-[#F28C1B]">
                            {product.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl text-[#5B2C90]">${product.price}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {product.description && (
                        <p className="text-sm text-gray-600">{product.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          Stock: {product.stock}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product)}
                          className="bg-gradient-to-r from-[#0B2240] to-[#5B2C90] hover:from-[#5B2C90] hover:to-[#F28C1B] text-white"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Agregar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* CARRITO */}
          <TabsContent value="cart" className="space-y-6">
            <Card className="border-2 border-gray-100">
              <CardHeader>
                <CardTitle className="text-[#0B2240]">Su Carrito de Compras</CardTitle>
                <CardDescription>
                  {cart.length === 0 
                    ? "El carrito está vacío" 
                    : `${cart.length} producto(s) en el carrito`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">No hay productos en el carrito</p>
                    <Button
                      onClick={() => setCurrentTab("menu")}
                      className="bg-gradient-to-r from-[#0B2240] to-[#5B2C90] text-white"
                    >
                      <Utensils className="h-4 w-4 mr-2" />
                      Ver Menú
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-lg hover:border-[#5B2C90]/30 transition-colors">
                          <div className="flex-1">
                            <h4 className="text-[#0B2240]">{item.name}</h4>
                            <p className="text-sm text-gray-600">${item.price} c/u</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="w-24 text-right text-[#5B2C90]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t-2 border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg text-[#0B2240]">Total:</span>
                        <span className="text-2xl text-[#5B2C90]">${getCartTotal().toFixed(2)}</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-[#0B2240] mb-2 block">
                            Notas especiales (opcional)
                          </label>
                          <Textarea
                            placeholder="Ej: Sin cebolla, término medio, etc."
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            className="border-gray-300 focus:border-[#5B2C90]"
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setCart([])}
                            className="flex-1 border-gray-300"
                          >
                            Vaciar Carrito
                          </Button>
                          <Button
                            onClick={submitOrder}
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-to-r from-[#5B2C90] to-[#F28C1B] hover:from-[#F28C1B] hover:to-[#FFD23F] text-white"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Enviar Pedido
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* MIS PEDIDOS */}
          <TabsContent value="orders" className="space-y-6">
            {myOrders.length === 0 ? (
              <Card className="border-2 border-gray-100">
                <CardContent className="text-center py-12">
                  <Receipt className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">No tiene pedidos activos</p>
                  <Button
                    onClick={() => setCurrentTab("menu")}
                    className="bg-gradient-to-r from-[#0B2240] to-[#5B2C90] text-white"
                  >
                    <Utensils className="h-4 w-4 mr-2" />
                    Hacer un Pedido
                  </Button>
                </CardContent>
              </Card>
            ) : (
              myOrders.map((order: any) => {
                const StatusIcon = statusConfig[order.status]?.icon || Clock;
                const currentStep = getStatusStep(order.status);
                
                return (
                  <Card key={order.id} className="border-2 border-gray-100 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl text-[#0B2240]">
                            Pedido #{order.id?.slice(0, 8)}
                          </CardTitle>
                          <CardDescription>
                            {order.tableNumber && `Mesa ${order.tableNumber} • `}
                            {new Date(order.createdAt).toLocaleString('es-ES')}
                          </CardDescription>
                        </div>
                        <Badge className={statusConfig[order.status]?.color || "bg-gray-500 text-white"}>
                          <StatusIcon className="h-4 w-4 mr-2" />
                          {statusConfig[order.status]?.label || order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Progreso del pedido */}
                      <div className="space-y-4">
                        <h4 className="text-[#0B2240]">Progreso del Pedido</h4>
                        
                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(statusConfig).map(([key, config], index) => {
                            const Icon = config.icon;
                            const isActive = index <= currentStep;
                            const isCurrent = index === currentStep;
                            
                            return (
                              <div key={key} className="flex flex-col items-center space-y-2">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                                  isActive 
                                    ? isCurrent 
                                      ? 'bg-gradient-to-br from-[#0B2240] to-[#5B2C90] border-[#0B2240] text-white' 
                                      : 'bg-[#5B2C90] border-[#5B2C90] text-white'
                                    : 'bg-gray-100 border-gray-300 text-gray-400'
                                }`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                <span className={`text-xs text-center ${
                                  isActive ? 'text-[#0B2240]' : 'text-gray-400'
                                }`}>
                                  {config.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Información actual */}
                      <Alert className="border-[#5B2C90]/30 bg-gradient-to-r from-[#5B2C90]/5 to-[#F28C1B]/5">
                        <Info className="h-4 w-4 text-[#5B2C90]" />
                        <AlertDescription className="text-[#0B2240]">
                          {statusConfig[order.status]?.description || "Procesando su pedido..."}
                        </AlertDescription>
                      </Alert>

                      {/* Detalle de productos */}
                      <div className="space-y-3">
                        <h4 className="text-[#0B2240]">Productos</h4>
                        <div className="space-y-2">
                          {order.items?.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                              <div>
                                <span className="text-[#0B2240]">
                                  {item.quantity}x {item.name}
                                </span>
                                {item.notes && (
                                  <p className="text-xs text-gray-500">Nota: {item.notes}</p>
                                )}
                              </div>
                              <span className="text-[#5B2C90]">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        
                        {order.notes && (
                          <div className="bg-[#FFD23F]/10 border border-[#FFD23F]/30 rounded-lg p-3 mt-3">
                            <p className="text-xs text-[#0B2240]">
                              <strong>Notas del pedido:</strong> {order.notes}
                            </p>
                          </div>
                        )}

                        <div className="border-t-2 border-gray-200 pt-3 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-lg text-[#0B2240]">Total:</span>
                            <span className="text-2xl text-[#5B2C90]">${order.subtotal?.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      {order.status === "served" && (
                        <div className="pt-4 border-t border-gray-200">
                          <Button
                            onClick={requestBill}
                            disabled={requestedBill}
                            className="w-full bg-gradient-to-r from-[#0B2240] to-[#5B2C90] text-white"
                          >
                            {requestedBill ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Cuenta Solicitada
                              </>
                            ) : (
                              <>
                                <Receipt className="h-4 w-4 mr-2" />
                                Solicitar Cuenta
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center py-8 mt-12 border-t-2 border-gray-100">
          <Badge variant="outline" className="bg-[#F28C1B]/10 border-[#F28C1B] mb-3">
            <Building2 className="h-3 w-3 mr-2" />
            Powered by Globatech S.A.S
          </Badge>
          <p className="text-xs text-gray-500">© 2025 SIREST. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
