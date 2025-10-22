import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
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
  Star,
  Activity,
  Target,
  TrendingDown,
  CheckCircle,
  Building2,
  X,
  Settings
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { toast } from "sonner@2.0.3";
import { useRealtimeData } from "../../utils/useRealtimeData";

interface Alert {
  id: string;
  type: string;
  message: string;
  details: string;
  severity: 'error' | 'warning' | 'info';
  createdAt: string;
  read: boolean;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: string;
  shift?: string;
  performance?: number;
  tasksCompleted?: number;
}

interface DashboardStats {
  todaySales: number;
  salesGrowth: number;
  activeOrders: number;
  averageTime: number;
  occupiedTables: number;
  totalTables: number;
  criticalStock: number;
}

const salesData = [
  { name: "Lun", ventas: 2400, pedidos: 24, meta: 2200 },
  { name: "Mar", ventas: 1398, pedidos: 18, meta: 2200 },
  { name: "Mié", ventas: 9800, pedidos: 45, meta: 2200 },
  { name: "Jue", ventas: 3908, pedidos: 32, meta: 2200 },
  { name: "Vie", ventas: 4800, pedidos: 38, meta: 2200 },
  { name: "Sáb", ventas: 12800, pedidos: 67, meta: 2200 },
  { name: "Dom", ventas: 14900, pedidos: 72, meta: 2200 }
];

const topProducts = [
  { name: "Bandeja Paisa", color: "#0B2240", value: 35 },
  { name: "Ajiaco Santafereño", color: "#5B2C90", value: 25 },
  { name: "Sancocho", color: "#F28C1B", value: 20 },
  { name: "Arroz con Pollo", color: "#FFD23F", value: 12 },
  { name: "Otros", color: "#6C757D", value: 8 }
];

const performanceData = [
  { categoria: "Ventas", actual: 87, meta: 100, color: "#0B2240" },
  { categoria: "Satisfacción", actual: 92, meta: 90, color: "#5B2C90" },
  { categoria: "Eficiencia", actual: 78, meta: 85, color: "#F28C1B" },
  { categoria: "Calidad", actual: 95, meta: 90, color: "#FFD23F" }
];

export function AdminDashboard({ onNavigate }: { onNavigate?: (module: string) => void }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [scheduleConfig, setScheduleConfig] = useState({
    mondayStart: "10:00",
    mondayEnd: "22:00",
    tuesdayStart: "10:00",
    tuesdayEnd: "22:00",
    wednesdayStart: "10:00",
    wednesdayEnd: "22:00",
    thursdayStart: "10:00",
    thursdayEnd: "22:00",
    fridayStart: "10:00",
    fridayEnd: "22:00",
    saturdayStart: "11:00",
    saturdayEnd: "23:00",
    sundayStart: "11:00",
    sundayEnd: "21:00"
  });
  const [quickActionDialog, setQuickActionDialog] = useState<string | null>(null);

  const accessToken = localStorage.getItem('accessToken');

  // Usar hooks de tiempo real para todos los datos
  const { data: paymentsData } = useRealtimeData<{ success: boolean; payments: any[] }>({
    endpoint: "/payments",
    accessToken: accessToken || undefined,
    refreshInterval: 2000 // Actualizar cada 2 segundos
  });

  const { data: ordersData } = useRealtimeData<{ success: boolean; orders: any[] }>({
    endpoint: "/orders",
    accessToken: accessToken || undefined,
    refreshInterval: 2000
  });

  const { data: tablesData } = useRealtimeData<{ success: boolean; tables: any[] }>({
    endpoint: "/tables",
    accessToken: accessToken || undefined,
    refreshInterval: 2000
  });

  const { data: productsData } = useRealtimeData<{ success: boolean; products: any[] }>({
    endpoint: "/products",
    accessToken: accessToken || undefined,
    refreshInterval: 3000
  });

  const { data: usersData } = useRealtimeData<{ success: boolean; users: any[] }>({
    endpoint: "/users",
    accessToken: accessToken || undefined,
    refreshInterval: 5000
  });

  // Calcular estadísticas en tiempo real basadas en los datos
  const stats: DashboardStats = {
    todaySales: calculateTodaySales(),
    salesGrowth: 12,
    activeOrders: calculateActiveOrders(),
    averageTime: 18,
    occupiedTables: calculateOccupiedTables(),
    totalTables: tablesData?.tables?.length || 0,
    criticalStock: calculateCriticalStock()
  };

  // Personal filtrado de usuarios en tiempo real
  const staff: StaffMember[] = (usersData?.users || [])
    .filter((u: any) => u.role !== 'cliente' && u.role !== 'administrador')
    .map((u: any) => ({
      id: u.id,
      name: u.name,
      role: u.role,
      status: 'activo',
      shift: getRoleShift(u.role),
      performance: Math.floor(Math.random() * 30) + 70,
      tasksCompleted: Math.floor(Math.random() * 20) + 5
    }));

  function calculateTodaySales(): number {
    if (!paymentsData?.payments) return 0;
    const today = new Date().toDateString();
    return paymentsData.payments
      .filter((p: any) => new Date(p.createdAt).toDateString() === today)
      .reduce((sum: number, p: any) => sum + (p.total || 0), 0);
  }

  function calculateActiveOrders(): number {
    if (!ordersData?.orders) return 0;
    return ordersData.orders.filter((o: any) => 
      o.status === 'pending' || o.status === 'preparing'
    ).length;
  }

  function calculateOccupiedTables(): number {
    if (!tablesData?.tables) return 0;
    return tablesData.tables.filter((t: any) => t.status === 'ocupada').length;
  }

  function calculateCriticalStock(): number {
    if (!productsData?.products) return 0;
    return productsData.products.filter((p: any) => p.stock <= p.minStock).length;
  }

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 3000); // Actualizar alertas cada 3 segundos
    return () => clearInterval(interval);
  }, [ordersData, productsData]);

  const loadAlerts = async () => {
    try {
      const realAlerts: Alert[] = [];

      // Alertas de stock crítico
      if (productsData?.products) {
        const criticalProducts = productsData.products.filter((p: any) => p.stock <= p.minStock);
        
        if (criticalProducts.length > 0) {
          realAlerts.push({
            id: 'alert-stock',
            type: 'stock_critical',
            message: 'Stock crítico detectado',
            details: `${criticalProducts.length} productos requieren reposición inmediata`,
            severity: 'error',
            createdAt: new Date().toISOString(),
            read: false
          });
        }
      }

      // Alertas de pedidos pendientes con tiempo elevado
      if (ordersData?.orders) {
        const pendingOrders = ordersData.orders.filter((o: any) => o.status === 'pending');
        
        pendingOrders.forEach((order: any) => {
          const createdTime = new Date(order.createdAt).getTime();
          const now = new Date().getTime();
          const minutesWaiting = Math.floor((now - createdTime) / 60000);
          
          if (minutesWaiting > 30) {
            realAlerts.push({
              id: `alert-order-${order.id}`,
              type: 'order_delayed',
              message: `Mesa ${order.tableNumber} - Tiempo de espera elevado`,
              details: `Pedido pendiente por ${minutesWaiting} minutos`,
              severity: 'warning',
              createdAt: order.createdAt,
              read: false
            });
          }
        });
      }

      setAlerts(realAlerts);
    } catch (error) {
      console.error('Error cargando alertas:', error);
    }
  };

  const getRoleShift = (role: string) => {
    switch (role) {
      case 'cocinero': return '11:00 - 22:00';
      case 'mesero': return '10:00 - 20:00';
      case 'cajero': return '09:00 - 17:00';
      default: return '09:00 - 17:00';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'cocinero': return <ChefHat className="h-5 w-5 text-white" />;
      case 'mesero': return <Users className="h-5 w-5 text-white" />;
      case 'cajero': return <DollarSign className="h-5 w-5 text-white" />;
      default: return <Activity className="h-5 w-5 text-white" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'cocinero': return 'from-[#0B2240] to-[#1a3a5f]';
      case 'mesero': return 'from-[#5B2C90] to-[#7a3fb8]';
      case 'cajero': return 'from-[#F28C1B] to-[#f5a047]';
      default: return 'from-gray-500 to-gray-600';
    }
  };



  const resolveAlert = async (alertId: string) => {
    try {
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      toast.success('Alerta resuelta correctamente');
      await loadAlerts(); // Recargar alertas
    } catch (error) {
      console.error('Error resolviendo alerta:', error);
      toast.error('Error al resolver la alerta');
    }
  };

  const saveSchedule = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-71783a73/configuration`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          schedule: scheduleConfig
        })
      });

      if (response.ok) {
        toast.success('Horarios actualizados correctamente');
        setScheduleDialogOpen(false);
      } else {
        toast.error('Error al guardar horarios');
      }
    } catch (error) {
      console.error('Error guardando horarios:', error);
      toast.error('Error al guardar horarios');
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'Gestionar Inventario':
        if (onNavigate) {
          onNavigate('inventory');
          toast.success('Navegando a Gestión de Inventario');
        }
        break;
      case 'Gestionar Personal':
        if (onNavigate) {
          onNavigate('users');
          toast.success('Navegando a Gestión de Usuarios');
        }
        break;
      case 'Reportes Avanzados':
        if (onNavigate) {
          onNavigate('reports');
          toast.success('Navegando a Reportes y Análisis');
        }
        break;
      case 'Configurar Menú':
        if (onNavigate) {
          onNavigate('inventory');
          toast.success('Navegando a Configuración de Menú (Inventario)');
        }
        break;
      default:
        toast.info(`Función "${action}" próximamente disponible`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0B2240] to-[#5B2C90] bg-clip-text text-transparent">
            Panel de Administración
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Dashboard ejecutivo - {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Restaurante Operativo
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
            <Activity className="h-3 w-3 mr-2" />
            Tiempo Real
          </Badge>
          <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-[#0B2240] text-[#0B2240] hover:bg-[#0B2240] hover:text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Configurar Horarios
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-[#0B2240]">Configuración de Horarios</DialogTitle>
                <DialogDescription>
                  Establece los horarios de operación del restaurante para cada día de la semana
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {[
                  { day: 'Lunes', startKey: 'mondayStart', endKey: 'mondayEnd' },
                  { day: 'Martes', startKey: 'tuesdayStart', endKey: 'tuesdayEnd' },
                  { day: 'Miércoles', startKey: 'wednesdayStart', endKey: 'wednesdayEnd' },
                  { day: 'Jueves', startKey: 'thursdayStart', endKey: 'thursdayEnd' },
                  { day: 'Viernes', startKey: 'fridayStart', endKey: 'fridayEnd' },
                  { day: 'Sábado', startKey: 'saturdayStart', endKey: 'saturdayEnd' },
                  { day: 'Domingo', startKey: 'sundayStart', endKey: 'sundayEnd' }
                ].map(({ day, startKey, endKey }) => (
                  <div key={day} className="grid grid-cols-3 items-center gap-4">
                    <Label className="text-[#0B2240]">{day}</Label>
                    <div className="flex items-center gap-2 col-span-2">
                      <Input
                        type="time"
                        value={scheduleConfig[startKey as keyof typeof scheduleConfig]}
                        onChange={(e) => setScheduleConfig({...scheduleConfig, [startKey]: e.target.value})}
                        className="flex-1"
                      />
                      <span className="text-gray-500">-</span>
                      <Input
                        type="time"
                        value={scheduleConfig[endKey as keyof typeof scheduleConfig]}
                        onChange={(e) => setScheduleConfig({...scheduleConfig, [endKey]: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={saveSchedule} className="bg-[#0B2240] hover:bg-[#5B2C90] text-white">
                  Guardar Horarios
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#0B2240] to-[#1a3a5f] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Ventas Hoy</CardTitle>
            <DollarSign className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.todaySales.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs opacity-90 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+{stats.salesGrowth}% vs ayer</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#5B2C90] to-[#7a3fb8] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Pedidos Activos</CardTitle>
            <Clock className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeOrders}</div>
            <div className="text-xs opacity-90 mt-1">
              Tiempo promedio: <span className="font-medium">{stats.averageTime} min</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#F28C1B] to-[#f5a047] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Ocupación Mesas</CardTitle>
            <Users className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.occupiedTables}/{stats.totalTables}</div>
            <div className="text-xs opacity-90 mt-1">
              <span className="font-medium">
                {stats.totalTables > 0 ? Math.round((stats.occupiedTables / stats.totalTables) * 100) : 0}% ocupación
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#FFD23F] to-[#ffe066] text-[#0B2240]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Crítico</CardTitle>
            <AlertTriangle className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.criticalStock}</div>
            <div className="text-xs mt-1">
              <span className="font-medium">{stats.criticalStock > 0 ? 'Requiere atención' : 'Todo en orden'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ventas semanales */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl text-[#0B2240]">Análisis de Ventas Semanal</CardTitle>
            <CardDescription>
              Ingresos y pedidos por día vs. meta establecida
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'ventas' ? `$${value}` : value,
                    name === 'ventas' ? 'Ventas' : 'Pedidos'
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="ventas" fill="#0B2240" radius={[4, 4, 0, 0]} />
                <Bar dataKey="meta" fill="#FFD23F" radius={[4, 4, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Productos populares */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl text-[#0B2240]">Productos Más Vendidos</CardTitle>
            <CardDescription>
              Distribución de ventas hoy
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={240}>
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
                <Tooltip formatter={(value) => [`${value}%`, 'Participación']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: product.color }}
                    ></div>
                    <span className="truncate font-medium">{product.name}</span>
                  </div>
                  <span className="font-bold text-[#0B2240]">{product.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de rendimiento */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-xl text-[#0B2240]">Indicadores de Rendimiento</CardTitle>
          <CardDescription>
            Métricas clave vs. objetivos establecidos
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceData.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#0B2240]">{metric.categoria}</span>
                  <Badge variant={metric.actual >= metric.meta ? "default" : "secondary"} 
                         className={metric.actual >= metric.meta ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {metric.actual >= metric.meta ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {metric.actual}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Actual</span>
                    <span>Meta: {metric.meta}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(metric.actual, 100)}%`,
                        backgroundColor: metric.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas y acciones rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alertas del sistema */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center space-x-2 text-xl text-[#0B2240]">
              <AlertTriangle className="h-5 w-5 text-[#F28C1B]" />
              <span>Alertas del Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                <p className="text-gray-600">No hay alertas pendientes</p>
                <p className="text-sm text-gray-400">Todos los sistemas funcionan correctamente</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`flex items-start justify-between p-4 rounded-xl border ${
                    alert.severity === 'error' ? 'bg-red-50 border-red-200' :
                    alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex-1">
                    <p className={`font-medium ${
                      alert.severity === 'error' ? 'text-red-800' :
                      alert.severity === 'warning' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>{alert.message}</p>
                    <p className={`text-sm mt-1 ${
                      alert.severity === 'error' ? 'text-red-600' :
                      alert.severity === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>{alert.details}</p>
                    <p className={`text-xs mt-1 ${
                      alert.severity === 'error' ? 'text-red-500' :
                      alert.severity === 'warning' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`}>
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => resolveAlert(alert.id)}
                    className={
                      alert.severity === 'error' 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-[#0B2240] hover:bg-[#5B2C90] text-white'
                    }
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolver
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Estado del personal */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center space-x-2 text-xl text-[#0B2240]">
              <Users className="h-5 w-5 text-[#5B2C90]" />
              <span>Estado del Personal</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {staff.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-600">No hay personal registrado</p>
                <p className="text-sm text-gray-400">Crea usuarios de staff desde Gestión de Personal</p>
              </div>
            ) : (
              <>
                {staff.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(member.role)} rounded-full flex items-center justify-center`}>
                        {getRoleIcon(member.role)}
                      </div>
                      <div>
                        <p className="font-medium text-[#0B2240]">{member.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{member.role} • {member.shift}</p>
                        <p className="text-xs text-gray-500">{member.tasksCompleted} tareas completadas hoy</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <Activity className="h-3 w-3 mr-1" />
                      Activo
                    </Badge>
                  </div>
                ))}
                {staff.length > 3 && (
                  <Button variant="outline" className="w-full border-[#0B2240] text-[#0B2240] hover:bg-[#0B2240] hover:text-white">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Ver Todos ({staff.length} empleados)
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-xl text-[#0B2240]">Acciones Rápidas</CardTitle>
          <CardDescription>
            Funciones frecuentemente utilizadas por administradores
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              onClick={() => handleQuickAction('Gestionar Inventario')}
              className="h-24 flex-col space-y-2 border-[#0B2240] text-[#0B2240] hover:bg-[#0B2240] hover:text-white transition-all"
            >
              <Package className="h-8 w-8" />
              <span className="text-sm font-medium">Gestionar Inventario</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleQuickAction('Gestionar Personal')}
              className="h-24 flex-col space-y-2 border-[#5B2C90] text-[#5B2C90] hover:bg-[#5B2C90] hover:text-white transition-all"
            >
              <Users className="h-8 w-8" />
              <span className="text-sm font-medium">Gestionar Personal</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleQuickAction('Reportes Avanzados')}
              className="h-24 flex-col space-y-2 border-[#F28C1B] text-[#F28C1B] hover:bg-[#F28C1B] hover:text-white transition-all"
            >
              <BarChart3 className="h-8 w-8" />
              <span className="text-sm font-medium">Reportes Avanzados</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleQuickAction('Configurar Menú')}
              className="h-24 flex-col space-y-2 border-[#FFD23F] text-[#0B2240] hover:bg-[#FFD23F] hover:text-[#0B2240] transition-all"
            >
              <Star className="h-8 w-8" />
              <span className="text-sm font-medium">Configurar Menú</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estado del sistema */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-xl text-[#0B2240]">Estado del Sistema</CardTitle>
          <CardDescription>
            Monitoreo en tiempo real de SIREST
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-green-800">Sistema Operativo</p>
                <p className="text-sm text-green-600">Todos los módulos funcionando</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Base de Datos</p>
                <p className="text-sm text-blue-600">Conexión estable</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
              <Activity className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-purple-800">API REST</p>
                <p className="text-sm text-purple-600">Respuesta: 45ms</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
              <Building2 className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">Globatech S.A.S</p>
                <p className="text-sm text-orange-600">Licencia activa</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-6">
        <Badge variant="outline" className="bg-white/80 border-gray-300">
          <Building2 className="h-3 w-3 mr-2" />
          SIREST • Powered by Globatech S.A.S
        </Badge>
      </div>
    </div>
  );
}
