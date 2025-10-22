import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { toast } from "sonner@2.0.3";
import { 
  Users, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  ShoppingCart,
  Minus,
  Eye,
  Send,
  Bell,
  ChefHat,
  X,
  Utensils
} from "lucide-react";
import { useRealtimeData, apiRequest } from "../../utils/useRealtimeData";

interface WaiterModuleProps {
  activeTab?: string;
  accessToken: string;
}

export function WaiterModule({ activeTab, accessToken }: WaiterModuleProps) {
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [currentOrder, setCurrentOrder] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);
  const [orderNotes, setOrderNotes] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  
  // Obtener datos en tiempo real
  const { data: tablesData, refetch: refetchTables } = useRealtimeData({
    endpoint: "/tables",
    accessToken,
    refreshInterval: 2000
  });

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

  const tables = tablesData?.tables || [];
  const products = productsData?.products || [];
  const allOrders = ordersData?.orders || [];

  // Filtrar productos
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.stock > 0;
  });

  // Mis pedidos listos
  const readyOrders = allOrders.filter((order: any) => order.status === "ready");

  const statusColors = {
    disponible: "bg-green-50 text-green-700 border-green-300",
    ocupada: "bg-blue-50 text-blue-700 border-blue-300",
    reservada: "bg-yellow-50 text-yellow-700 border-yellow-300",
    pagando: "bg-gray-50 text-gray-700 border-gray-300"
  };

  const statusIcons = {
    disponible: CheckCircle,
    ocupada: Users,
    reservada: Clock,
    pagando: AlertCircle
  };

  const addToOrder = (item: any) => {
    const existing = currentOrder.find(orderItem => orderItem.id === item.id);
    if (existing) {
      setCurrentOrder(currentOrder.map(orderItem => 
        orderItem.id === item.id 
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      ));
    } else {
      setCurrentOrder([...currentOrder, { 
        ...item,
        quantity: 1,
        notes: ""
      }]);
    }
    toast.success(`${item.name} agregado al pedido`);
  };

  const removeFromOrder = (itemId: string) => {
    setCurrentOrder(currentOrder.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromOrder(itemId);
    } else {
      setCurrentOrder(currentOrder.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getOrderTotal = () => {
    return currentOrder.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const sendOrderToKitchen = async () => {
    if (!selectedTable || currentOrder.length === 0) {
      toast.error("Seleccione una mesa y agregue productos");
      return;
    }

    try {
      const orderData = {
        tableNumber: selectedTable.number,
        tableId: selectedTable.id,
        items: currentOrder.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          notes: item.notes
        })),
        subtotal: getOrderTotal(),
        notes: orderNotes,
        status: "pending"
      };

      const response = await apiRequest("/orders", {
        method: "POST",
        body: orderData,
        accessToken
      });

      if (response.success) {
        // Actualizar estado de la mesa
        await apiRequest(`/tables/${selectedTable.id}`, {
          method: "PUT",
          body: { ...selectedTable, status: "ocupada" },
          accessToken
        });

        toast.success(`✅ Pedido enviado a cocina - Mesa ${selectedTable.number}`);
        setCurrentOrder([]);
        setOrderNotes("");
        setSelectedTable(null);
        refetchOrders();
        refetchTables();
      }
    } catch (error) {
      console.error("Error enviando pedido:", error);
      toast.error("❌ Error al enviar pedido a cocina");
    }
  };

  const markOrderAsServed = async (orderId: string) => {
    try {
      await apiRequest(`/orders/${orderId}`, {
        method: "PUT",
        body: { status: "served" },
        accessToken
      });

      toast.success("✅ Pedido marcado como servido");
      refetchOrders();
    } catch (error) {
      console.error("Error marcando pedido:", error);
      toast.error("❌ Error al marcar pedido");
    }
  };

  const viewOrder = (order: any) => {
    setViewingOrder(order);
    setIsViewDialogOpen(true);
  };

  // Mapear activeTab a las pestañas internas
  const getDefaultTab = () => {
    switch (activeTab) {
      case "tables":
        return "mesas";
      case "new-order":
        return "menu";
      case "active-orders":
        return "ready";
      default:
        return "mesas";
    }
  };
  
  const [activeInternalTab, setActiveInternalTab] = useState(getDefaultTab());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Mesero
          </h1>
          <p className="text-gray-600 mt-1">
            Gestión de mesas y pedidos
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            En Servicio
          </Badge>
          {readyOrders.length > 0 && (
            <Badge className="bg-red-100 text-red-800 border-red-300 animate-pulse">
              <Bell className="h-3 w-3 mr-1" />
              {readyOrders.length} pedido{readyOrders.length > 1 ? 's' : ''} listo{readyOrders.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeInternalTab} onValueChange={setActiveInternalTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-white border border-gray-200 shadow-sm">
          <TabsTrigger value="mesas" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
            <Utensils className="h-4 w-4 mr-2" />
            Mis Mesas
          </TabsTrigger>
          <TabsTrigger value="menu" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Nuevo Pedido
          </TabsTrigger>
          <TabsTrigger value="ready" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white relative">
            <ChefHat className="h-4 w-4 mr-2" />
            Pedidos Listos
            {readyOrders.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center rounded-full">
                {readyOrders.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mesas" className="space-y-6">
          {/* Resumen de mesas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Mesas Libres</p>
                    <p className="text-3xl font-bold text-green-600">{tables.filter((t: any) => t.status === 'disponible').length}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ocupadas</p>
                    <p className="text-3xl font-bold text-blue-600">{tables.filter((t: any) => t.status === 'ocupada').length}</p>
                  </div>
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Reservadas</p>
                    <p className="text-3xl font-bold text-yellow-600">{tables.filter((t: any) => t.status === 'reservada').length}</p>
                  </div>
                  <Clock className="h-10 w-10 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pedidos Activos</p>
                    <p className="text-3xl font-bold text-gray-900">{allOrders.filter((o: any) => o.status !== 'paid' && o.status !== 'served').length}</p>
                  </div>
                  <ShoppingCart className="h-10 w-10 text-gray-900" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vista general de mesas */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200 bg-gray-50">
              <CardTitle className="text-xl text-gray-900">Estado General de Mesas</CardTitle>
              <CardDescription>Vista completa del restaurante</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {tables.map((table: any) => {
                  const Icon = statusIcons[table.status as keyof typeof statusIcons] || Users;
                  
                  return (
                    <Card 
                      key={table.id} 
                      className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                        selectedTable?.id === table.id ? "ring-2 ring-gray-900 border-gray-900" : "border-gray-200"
                      }`}
                      onClick={() => setSelectedTable(table)}
                    >
                      <CardContent className="p-4 text-center space-y-2">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-lg text-gray-900">#{table.number}</span>
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <Badge className={`text-xs ${statusColors[table.status as keyof typeof statusColors]}`}>
                          {table.status}
                        </Badge>
                        {table.capacity && (
                          <p className="text-xs text-gray-600">{table.capacity} personas</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Mis pedidos activos */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200 bg-gray-50">
              <CardTitle className="text-xl text-gray-900">Mis Pedidos Activos</CardTitle>
              <CardDescription>Pedidos en proceso</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {allOrders.filter((o: any) => o.status !== 'paid' && o.status !== 'served').length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p>No hay pedidos activos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allOrders.filter((o: any) => o.status !== 'paid' && o.status !== 'served').map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${
                          order.status === 'pending' ? 'bg-yellow-500' :
                          order.status === 'preparing' ? 'bg-blue-500' :
                          'bg-green-500'
                        }`}>
                          #{order.tableNumber}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Mesa {order.tableNumber}</p>
                          <p className="text-sm text-gray-600">{order.items?.length || 0} productos • ${order.subtotal?.toLocaleString() || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                          order.status === 'preparing' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          'bg-green-100 text-green-800 border-green-300'
                        }>
                          {order.status === 'pending' ? 'Pendiente' :
                           order.status === 'preparing' ? 'Preparando' :
                           'Listo'}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => viewOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          {/* Búsqueda y filtros */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar platos en el menú..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={selectedCategory === "todos" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("todos")}
                    size="sm"
                    className={selectedCategory === "todos" ? "bg-gray-900 hover:bg-gray-800" : ""}
                  >
                    Todos
                  </Button>
                  <Button 
                    variant={selectedCategory === "Platos Fuertes" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("Platos Fuertes")}
                    size="sm"
                    className={selectedCategory === "Platos Fuertes" ? "bg-gray-900 hover:bg-gray-800" : ""}
                  >
                    Principales
                  </Button>
                  <Button 
                    variant={selectedCategory === "Bebidas" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("Bebidas")}
                    size="sm"
                    className={selectedCategory === "Bebidas" ? "bg-gray-900 hover:bg-gray-800" : ""}
                  >
                    Bebidas
                  </Button>
                  <Button 
                    variant={selectedCategory === "Postres" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("Postres")}
                    size="sm"
                    className={selectedCategory === "Postres" ? "bg-gray-900 hover:bg-gray-800" : ""}
                  >
                    Postres
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Menú de productos */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((item: any) => (
                  <Card key={item.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <span className="font-bold text-lg text-green-600">${item.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Badge className="bg-green-50 text-green-700 border-green-300">
                          Stock: {item.stock}
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => addToOrder(item)}
                          className="bg-gray-900 hover:bg-gray-800 text-white"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Agregar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Carrito de pedido */}
            <Card className="h-fit sticky top-6 border border-gray-200 shadow-lg">
              <CardHeader className="border-b border-gray-200 bg-gray-50">
                <CardTitle className="flex items-center space-x-2 text-lg text-gray-900">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Nuevo Pedido</span>
                </CardTitle>
                <CardDescription>
                  {selectedTable ? `Mesa ${selectedTable.number}` : "Selecciona una mesa"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {!selectedTable ? (
                  <div className="text-center py-4">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      Selecciona una mesa para comenzar un pedido
                    </p>
                  </div>
                ) : currentOrder.length === 0 ? (
                  <div className="text-center py-6">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-center text-gray-500 text-sm">
                      No hay productos en el pedido
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {currentOrder.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                            <p className="text-xs text-gray-600">${item.price.toLocaleString()} c/u</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => removeFromOrder(item.id)}
                              className="w-7 h-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm text-gray-700">Notas del pedido (opcional)</Label>
                      <Textarea
                        placeholder="Ej: Sin sal, término medio, etc."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="mt-2 text-sm"
                        rows={2}
                      />
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-bold text-2xl text-green-600">${getOrderTotal().toLocaleString()}</span>
                    </div>
                    
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={sendOrderToKitchen}
                      size="lg"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Enviar a Cocina
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ready" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-900">Pedidos Listos para Servir</h3>
              <Badge className="bg-green-100 text-green-800 border-green-300">
                <ChefHat className="h-4 w-4 mr-2" />
                {readyOrders.length} pedidos listos
              </Badge>
            </div>
            
            {readyOrders.length === 0 ? (
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-12 text-center">
                  <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No hay pedidos listos en este momento</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {readyOrders.map((order: any) => (
                  <Card key={order.id} className="border-2 border-green-300 bg-green-50 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3 border-b border-green-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-green-900">Mesa #{order.tableNumber}</CardTitle>
                          <CardDescription className="text-green-700">
                            {order.items?.length || 0} productos
                          </CardDescription>
                        </div>
                        <Badge className="bg-green-600 text-white border-green-600 animate-pulse">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Listo
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-start p-2 bg-white rounded-lg border border-green-200">
                            <div className="flex-1">
                              <p className="font-medium text-green-900 text-sm">{item.quantity}x {item.name}</p>
                              {item.notes && (
                                <p className="text-xs text-gray-600 italic mt-1">📝 {item.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm bg-white p-3 rounded-lg border border-green-200">
                        <span className="text-green-800 font-medium">Total:</span>
                        <span className="font-bold text-green-900">${order.subtotal?.toLocaleString() || 0}</span>
                      </div>

                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => markOrderAsServed(order.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar como Servido
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para ver detalles del pedido */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Detalles del Pedido - Mesa {viewingOrder?.tableNumber}</DialogTitle>
            <DialogDescription>
              Información completa del pedido
            </DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Productos:</h4>
                {viewingOrder.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="text-sm">{item.quantity}x {item.name}</span>
                    <span className="text-sm font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              {viewingOrder.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Notas:</h4>
                  <p className="text-sm text-gray-600 p-2 bg-yellow-50 rounded border border-yellow-200">{viewingOrder.notes}</p>
                </div>
              )}
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-xl text-green-600">${viewingOrder.subtotal?.toLocaleString() || 0}</span>
              </div>
              <Badge className={
                viewingOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300 w-full justify-center' :
                viewingOrder.status === 'preparing' ? 'bg-blue-100 text-blue-800 border-blue-300 w-full justify-center' :
                'bg-green-100 text-green-800 border-green-300 w-full justify-center'
              }>
                Estado: {viewingOrder.status === 'pending' ? 'Pendiente' :
                         viewingOrder.status === 'preparing' ? 'En Preparación' :
                         'Listo'}
              </Badge>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
