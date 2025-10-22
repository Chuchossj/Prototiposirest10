import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { 
  Users, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Utensils,
  Coffee,
  Pizza,
  Salad,
  Search,
  ShoppingCart,
  Minus,
  Edit,
  Eye
} from "lucide-react";

interface TableStatus {
  id: number;
  number: string;
  status: "libre" | "ocupada" | "reservada" | "pagando";
  guests: number;
  waiter: string;
  time?: string;
  orderTotal?: number;
}

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
  available: boolean;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

const tables: TableStatus[] = [
  { id: 1, number: "01", status: "libre", guests: 0, waiter: "" },
  { id: 2, number: "02", status: "ocupada", guests: 4, waiter: "Ana M.", time: "12:30", orderTotal: 85.50 },
  { id: 3, number: "03", status: "reservada", guests: 2, waiter: "", time: "13:00" },
  { id: 4, number: "04", status: "ocupada", guests: 6, waiter: "Ana M.", time: "12:15", orderTotal: 125.80 },
  { id: 5, number: "05", status: "libre", guests: 0, waiter: "" },
  { id: 6, number: "06", status: "pagando", guests: 3, waiter: "Ana M.", time: "11:45", orderTotal: 67.20 },
  { id: 7, number: "07", status: "libre", guests: 0, waiter: "" },
  { id: 8, number: "08", status: "ocupada", guests: 2, waiter: "Ana M.", time: "12:45", orderTotal: 42.30 }
];

const menuItems: MenuItem[] = [
  { id: 1, name: "Hamburguesa Clásica", category: "principales", price: 15.99, description: "Carne de res, lechuga, tomate, queso", available: true },
  { id: 2, name: "Pizza Margarita", category: "principales", price: 18.50, description: "Tomate, mozzarella, albahaca fresca", available: true },
  { id: 3, name: "Ensalada César", category: "ensaladas", price: 12.99, description: "Lechuga romana, aderezo césar, crutones", available: true },
  { id: 4, name: "Pasta Carbonara", category: "principales", price: 16.80, description: "Pasta con panceta, huevo, queso parmesano", available: false },
  { id: 5, name: "Café Americano", category: "bebidas", price: 3.50, description: "Café negro tradicional", available: true },
  { id: 6, name: "Limonada Natural", category: "bebidas", price: 4.25, description: "Limón fresco, agua, azúcar", available: true },
  { id: 7, name: "Cheesecake", category: "postres", price: 8.99, description: "Tarta de queso con frutos rojos", available: true },
  { id: 8, name: "Tiramisu", category: "postres", price: 9.50, description: "Postre italiano tradicional", available: true }
];

const statusColors = {
  libre: "bg-green-100 text-green-800 border-green-200",
  ocupada: "bg-red-100 text-red-800 border-red-200", 
  reservada: "bg-yellow-100 text-yellow-800 border-yellow-200",
  pagando: "bg-blue-100 text-blue-800 border-blue-200"
};

const statusIcons = {
  libre: CheckCircle,
  ocupada: Users,
  reservada: Clock,
  pagando: AlertCircle
};

export function WaiterDashboard() {
  const [selectedTable, setSelectedTable] = useState<TableStatus | null>(null);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  const myTables = tables.filter(table => table.waiter === "Ana M.");
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToOrder = (item: MenuItem) => {
    const existing = currentOrder.find(orderItem => orderItem.id === item.id);
    if (existing) {
      setCurrentOrder(currentOrder.map(orderItem => 
        orderItem.id === item.id 
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      ));
    } else {
      setCurrentOrder([...currentOrder, { 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        quantity: 1 
      }]);
    }
  };

  const removeFromOrder = (itemId: number) => {
    setCurrentOrder(currentOrder.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Mesero</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus mesas y pedidos - Ana Martínez
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            En Servicio
          </Badge>
          <Badge variant="secondary">
            Mesas asignadas: {myTables.length}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="mesas" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="mesas">Mis Mesas</TabsTrigger>
          <TabsTrigger value="menu">Menú Digital</TabsTrigger>
        </TabsList>

        <TabsContent value="mesas" className="space-y-6">
          {/* Resumen de mesas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{tables.filter(t => t.status === 'libre').length}</div>
                <p className="text-sm text-gray-600">Mesas Libres</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{myTables.filter(t => t.status === 'ocupada').length}</div>
                <p className="text-sm text-gray-600">Mis Mesas</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{tables.filter(t => t.status === 'reservada').length}</div>
                <p className="text-sm text-gray-600">Reservadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <AlertCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">${myTables.reduce((sum, t) => sum + (t.orderTotal || 0), 0).toFixed(2)}</div>
                <p className="text-sm text-gray-600">Total Ventas</p>
              </CardContent>
            </Card>
          </div>

          {/* Estado de todas las mesas */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de Mesas</CardTitle>
              <CardDescription>Vista general del restaurante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {tables.map((table) => {
                  const Icon = statusIcons[table.status];
                  return (
                    <Card 
                      key={table.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        table.waiter === "Ana M." ? "ring-2 ring-blue-200" : ""
                      }`}
                      onClick={() => setSelectedTable(table)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-lg">#{table.number}</span>
                          <Icon className="h-4 w-4" />
                        </div>
                        <Badge className={`text-xs ${statusColors[table.status]}`}>
                          {table.status}
                        </Badge>
                        {table.guests > 0 && (
                          <p className="text-xs text-gray-600 mt-1">{table.guests} personas</p>
                        )}
                        {table.time && (
                          <p className="text-xs text-gray-500">{table.time}</p>
                        )}
                        {table.orderTotal && (
                          <p className="text-xs font-medium text-green-600">${table.orderTotal}</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Mis mesas activas */}
          <Card>
            <CardHeader>
              <CardTitle>Mis Mesas Activas</CardTitle>
              <CardDescription>Mesas bajo tu responsabilidad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myTables.map((table) => (
                  <div key={table.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">#{table.number}</span>
                      </div>
                      <div>
                        <p className="font-medium">Mesa {table.number}</p>
                        <p className="text-sm text-gray-600">
                          {table.guests} personas • Desde {table.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-bold text-lg">${table.orderTotal}</p>
                        <Badge className={`text-xs ${statusColors[table.status]}`}>
                          {table.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                        <Button size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          {/* Búsqueda y filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar platos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={selectedCategory === "todos" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("todos")}
                    size="sm"
                  >
                    Todos
                  </Button>
                  <Button 
                    variant={selectedCategory === "principales" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("principales")}
                    size="sm"
                  >
                    <Utensils className="h-4 w-4 mr-2" />
                    Principales
                  </Button>
                  <Button 
                    variant={selectedCategory === "bebidas" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("bebidas")}
                    size="sm"
                  >
                    <Coffee className="h-4 w-4 mr-2" />
                    Bebidas
                  </Button>
                  <Button 
                    variant={selectedCategory === "postres" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("postres")}
                    size="sm"
                  >
                    <Pizza className="h-4 w-4 mr-2" />
                    Postres
                  </Button>
                  <Button 
                    variant={selectedCategory === "ensaladas" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("ensaladas")}
                    size="sm"
                  >
                    <Salad className="h-4 w-4 mr-2" />
                    Ensaladas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Menú de productos */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMenuItems.map((item) => (
                  <Card key={item.id} className={`${!item.available ? 'opacity-50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <span className="font-bold text-lg">${item.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant={item.available ? "secondary" : "destructive"}>
                          {item.available ? "Disponible" : "Agotado"}
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => addToOrder(item)}
                          disabled={!item.available}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Carrito de pedido */}
            <Card className="h-fit sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Pedido Actual</span>
                </CardTitle>
                <CardDescription>
                  {selectedTable ? `Mesa ${selectedTable.number}` : "Selecciona una mesa"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentOrder.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No hay productos en el pedido
                  </p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {currentOrder.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">${item.price} c/u</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-xl">${getOrderTotal().toFixed(2)}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <Button className="w-full" disabled={!selectedTable}>
                          Enviar a Cocina
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => setCurrentOrder([])}>
                          Limpiar Pedido
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}