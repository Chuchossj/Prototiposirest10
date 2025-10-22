import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { 
  Clock, 
  CheckCircle, 
  Star,
  MapPin,
  Phone,
  Mail,
  Users,
  Calendar,
  CreditCard,
  Receipt,
  ChefHat,
  Utensils,
  Coffee,
  Pizza,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Heart,
  Share2
} from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
  rating: number;
  reviews: number;
  preparationTime: number;
  available: boolean;
  popular?: boolean;
  vegetarian?: boolean;
  spicy?: boolean;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface CustomerOrder {
  id: number;
  items: OrderItem[];
  status: "pendiente" | "preparando" | "listo" | "entregado";
  orderTime: string;
  estimatedTime?: number;
  total: number;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Hamburguesa Gourmet",
    category: "principales",
    price: 18.99,
    description: "Carne Angus, queso brie, cebolla caramelizada, arúgula y salsa especial",
    rating: 4.8,
    reviews: 124,
    preparationTime: 20,
    available: true,
    popular: true
  },
  {
    id: 2,
    name: "Pizza Quattro Stagioni",
    category: "principales", 
    price: 22.50,
    description: "Tomate, mozzarella, jamón, champiñones, alcachofas y aceitunas",
    rating: 4.6,
    reviews: 89,
    preparationTime: 25,
    available: true,
    vegetarian: false
  },
  {
    id: 3,
    name: "Ensalada Mediterránea",
    category: "ensaladas",
    price: 14.99,
    description: "Mix de lechugas, tomates cherry, queso feta, aceitunas, pepino",
    rating: 4.5,
    reviews: 67,
    preparationTime: 10,
    available: true,
    vegetarian: true
  },
  {
    id: 4,
    name: "Risotto de Hongos",
    category: "principales",
    price: 19.80,
    description: "Arroz arborio, mix de hongos silvestres, parmesano, trufa",
    rating: 4.9,
    reviews: 156,
    preparationTime: 30,
    available: true,
    vegetarian: true
  },
  {
    id: 5,
    name: "Café Espresso",
    category: "bebidas",
    price: 3.50,
    description: "Café espresso italiano tradicional",
    rating: 4.3,
    reviews: 234,
    preparationTime: 3,
    available: true
  },
  {
    id: 6,
    name: "Smoothie Tropical",
    category: "bebidas",
    price: 6.25,
    description: "Mango, piña, coco, yogurt griego",
    rating: 4.4,
    reviews: 78,
    preparationTime: 5,
    available: true
  },
  {
    id: 7,
    name: "Tiramisú Artesanal",
    category: "postres",
    price: 8.99,
    description: "Receta tradicional italiana con mascarpone y café",
    rating: 4.7,
    reviews: 112,
    preparationTime: 5,
    available: true
  },
  {
    id: 8,
    name: "Tacos de Pescado",
    category: "principales",
    price: 16.50,
    description: "Pescado del día, salsa criolla, aguacate, col morada",
    rating: 4.6,
    reviews: 93,
    preparationTime: 18,
    available: false,
    spicy: true
  }
];

const currentOrder: CustomerOrder = {
  id: 1,
  status: "preparando",
  orderTime: "12:30",
  estimatedTime: 25,
  total: 45.48,
  items: [
    { id: 1, name: "Hamburguesa Gourmet", price: 18.99, quantity: 1 },
    { id: 3, name: "Ensalada Mediterránea", price: 14.99, quantity: 1 },
    { id: 5, name: "Café Espresso", price: 3.50, quantity: 2 }
  ]
};

const statusColors = {
  pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
  preparando: "bg-blue-100 text-blue-800 border-blue-200",
  listo: "bg-green-100 text-green-800 border-green-200",
  entregado: "bg-gray-100 text-gray-800 border-gray-200"
};

const statusIcons = {
  pendiente: Clock,
  preparando: ChefHat,
  listo: CheckCircle,
  entregado: Receipt
};

export function CustomerDashboard() {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [favorites, setFavorites] = useState<number[]>([1, 4]);

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item: MenuItem) => {
    const existing = cart.find(cartItem => cartItem.id === item.id);
    if (existing) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        quantity: 1 
      }]);
    }
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const toggleFavorite = (itemId: number) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getEstimatedTime = () => {
    if (cart.length === 0) return 0;
    const maxTime = Math.max(...cart.map(item => {
      const menuItem = menuItems.find(mi => mi.id === item.id);
      return menuItem?.preparationTime || 0;
    }));
    return maxTime + 5; // Buffer time
  };

  return (
    <div className="space-y-6">
      {/* Header del restaurante */}
      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Restaurante Bella Vista</h1>
              <p className="text-red-100 mb-4">
                Cocina mediterránea con un toque moderno
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Av. Principal 123, Centro</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>+57 300 123 4567</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span>4.6 (1,234 reseñas)</span>
                </div>
              </div>
            </div>
            <div className="text-right mt-4 lg:mt-0">
              <Badge variant="secondary" className="bg-white text-red-600 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Abierto
              </Badge>
              <p className="text-sm text-red-100">
                Horario: 11:00 AM - 10:00 PM
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="menu" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="menu">Menú</TabsTrigger>
          <TabsTrigger value="order">Mi Pedido</TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="space-y-6">
          {/* Búsqueda y filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar platos, ingredientes..."
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
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Menú de productos */}
            <div className="lg:col-span-2 space-y-6">
              {/* Productos populares */}
              <div>
                <h3 className="text-lg font-semibold mb-4">🔥 Más Populares</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.filter(item => item.popular).map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{item.name}</h3>
                              {item.vegetarian && <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">Vegetariano</Badge>}
                              {item.spicy && <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">Picante</Badge>}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 fill-current text-yellow-500" />
                                <span>{item.rating}</span>
                                <span>({item.reviews})</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{item.preparationTime} min</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <span className="font-bold text-lg">${item.price}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(item.id)}
                            >
                              <Heart className={`h-4 w-4 ${favorites.includes(item.id) ? 'fill-current text-red-500' : 'text-gray-400'}`} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4 text-gray-400" />
                            </Button>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => addToCart(item)}
                            disabled={!item.available}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {item.available ? "Agregar" : "No disponible"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Todos los productos */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Menú Completo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMenuItems.map((item) => (
                    <Card key={item.id} className={`hover:shadow-md transition-shadow ${!item.available ? 'opacity-50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{item.name}</h3>
                              {item.popular && <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Popular</Badge>}
                              {item.vegetarian && <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">Vegetariano</Badge>}
                              {item.spicy && <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">Picante</Badge>}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 fill-current text-yellow-500" />
                                <span>{item.rating}</span>
                                <span>({item.reviews})</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{item.preparationTime} min</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <span className="font-bold text-lg">${item.price}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(item.id)}
                            >
                              <Heart className={`h-4 w-4 ${favorites.includes(item.id) ? 'fill-current text-red-500' : 'text-gray-400'}`} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4 text-gray-400" />
                            </Button>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => addToCart(item)}
                            disabled={!item.available}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {item.available ? "Agregar" : "No disponible"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Carrito lateral */}
            <Card className="h-fit sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Mi Carrito</span>
                </CardTitle>
                <CardDescription>
                  {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Tu carrito está vacío
                  </p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-600">${item.price} c/u</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
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
                    
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tiempo estimado:</span>
                        <span>{getEstimatedTime()} min</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${(getCartTotal() * 1.16).toFixed(2)}</span>
                      </div>
                      
                      <Button className="w-full">
                        Realizar Pedido
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => setCart([])}>
                        Limpiar Carrito
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="order" className="space-y-6">
          {/* Estado del pedido actual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="h-5 w-5" />
                <span>Mi Pedido Actual</span>
              </CardTitle>
              <CardDescription>
                Pedido #{currentOrder.id} • Realizado a las {currentOrder.orderTime}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Estado del pedido */}
              <div className="flex items-center justify-center space-x-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">Confirmado</span>
                </div>
                
                <div className="flex-1 h-1 bg-green-500 rounded"></div>
                
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <ChefHat className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">Preparando</span>
                </div>
                
                <div className="flex-1 h-1 bg-gray-200 rounded"></div>
                
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500">Listo</span>
                </div>
                
                <div className="flex-1 h-1 bg-gray-200 rounded"></div>
                
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500">Entregado</span>
                </div>
              </div>

              {/* Información del estado actual */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <ChefHat className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-900">Tu pedido se está preparando</h3>
                      <p className="text-sm text-blue-700">
                        Tiempo estimado: {currentOrder.estimatedTime} minutos
                      </p>
                      <p className="text-xs text-blue-600">
                        Te notificaremos cuando esté listo para recoger
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detalle del pedido */}
              <div>
                <h4 className="font-semibold mb-3">Detalle del Pedido</h4>
                <div className="space-y-2">
                  {currentOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.quantity}x {item.name}</p>
                        <p className="text-sm text-gray-600">${item.price} c/u</p>
                      </div>
                      <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-xl">${currentOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-4">
                <Button variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar al Restaurante
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Solicitar Cuenta
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Historial de pedidos */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pedidos</CardTitle>
              <CardDescription>
                Tus pedidos anteriores en Bella Vista
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Pedido #1247</p>
                      <p className="text-sm text-gray-600">15 Nov 2024 • 19:30</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$32.50</p>
                    <Badge variant="secondary">Entregado</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Pedido #1203</p>
                      <p className="text-sm text-gray-600">12 Nov 2024 • 14:15</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$28.90</p>
                    <Badge variant="secondary">Entregado</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}