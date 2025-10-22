import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  ChefHat, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Utensils,
  Timer,
  Users,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Bell
} from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
  preparationTime: number; // en minutos
}

interface KitchenOrder {
  id: number;
  tableNumber: string;
  waiter: string;
  items: OrderItem[];
  orderTime: string;
  status: "pending" | "preparing" | "ready" | "delivered";
  priority: "normal" | "high" | "urgent";
  estimatedTime: number;
  actualTime?: number;
  chef?: string;
}

const mockOrders: KitchenOrder[] = [
  {
    id: 1,
    tableNumber: "02",
    waiter: "Ana M.",
    orderTime: "12:30",
    status: "pending",
    priority: "normal",
    estimatedTime: 25,
    items: [
      { id: 1, name: "Hamburguesa Clásica", quantity: 2, category: "principales", preparationTime: 15, notes: "Sin cebolla" },
      { id: 2, name: "Pizza Margarita", quantity: 1, category: "principales", preparationTime: 20 },
      { id: 3, name: "Papas Fritas", quantity: 2, category: "acompañamientos", preparationTime: 8 }
    ]
  },
  {
    id: 2,
    tableNumber: "05",
    waiter: "Ana M.",
    orderTime: "12:25",
    status: "preparing",
    priority: "high",
    estimatedTime: 18,
    actualTime: 12,
    chef: "Carlos R.",
    items: [
      { id: 4, name: "Pasta Carbonara", quantity: 1, category: "principales", preparationTime: 18 },
      { id: 5, name: "Ensalada César", quantity: 1, category: "ensaladas", preparationTime: 8 }
    ]
  },
  {
    id: 3,
    tableNumber: "08",
    waiter: "Ana M.",
    orderTime: "12:45",
    status: "preparing",
    priority: "urgent",
    estimatedTime: 15,
    actualTime: 18,
    chef: "María L.",
    items: [
      { id: 6, name: "Salmón a la Plancha", quantity: 1, category: "principales", preparationTime: 15, notes: "Punto medio" },
      { id: 7, name: "Verduras al Vapor", quantity: 1, category: "acompañamientos", preparationTime: 10 }
    ]
  },
  {
    id: 4,
    tableNumber: "12",
    waiter: "Luis T.",
    orderTime: "12:20",
    status: "ready",
    priority: "normal",
    estimatedTime: 22,
    actualTime: 20,
    chef: "Carlos R.",
    items: [
      { id: 8, name: "Pollo al Horno", quantity: 2, category: "principales", preparationTime: 25 },
      { id: 9, name: "Arroz con Verduras", quantity: 2, category: "acompañamientos", preparationTime: 12 }
    ]
  },
  {
    id: 5,
    tableNumber: "15",
    waiter: "Luis T.",
    orderTime: "12:15",
    status: "ready",
    priority: "normal",
    estimatedTime: 20,
    actualTime: 22,
    chef: "María L.",
    items: [
      { id: 10, name: "Lasaña de Carne", quantity: 1, category: "principales", preparationTime: 30 },
      { id: 11, name: "Pan de Ajo", quantity: 1, category: "entradas", preparationTime: 5 }
    ]
  }
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  preparing: "bg-blue-100 text-blue-800 border-blue-200",
  ready: "bg-green-100 text-green-800 border-green-200",
  delivered: "bg-gray-100 text-gray-800 border-gray-200"
};

const priorityColors = {
  normal: "bg-gray-100 text-gray-800",
  high: "bg-orange-100 text-orange-800", 
  urgent: "bg-red-100 text-red-800"
};

const statusIcons = {
  pending: Clock,
  preparing: PlayCircle,
  ready: CheckCircle,
  delivered: Users
};

export function KitchenDashboard() {
  const [orders, setOrders] = useState<KitchenOrder[]>(mockOrders);
  const [selectedCategory, setSelectedCategory] = useState("todos");

  const updateOrderStatus = (orderId: number, newStatus: KitchenOrder["status"]) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, chef: newStatus === "preparing" ? "Carlos R." : order.chef }
        : order
    ));
  };

  const getOrdersByStatus = (status: KitchenOrder["status"]) => {
    return orders.filter(order => order.status === status);
  };

  const getAverageWaitTime = () => {
    const completedOrders = orders.filter(order => order.actualTime);
    if (completedOrders.length === 0) return 0;
    return Math.round(completedOrders.reduce((sum, order) => sum + (order.actualTime || 0), 0) / completedOrders.length);
  };

  const getUrgentOrders = () => {
    return orders.filter(order => 
      order.priority === "urgent" || 
      (order.status === "preparing" && (order.actualTime || 0) > order.estimatedTime + 5)
    ).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Cocina</h1>
          <p className="text-gray-600 mt-1">
            Gestión de pedidos y preparación - Carlos Rodríguez (Chef)
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Cocina Activa
          </Badge>
          <Badge variant="secondary">
            Turno: 11:00 - 22:00
          </Badge>
        </div>
      </div>

      {/* Estadísticas de cocina */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getOrdersByStatus("pending").length}</div>
            <div className="text-xs text-gray-600">
              En cola de preparación
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Preparación</CardTitle>
            <ChefHat className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getOrdersByStatus("preparing").length}</div>
            <div className="text-xs text-gray-600">
              Siendo cocinadas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getOrdersByStatus("ready").length}</div>
            <div className="text-xs text-gray-600">
              Esperando entrega
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Timer className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAverageWaitTime()}min</div>
            <div className="text-xs text-gray-600">
              {getUrgentOrders() > 0 && (
                <span className="text-red-600">{getUrgentOrders()} urgentes</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="active">Órdenes Activas</TabsTrigger>
          <TabsTrigger value="ready">Listas</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Alertas urgentes */}
          {getUrgentOrders() > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Atención Requerida</span>
                </CardTitle>
                <CardDescription className="text-red-600">
                  {getUrgentOrders()} órden(es) requieren atención inmediata
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Órdenes pendientes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Órdenes Pendientes</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {getOrdersByStatus("pending").map((order) => {
                const Icon = statusIcons[order.status];
                return (
                  <Card key={order.id} className="border-yellow-200">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Mesa #{order.tableNumber}</CardTitle>
                          <CardDescription>
                            {order.waiter} • {order.orderTime}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={priorityColors[order.priority]}>
                            {order.priority === "urgent" ? "Urgente" : 
                             order.priority === "high" ? "Alta" : "Normal"}
                          </Badge>
                          <Badge variant="outline">
                            <Timer className="h-3 w-3 mr-1" />
                            {order.estimatedTime}min
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium">{item.quantity}x {item.name}</p>
                              {item.notes && (
                                <p className="text-sm text-gray-600 italic">Nota: {item.notes}</p>
                              )}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {item.preparationTime}min
                            </Badge>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1"
                          onClick={() => updateOrderStatus(order.id, "preparing")}
                        >
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Iniciar
                        </Button>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Órdenes en preparación */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">En Preparación</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {getOrdersByStatus("preparing").map((order) => {
                const isDelayed = (order.actualTime || 0) > order.estimatedTime + 5;
                return (
                  <Card key={order.id} className={`border-blue-200 ${isDelayed ? 'ring-2 ring-red-300' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Mesa #{order.tableNumber}</CardTitle>
                          <CardDescription>
                            Chef: {order.chef} • {order.orderTime}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={`${priorityColors[order.priority]} ${isDelayed ? 'bg-red-100 text-red-800' : ''}`}>
                            {isDelayed ? "Demorado" : 
                             order.priority === "urgent" ? "Urgente" : 
                             order.priority === "high" ? "Alta" : "Normal"}
                          </Badge>
                          <Badge variant="outline" className={isDelayed ? "border-red-300 text-red-600" : ""}>
                            <Timer className="h-3 w-3 mr-1" />
                            {order.actualTime || 0}/{order.estimatedTime}min
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium">{item.quantity}x {item.name}</p>
                              {item.notes && (
                                <p className="text-sm text-gray-600 italic">Nota: {item.notes}</p>
                              )}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {item.preparationTime}min
                            </Badge>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, "pending")}
                        >
                          <PauseCircle className="h-4 w-4 mr-2" />
                          Pausar
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => updateOrderStatus(order.id, "ready")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Listo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ready" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Órdenes Listas para Servir</h3>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notificar Meseros
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {getOrdersByStatus("ready").map((order) => (
                <Card key={order.id} className="border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Mesa #{order.tableNumber}</CardTitle>
                        <CardDescription>
                          Chef: {order.chef} • Listo desde {order.orderTime}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Listo
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">{item.quantity}x {item.name}</p>
                            {item.notes && (
                              <p className="text-sm text-gray-600 italic">Nota: {item.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Tiempo total:</span>
                      <span className="font-medium">{order.actualTime}min</span>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => updateOrderStatus(order.id, "delivered")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Marcar como Entregado
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Órdenes Completadas Hoy</CardTitle>
              <CardDescription>
                Historial de pedidos entregados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getOrdersByStatus("delivered").map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">#{order.tableNumber}</span>
                      </div>
                      <div>
                        <p className="font-medium">Mesa {order.tableNumber}</p>
                        <p className="text-sm text-gray-600">
                          {order.orderTime} • Chef: {order.chef}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.items.length} platos</p>
                      <p className="text-sm text-gray-600">
                        {order.actualTime}min • 
                        <span className={`ml-1 ${
                          (order.actualTime || 0) <= order.estimatedTime ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {(order.actualTime || 0) <= order.estimatedTime ? 'A tiempo' : 'Demorado'}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}