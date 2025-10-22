import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign,
  ShoppingCart,
  Truck,
  Clock
} from "lucide-react";

export function Dashboard() {
  const stats = [
    {
      title: "Total de Bienes",
      value: "1,284",
      change: "+12%",
      trend: "up",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Valor Total Inventario",
      value: "$87,450,000",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Productos Bajo Stock",
      value: "23",
      change: "-5",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      title: "Facturas Pendientes",
      value: "8",
      change: "+2",
      trend: "up",
      icon: ShoppingCart,
      color: "text-orange-600"
    }
  ];

  const lowStockItems = [
    { name: "Aceite de Oliva Extra Virgen", stock: 5, min: 20, category: "Insumos" },
    { name: "Harina de Trigo Premium", stock: 8, min: 25, category: "Materia Prima" },
    { name: "Tazas de Porcelana", stock: 12, min: 30, category: "Utensilios" },
    { name: "Cafetera Industrial", stock: 1, min: 3, category: "Equipos" },
    { name: "Azúcar Refinada", stock: 15, min: 40, category: "Insumos" }
  ];

  const recentMovements = [
    { type: "Entrada", item: "Harina de Panadería", quantity: 50, date: "2025-01-15", user: "Ana García" },
    { type: "Salida", item: "Aceite Vegetal", quantity: 10, date: "2025-01-15", user: "Carlos López" },
    { type: "Entrada", item: "Vajilla Nueva", quantity: 24, date: "2025-01-14", user: "María Rodríguez" },
    { type: "Salida", item: "Ingredientes Panadería", quantity: 15, date: "2025-01-14", user: "Juan Pérez" },
    { type: "Préstamo", item: "Licuadora Industrial", quantity: 1, date: "2025-01-13", user: "Sofia Martín" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard - Módulo de Inventario</h1>
        <p className="text-muted-foreground">
          Vista general del estado del inventario del restaurante
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                    {stat.change}
                  </span>
                  <span>desde el mes pasado</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas de Stock Mínimo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Alertas de Stock Mínimo</span>
            </CardTitle>
            <CardDescription>
              Productos que requieren reposición urgente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Stock: {item.stock} / Mín: {item.min}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={(item.stock / item.min) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Movimientos Recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span>Movimientos Recientes</span>
            </CardTitle>
            <CardDescription>
              Últimas transacciones de inventario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.map((movement, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      movement.type === "Entrada" ? "bg-green-500" :
                      movement.type === "Salida" ? "bg-red-500" :
                      "bg-blue-500"
                    }`} />
                    <div>
                      <p className="font-medium">{movement.item}</p>
                      <p className="text-sm text-muted-foreground">
                        {movement.type} • {movement.user}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {movement.type === "Salida" ? "-" : "+"}{movement.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground">{movement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Presupuesto y Planificación */}
      <Card>
        <CardHeader>
          <CardTitle>Presupuesto General de Inventario</CardTitle>
          <CardDescription>
            Control de gastos y planificación de compras para el trimestre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Presupuesto Utilizado</span>
                <span className="font-medium">$52,300,000</span>
              </div>
              <Progress value={65} className="h-3" />
              <p className="text-sm text-muted-foreground">65% del presupuesto trimestral</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Compras Programadas</span>
                <span className="font-medium">$15,200,000</span>
              </div>
              <Progress value={19} className="h-3" />
              <p className="text-sm text-muted-foreground">19% pendiente de compra</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Reserva de Emergencia</span>
                <span className="font-medium">$12,500,000</span>
              </div>
              <Progress value={16} className="h-3" />
              <p className="text-sm text-muted-foreground">16% para imprevistos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}