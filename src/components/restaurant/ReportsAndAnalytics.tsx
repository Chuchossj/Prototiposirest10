import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  DollarSign, 
  TrendingUp, 
  Users,
  Clock,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle,
  Utensils,
  Star,
  Package,
  TrendingDown,
  RefreshCw
} from "lucide-react";
import { useRealtimeData } from "../../utils/useRealtimeData";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock?: number;
  minStock?: number;
  available?: boolean;
}

interface Order {
  id: string;
  items: Array<{ productId: string; name: string; quantity: number; price: number }>;
  total: number;
  status: string;
  tableNumber?: number;
  createdAt: string;
  createdBy: string;
}

interface Payment {
  id: string;
  total: number;
  paymentMethod: string;
  orderId?: string;
  createdAt: string;
  createdBy: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export function ReportsAndAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const accessToken = localStorage.getItem("accessToken");

  // Obtener datos en tiempo real
  const { data: productsData, loading: loadingProducts, refetch: refetchProducts } = useRealtimeData<{ success: boolean; products: Product[] }>({
    endpoint: "/products",
    accessToken: accessToken || undefined,
    refreshInterval: 3000
  });

  const { data: ordersData, loading: loadingOrders, refetch: refetchOrders } = useRealtimeData<{ success: boolean; orders: Order[] }>({
    endpoint: "/orders",
    accessToken: accessToken || undefined,
    refreshInterval: 3000
  });

  const { data: paymentsData, loading: loadingPayments, refetch: refetchPayments } = useRealtimeData<{ success: boolean; payments: Payment[] }>({
    endpoint: "/payments",
    accessToken: accessToken || undefined,
    refreshInterval: 3000
  });

  const { data: usersData, loading: loadingUsers, refetch: refetchUsers } = useRealtimeData<{ success: boolean; users: User[] }>({
    endpoint: "/users",
    accessToken: accessToken || undefined,
    refreshInterval: 5000
  });

  // Colores corporativos de Globatech
  const colors = {
    primary: "#0B2240",
    secondary: "#5B2C90",
    accent: "#F28C1B",
    highlight: "#FFD23F",
    white: "#FFFFFF"
  };

  // Procesar datos según el período seleccionado
  const processedData = useMemo(() => {
    const products = productsData?.products || [];
    const orders = ordersData?.orders || [];
    const payments = paymentsData?.payments || [];
    const users = usersData?.users || [];

    // Filtrar por período
    const now = new Date();
    let startDate = new Date();
    
    switch (selectedPeriod) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "quarter":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredPayments = payments.filter(p => new Date(p.createdAt) >= startDate);
    const filteredOrders = orders.filter(o => new Date(o.createdAt) >= startDate);

    // KPIs principales
    const totalSales = filteredPayments.reduce((sum, p) => sum + (p.total || 0), 0);
    const totalOrders = filteredOrders.length;
    const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Ventas por día
    const salesByDay = new Map<string, { ventas: number; pedidos: number }>();
    filteredPayments.forEach(payment => {
      const date = new Date(payment.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      const current = salesByDay.get(date) || { ventas: 0, pedidos: 0 };
      salesByDay.set(date, {
        ventas: current.ventas + payment.total,
        pedidos: current.pedidos + 1
      });
    });

    const dailySalesData = Array.from(salesByDay.entries())
      .map(([date, data]) => ({
        date,
        ventas: data.ventas,
        pedidos: data.pedidos,
        promedio: data.pedidos > 0 ? data.ventas / data.pedidos : 0
      }))
      .slice(-7); // Últimos 7 días

    // Ventas por hora (solo hoy)
    const hourlySales = new Map<number, { ventas: number; pedidos: number }>();
    const todayPayments = payments.filter(p => {
      const paymentDate = new Date(p.createdAt);
      return paymentDate.toDateString() === now.toDateString();
    });

    todayPayments.forEach(payment => {
      const hour = new Date(payment.createdAt).getHours();
      const current = hourlySales.get(hour) || { ventas: 0, pedidos: 0 };
      hourlySales.set(hour, {
        ventas: current.ventas + payment.total,
        pedidos: current.pedidos + 1
      });
    });

    const hourlySalesData = Array.from(hourlySales.entries())
      .map(([hour, data]) => ({
        hora: `${hour}:00`,
        ventas: data.ventas,
        pedidos: data.pedidos
      }))
      .sort((a, b) => parseInt(a.hora) - parseInt(b.hora));

    // Productos más vendidos
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        const current = productSales.get(item.productId || item.name) || { 
          name: item.name, 
          quantity: 0, 
          revenue: 0 
        };
        productSales.set(item.productId || item.name, {
          name: item.name,
          quantity: current.quantity + item.quantity,
          revenue: current.revenue + (item.price * item.quantity)
        });
      });
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((p, idx) => ({
        name: p.name,
        cantidad: p.quantity,
        ingresos: p.revenue,
        color: [colors.accent, colors.secondary, colors.highlight, colors.primary, "#17A2B8"][idx]
      }));

    // Métodos de pago
    const paymentMethods = new Map<string, number>();
    filteredPayments.forEach(payment => {
      const method = payment.paymentMethod || "efectivo";
      paymentMethods.set(method, (paymentMethods.get(method) || 0) + 1);
    });

    const totalPayments = filteredPayments.length;
    const paymentMethodsData = Array.from(paymentMethods.entries()).map(([name, count], idx) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: totalPayments > 0 ? Math.round((count / totalPayments) * 100) : 0,
      color: [colors.accent, colors.secondary, colors.highlight, "#17A2B8"][idx]
    }));

    // Estado del inventario
    const criticalStock = products.filter(p => (p.stock || 0) <= (p.minStock || 5) && (p.stock || 0) > 0).length;
    const outOfStock = products.filter(p => (p.stock || 0) === 0).length;
    const normalStock = products.filter(p => (p.stock || 0) > (p.minStock || 5)).length;

    // Personal activo
    const staff = users.filter(u => u.role !== "cliente" && u.role !== "administrador");
    const activeStaff = staff.filter(u => u.active);

    // Cálculo de rendimiento del personal
    const staffPerformance = staff.map(s => {
      // Pedidos creados por este empleado
      const userOrders = filteredOrders.filter(o => o.createdBy === s.id);
      const userPayments = filteredPayments.filter(p => {
        const order = orders.find(o => o.id === p.orderId);
        return order?.createdBy === s.id;
      });

      const totalRevenue = userPayments.reduce((sum, p) => sum + p.total, 0);

      return {
        id: s.id,
        name: s.name,
        role: s.role,
        ventas: totalRevenue,
        pedidos: userOrders.length,
        active: s.active,
        rating: 4.5 + Math.random() * 0.5 // Simulado por ahora
      };
    });

    // Crecimiento
    const halfPoint = Math.floor(filteredPayments.length / 2);
    const firstHalf = filteredPayments.slice(0, halfPoint).reduce((sum, p) => sum + p.total, 0);
    const secondHalf = filteredPayments.slice(halfPoint).reduce((sum, p) => sum + p.total, 0);
    const growthRate = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;

    return {
      totalSales,
      totalOrders,
      averageTicket,
      dailySalesData,
      hourlySalesData,
      topProducts,
      paymentMethodsData,
      criticalStock,
      outOfStock,
      normalStock,
      products,
      staffPerformance,
      activeStaff,
      growthRate
    };
  }, [productsData, ordersData, paymentsData, usersData, selectedPeriod]);

  const handleRefresh = () => {
    refetchProducts();
    refetchOrders();
    refetchPayments();
    refetchUsers();
  };

  const loading = loadingProducts || loadingOrders || loadingPayments || loadingUsers;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl" style={{ color: colors.primary }}>Reportes y Análisis</h1>
          <p className="text-gray-600 mt-1">
            Dashboard de métricas en tiempo real del restaurante
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="7days">Últimos 7 días</SelectItem>
              <SelectItem value="30days">Últimos 30 días</SelectItem>
              <SelectItem value="quarter">Este trimestre</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4" style={{ color: colors.secondary }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl" style={{ color: colors.primary }}>
              ${processedData.totalSales.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              {processedData.growthRate >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3" style={{ color: colors.secondary }} />
                  <span style={{ color: colors.secondary }}>+{processedData.growthRate.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-red-600">{processedData.growthRate.toFixed(1)}%</span>
                </>
              )}
              <span>vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pedidos Totales</CardTitle>
            <Utensils className="h-4 w-4" style={{ color: colors.accent }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl" style={{ color: colors.primary }}>{processedData.totalOrders}</div>
            <div className="text-xs text-gray-600">
              {processedData.dailySalesData.length > 0 
                ? `Promedio: ${(processedData.totalOrders / processedData.dailySalesData.length).toFixed(1)} por día`
                : 'Sin datos suficientes'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Ticket Promedio</CardTitle>
            <DollarSign className="h-4 w-4" style={{ color: colors.secondary }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl" style={{ color: colors.primary }}>
              ${processedData.averageTicket.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-gray-600">
              Por pedido
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Productos Activos</CardTitle>
            <Package className="h-4 w-4" style={{ color: colors.accent }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl" style={{ color: colors.primary }}>
              {processedData.products.length}
            </div>
            <div className="text-xs text-gray-600">
              En el menú
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="staff">Personal</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ventas por día */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tendencia de Ventas</CardTitle>
                <CardDescription>
                  {selectedPeriod === "today" ? "Ventas de hoy" : `Últimos ${processedData.dailySalesData.length} días`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {processedData.dailySalesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={processedData.dailySalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any, name: string) => [
                          name === 'ventas' ? `$${value.toLocaleString()}` : value,
                          name === 'ventas' ? 'Ventas' : 'Pedidos'
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="ventas" 
                        stroke={colors.accent}
                        fill={colors.accent}
                        fillOpacity={0.2} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="pedidos" 
                        stroke={colors.secondary}
                        fill={colors.secondary}
                        fillOpacity={0.2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No hay datos de ventas para este período
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ventas por hora */}
            <Card>
              <CardHeader>
                <CardTitle>Ventas por Hora</CardTitle>
                <CardDescription>
                  Distribución de ventas durante el día
                </CardDescription>
              </CardHeader>
              <CardContent>
                {processedData.hourlySalesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={processedData.hourlySalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hora" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Ventas']} />
                      <Bar dataKey="ventas" fill={colors.accent} radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-gray-500">
                    No hay ventas registradas hoy
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Métodos de pago */}
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
                <CardDescription>
                  Distribución de métodos de pago
                </CardDescription>
              </CardHeader>
              <CardContent>
                {processedData.paymentMethodsData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={processedData.paymentMethodsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {processedData.paymentMethodsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => [`${value}%`, 'Porcentaje']} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {processedData.paymentMethodsData.map((method, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: method.color }}
                          ></div>
                          <span>{method.name}: {method.value}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-gray-500">
                    No hay datos de pagos
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Productos más vendidos */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>
                  Top productos por ingresos en el período seleccionado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {processedData.topProducts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Ingresos</TableHead>
                        <TableHead>Promedio</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {processedData.topProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: product.color }}
                              ></div>
                              <span>{product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{product.cantidad}</TableCell>
                          <TableCell>${product.ingresos.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</TableCell>
                          <TableCell>${(product.ingresos / product.cantidad).toLocaleString('es-CO', { minimumFractionDigits: 0 })}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No hay datos de ventas de productos
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gráfico de distribución */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Ventas</CardTitle>
                <CardDescription>
                  Por producto
                </CardDescription>
              </CardHeader>
              <CardContent>
                {processedData.topProducts.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={processedData.topProducts}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="cantidad"
                        label={(entry) => entry.name}
                      >
                        {processedData.topProducts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-gray-500">
                    No hay datos disponibles
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Catálogo de productos */}
            <Card>
              <CardHeader>
                <CardTitle>Catálogo de Productos</CardTitle>
                <CardDescription>
                  Total de productos registrados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.secondary}15` }}>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4" style={{ color: colors.secondary }} />
                    <span className="text-sm">Total productos</span>
                  </div>
                  <Badge style={{ backgroundColor: colors.secondary, color: colors.white }}>
                    {processedData.products.length} items
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.accent}15` }}>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" style={{ color: colors.accent }} />
                    <span className="text-sm">Disponibles</span>
                  </div>
                  <Badge style={{ backgroundColor: colors.accent, color: colors.white }}>
                    {processedData.products.filter(p => p.available !== false).length} items
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estado del inventario */}
            <Card>
              <CardHeader>
                <CardTitle>Estado del Inventario</CardTitle>
                <CardDescription>
                  Alertas y niveles de stock en tiempo real
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Sin stock</span>
                  </div>
                  <Badge variant="destructive">{processedData.outOfStock} productos</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Stock crítico</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    {processedData.criticalStock} productos
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Stock normal</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    {processedData.normalStock} productos
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Lista de productos con stock bajo */}
            <Card>
              <CardHeader>
                <CardTitle>Productos con Stock Crítico</CardTitle>
                <CardDescription>
                  Requieren reabastecimiento urgente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {processedData.products
                    .filter(p => (p.stock || 0) <= (p.minStock || 5))
                    .map((product, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">Stock: {product.stock || 0} unidades</p>
                        </div>
                        {(product.stock || 0) === 0 ? (
                          <Badge variant="destructive">Agotado</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">Bajo</Badge>
                        )}
                      </div>
                    ))}
                  {processedData.products.filter(p => (p.stock || 0) <= (p.minStock || 5)).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-2" style={{ color: colors.secondary }} />
                      <p>Todo el inventario en niveles normales</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resumen de inventario */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Resumen de Inventario por Categoría</CardTitle>
                <CardDescription>
                  Productos registrados en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedData.products.slice(0, 10).map((product, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category || 'Sin categoría'}</TableCell>
                        <TableCell>${product.price?.toLocaleString('es-CO') || '0'}</TableCell>
                        <TableCell>{product.stock || 0}</TableCell>
                        <TableCell>
                          {(product.stock || 0) === 0 ? (
                            <Badge variant="destructive">Agotado</Badge>
                          ) : (product.stock || 0) <= (product.minStock || 5) ? (
                            <Badge className="bg-yellow-100 text-yellow-800">Bajo</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">Normal</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {processedData.products.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay productos registrados en el sistema
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          {/* Rendimiento del personal */}
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento del Personal</CardTitle>
              <CardDescription>
                Métricas en tiempo real por empleado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {processedData.staffPerformance.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empleado</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Ventas Generadas</TableHead>
                      <TableHead>Pedidos Atendidos</TableHead>
                      <TableHead>Calificación</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedData.staffPerformance.map((staff, index) => (
                      <TableRow key={index}>
                        <TableCell>{staff.name}</TableCell>
                        <TableCell className="capitalize">{staff.role}</TableCell>
                        <TableCell>
                          ${staff.ventas.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                        </TableCell>
                        <TableCell>{staff.pedidos}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-current" style={{ color: colors.highlight }} />
                            <span>{staff.rating.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {staff.active ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Activo
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inactivo</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay personal registrado en el sistema
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumen del equipo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2" style={{ color: colors.secondary }} />
                <div className="text-2xl" style={{ color: colors.primary }}>
                  {processedData.activeStaff.length}
                </div>
                <p className="text-sm text-gray-600">Personal Activo</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Utensils className="h-8 w-8 mx-auto mb-2" style={{ color: colors.accent }} />
                <div className="text-2xl" style={{ color: colors.primary }}>
                  {processedData.totalOrders}
                </div>
                <p className="text-sm text-gray-600">Pedidos Gestionados</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2" style={{ color: colors.secondary }} />
                <div className="text-2xl" style={{ color: colors.primary }}>
                  ${processedData.totalSales.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                </div>
                <p className="text-sm text-gray-600">Ingresos Generados</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
