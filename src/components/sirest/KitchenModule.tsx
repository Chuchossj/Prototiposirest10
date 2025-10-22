import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner@2.0.3";
import { 
  ChefHat, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Timer,
  PlayCircle,
  PauseCircle,
  Bell,
  Target,
  Activity,
  Utensils
} from "lucide-react";
import { useRealtimeData, apiRequest } from "../../utils/useRealtimeData";

interface KitchenModuleProps {
  activeTab?: string;
  accessToken: string;
}

export function KitchenModule({ activeTab, accessToken }: KitchenModuleProps) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [chefNotes, setChefNotes] = useState("");
  
  // Obtener pedidos en tiempo real
  const { data: ordersData, refetch } = useRealtimeData({
    endpoint: "/orders",
    accessToken,
    refreshInterval: 2000 // Actualizar cada 2 segundos
  });

  const orders = ordersData?.orders || [];

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await apiRequest(`/orders/${orderId}`, {
        method: "PUT",
        body: { status: newStatus },
        accessToken
      });

      if (newStatus === "preparing") {
        toast.success("Pedido en preparación");
      } else if (newStatus === "ready") {
        toast.success("Pedido marcado como listo");
      }

      refetch();
    } catch (error) {
      console.error("Error actualizando pedido:", error);
      toast.error("Error al actualizar pedido");
    }
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter((order: any) => order.status === status);
  };

  const getAverageWaitTime = () => {
    const completedOrders = orders.filter((order: any) => order.status === "ready" || order.status === "served");
    if (completedOrders.length === 0) return 0;
    return Math.round(completedOrders.length * 15); // Estimación simple
  };

  const getUrgentOrders = () => {
    return orders.filter((order: any) => {
      if (order.status === "pending" || order.status === "preparing") {
        const orderTime = new Date(order.createdAt).getTime();
        const now = new Date().getTime();
        const minutesPassed = (now - orderTime) / (1000 * 60);
        return minutesPassed > 20; // Urgente si han pasado más de 20 minutos
      }
      return false;
    }).length;
  };

  const getEfficiencyRate = () => {
    const completed = orders.filter((o: any) => o.status === "ready" || o.status === "served").length;
    const total = orders.length;
    if (total === 0) return 100;
    return Math.round((completed / total) * 100);
  };

  // Mapear activeTab a las pestañas internas
  const getDefaultTab = () => {
    switch (activeTab) {
      case "pending-orders":
        return "active";
      case "preparing-orders":
        return "active";
      case "ready-orders":
        return "ready";
      default:
        return "active";
    }
  };
  
  const [activeInternalTab, setActiveInternalTab] = useState(getDefaultTab());

  const priorityColors = {
    normal: "bg-gray-100 text-gray-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800"
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
            Panel de Cocina
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Gestión de pedidos y preparación
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Cocina Operativa
          </Badge>
          <Badge className="bg-orange-100 text-orange-800 border-orange-300">
            Turno: 11:00 - 22:00
          </Badge>
        </div>
      </div>

      {/* Estadísticas de cocina */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Pendientes</CardTitle>
            <Clock className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getOrdersByStatus("pending").length}</div>
            <div className="text-xs opacity-90 mt-1">En cola</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">En Preparación</CardTitle>
            <ChefHat className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getOrdersByStatus("preparing").length}</div>
            <div className="text-xs opacity-90 mt-1">Cocinando</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Listas</CardTitle>
            <CheckCircle className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getOrdersByStatus("ready").length}</div>
            <div className="text-xs opacity-90 mt-1">Para servir</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Eficiencia</CardTitle>
            <Target className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getEfficiencyRate()}%</div>
            <div className="text-xs opacity-90 mt-1">
              {getUrgentOrders() > 0 && (
                <span>⚠️ {getUrgentOrders()} urgentes</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeInternalTab} onValueChange={setActiveInternalTab} className="space-y-8">
        <TabsList className="grid w-full max-w-lg grid-cols-3 bg-white border shadow-sm">
          <TabsTrigger value="active" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900">
            Órdenes Activas
          </TabsTrigger>
          <TabsTrigger value="ready" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
            Listas
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Completadas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-8">
          {/* Alertas urgentes */}
          {getUrgentOrders() > 0 && (
            <Card className="border-red-200 bg-red-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span>⚠️ Atención Requerida</span>
                </CardTitle>
                <CardDescription className="text-red-600">
                  {getUrgentOrders()} órden(es) con tiempo de espera elevado
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Órdenes pendientes */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-blue-900">Órdenes Pendientes</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {getOrdersByStatus("pending").map((order: any) => {
                const orderTime = new Date(order.createdAt).getTime();
                const now = new Date().getTime();
                const minutesPassed = Math.floor((now - orderTime) / (1000 * 60));
                const isUrgent = minutesPassed > 20;

                return (
                  <Card key={order.id} className={`border-yellow-200 border-0 shadow-lg hover:shadow-xl transition-shadow ${isUrgent ? 'ring-2 ring-red-500' : ''}`}>
                    <CardHeader className="pb-3 border-b border-yellow-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-blue-900">Mesa #{order.tableNumber}</CardTitle>
                          <CardDescription>
                            {minutesPassed} min • {order.items?.length || 0} productos
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {isUrgent && (
                            <Badge className="bg-red-100 text-red-800 animate-pulse">
                              🔥 Urgente
                            </Badge>
                          )}
                          <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                            <Timer className="h-3 w-3 mr-1" />
                            {minutesPassed} min
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div className="space-y-3">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-start p-3 bg-yellow-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-blue-900">{item.quantity}x {item.name}</p>
                              {item.notes && (
                                <p className="text-sm text-orange-600 italic mt-1">📝 {item.notes}</p>
                              )}
                              <p className="text-xs text-gray-600">Categoría: {item.category}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {order.notes && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-900">📝 {order.notes}</p>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        onClick={() => updateOrderStatus(order.id, "preparing")}
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Iniciar Preparación
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Órdenes en preparación */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-blue-900">En Preparación</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {getOrdersByStatus("preparing").map((order: any) => {
                const orderTime = new Date(order.createdAt).getTime();
                const now = new Date().getTime();
                const minutesPassed = Math.floor((now - orderTime) / (1000 * 60));

                return (
                  <Card key={order.id} className="border-blue-200 border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-3 border-b border-blue-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-blue-900">Mesa #{order.tableNumber}</CardTitle>
                          <CardDescription>
                            {minutesPassed} min en preparación
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="border-blue-300 text-blue-700">
                          <Timer className="h-3 w-3 mr-1" />
                          {minutesPassed} min
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div className="space-y-3">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-start p-3 bg-blue-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-blue-900">{item.quantity}x {item.name}</p>
                              {item.notes && (
                                <p className="text-sm text-orange-600 italic mt-1">📝 {item.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline"
                          className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                          onClick={() => updateOrderStatus(order.id, "pending")}
                        >
                          <PauseCircle className="h-4 w-4 mr-2" />
                          Pausar
                        </Button>
                        <Button 
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                          onClick={() => updateOrderStatus(order.id, "ready")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar Listo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ready" className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-blue-900">Órdenes Listas para Servir</h3>
              <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                <Bell className="h-4 w-4 mr-2" />
                Notificar a Meseros
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {getOrdersByStatus("ready").map((order: any) => (
                <Card key={order.id} className="border-green-200 bg-green-50 border-0 shadow-lg">
                  <CardHeader className="pb-3 border-b border-green-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-green-900">Mesa #{order.tableNumber}</CardTitle>
                        <CardDescription className="text-green-700">
                          {order.items?.length || 0} productos listos
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-300 animate-pulse">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        ✅ Listo
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="space-y-3">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-start p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex-1">
                            <p className="font-medium text-green-900">{item.quantity}x {item.name}</p>
                            {item.notes && (
                              <p className="text-sm text-orange-600 italic mt-1">📝 {item.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm bg-white p-3 rounded-lg border border-green-200">
                      <span className="text-green-800">Pedido esperando entrega</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl text-blue-900">Órdenes Completadas Hoy</CardTitle>
              <CardDescription>
                Historial de pedidos entregados exitosamente
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {getOrdersByStatus("served").concat(getOrdersByStatus("paid")).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">#{order.tableNumber}</span>
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">Mesa {order.tableNumber}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} • {order.items?.length || 0} productos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-lg text-green-600">✅ Completado</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Activity className="h-12 w-12 text-blue-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-900">{getAverageWaitTime()} min</div>
            <p className="text-sm text-gray-600">Tiempo promedio estimado</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-green-600">{getEfficiencyRate()}%</div>
            <p className="text-sm text-gray-600">Eficiencia del equipo</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Utensils className="h-12 w-12 text-purple-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-purple-600">{orders.length}</div>
            <p className="text-sm text-gray-600">Órdenes procesadas hoy</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
