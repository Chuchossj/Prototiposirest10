import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package, 
  Clock, 
  ChefHat,
  AlertTriangle,
  BarChart3,
  Calendar,
  Star
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const salesData = [
  { name: "Lun", ventas: 2400, pedidos: 24 },
  { name: "Mar", ventas: 1398, pedidos: 18 },
  { name: "Mié", ventas: 9800, pedidos: 45 },
  { name: "Jue", ventas: 3908, pedidos: 32 },
  { name: "Vie", ventas: 4800, pedidos: 38 },
  { name: "Sáb", ventas: 12800, pedidos: 67 },
  { name: "Dom", ventas: 14900, pedidos: 72 }
];

const topProducts = [
  { name: "Hamburguesa Clásica", color: "#DC3545", value: 35 },
  { name: "Pizza Margarita", color: "#28A745", value: 25 },
  { name: "Pasta Carbonara", color: "#FFC107", value: 20 },
  { name: "Ensalada César", color: "#17A2B8", value: 12 },
  { name: "Otros", color: "#6C757D", value: 8 }
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-gray-600 mt-1">
            Dashboard ejecutivo del restaurante - {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Restaurante Abierto
          </Badge>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Configurar Horarios
          </Button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$47,250</div>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+12%</span>
              <span>vs ayer</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Activos</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <div className="text-xs text-gray-600">
              Tiempo promedio: <span className="font-medium">18 min</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mesas Ocupadas</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18/25</div>
            <div className="text-xs text-gray-600">
              Ocupación: <span className="font-medium text-purple-600">72%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Crítico</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="text-xs text-gray-600">
              <span className="text-red-600">Requiere atención</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos y estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ventas de la semana */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ventas de la Semana</CardTitle>
            <CardDescription>
              Ingresos y número de pedidos por día
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'ventas' ? `$${value}` : value,
                    name === 'ventas' ? 'Ventas' : 'Pedidos'
                  ]}
                />
                <Bar dataKey="ventas" fill="#DC3545" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Productos más vendidos */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Populares</CardTitle>
            <CardDescription>
              Top 5 más vendidos hoy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: product.color }}
                    ></div>
                    <span className="truncate">{product.name}</span>
                  </div>
                  <span className="font-medium">{product.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y acciones rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas del sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Alertas del Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div>
                <p className="font-medium text-red-800">Stock crítico</p>
                <p className="text-sm text-red-600">8 productos requieren reposición</p>
              </div>
              <Button size="sm" variant="outline">Ver detalles</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <p className="font-medium text-yellow-800">Mesa 12 - Pedido demorado</p>
                <p className="text-sm text-yellow-600">Tiempo de espera: 35 minutos</p>
              </div>
              <Button size="sm" variant="outline">Revisar</Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="font-medium text-blue-800">Nuevo empleado pendiente</p>
                <p className="text-sm text-blue-600">Configurar accesos para María González</p>
              </div>
              <Button size="sm" variant="outline">Configurar</Button>
            </div>
          </CardContent>
        </Card>

        {/* Estado del personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span>Estado del Personal</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <ChefHat className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Carlos Rodríguez</p>
                  <p className="text-sm text-gray-600">Chef Principal</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Activo</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Ana Martínez</p>
                  <p className="text-sm text-gray-600">Mesera - Turno A</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Activo</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Luis Pérez</p>
                  <p className="text-sm text-gray-600">Cajero</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Descanso</Badge>
            </div>

            <Button variant="outline" className="w-full mt-4">
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Horarios Completos
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Funciones frecuentemente utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Package className="h-6 w-6" />
              <span className="text-sm">Gestionar Inventario</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Gestionar Personal</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Reportes</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Star className="h-6 w-6" />
              <span className="text-sm">Menú del Día</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}