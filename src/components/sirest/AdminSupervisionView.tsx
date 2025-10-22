import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  Bell,
  Users,
  ChefHat,
  CreditCard,
  Utensils,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  TrendingUp,
  UserCheck,
  Star
} from "lucide-react";
import { useRealtimeData } from "../../utils/useRealtimeData";

interface AdminSupervisionViewProps {
  module: "kitchen" | "pos" | "tables" | "staff" | "alerts";
  accessToken: string;
}

export function AdminSupervisionView({ module, accessToken }: AdminSupervisionViewProps) {
  // Obtener datos en tiempo real
  const { data: ordersData } = useRealtimeData({
    endpoint: "/orders",
    accessToken,
    refreshInterval: 2000
  });

  const { data: paymentsData } = useRealtimeData({
    endpoint: "/payments",
    accessToken,
    refreshInterval: 3000
  });

  const { data: alertsData, refetch: refetchAlerts } = useRealtimeData({
    endpoint: "/alerts",
    accessToken,
    refreshInterval: 2000
  });

  const { data: staffData } = useRealtimeData({
    endpoint: "/staff-status",
    accessToken,
    refreshInterval: 5000
  });

  const { data: usersData } = useRealtimeData({
    endpoint: "/users",
    accessToken,
    refreshInterval: 5000
  });

  const orders = ordersData?.orders || [];
  const payments = paymentsData?.payments || [];
  const alerts = alertsData?.alerts || [];
  const staff = staffData?.staff || [];
  const users = usersData?.users || [];

  // Vista de alertas
  if (module === "alerts" || !module) {
    const criticalAlerts = alerts.filter((a: any) => a.type === "order_ready" || a.type === "new_order");
    
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
              Centro de Alertas
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Monitoreo en tiempo real del sistema
            </p>
          </div>
          <Badge className="bg-orange-100 text-orange-800 border-orange-300 px-4 py-2">
            <Bell className="h-4 w-4 mr-2" />
            {alerts.length} alertas activas
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">{criticalAlerts.length}</div>
              <p className="text-sm opacity-90">Alertas Críticas</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6 text-center">
              <Clock className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">{orders.filter((o: any) => o.status === "pending").length}</div>
              <p className="text-sm opacity-90">Pedidos Pendientes</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <ChefHat className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">{orders.filter((o: any) => o.status === "preparing").length}</div>
              <p className="text-sm opacity-90">En Preparación</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">{orders.filter((o: any) => o.status === "ready").length}</div>
              <p className="text-sm opacity-90">Listos para Servir</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl text-blue-900">Alertas Activas</CardTitle>
            <CardDescription>Notificaciones del sistema en tiempo real</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {alerts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No hay alertas activas</p>
                <p className="text-sm text-gray-400">El sistema está operando normalmente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert: any) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.type === "new_order" ? "bg-blue-50 border-blue-500" :
                      alert.type === "order_ready" ? "bg-green-50 border-green-500" :
                      "bg-yellow-50 border-yellow-500"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          alert.type === "new_order" ? "bg-blue-100" :
                          alert.type === "order_ready" ? "bg-green-100" :
                          "bg-yellow-100"
                        }`}>
                          {alert.type === "new_order" ? <Bell className="h-5 w-5 text-blue-600" /> :
                           alert.type === "order_ready" ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                           <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                        </div>
                        <div>
                          <p className="font-semibold text-blue-900">{alert.message}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(alert.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-white">
                        {alert.type === "new_order" ? "Nuevo" :
                         alert.type === "order_ready" ? "Listo" : "Alerta"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vista de estado del personal
  if (module === "staff") {
    const activeStaff = staff.filter((s: any) => s.status === "activo");
    const allUsers = users.filter((u: any) => u.role !== "cliente");
    
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
              Estado del Personal
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Monitoreo de equipo en tiempo real
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">{allUsers.length}</div>
              <p className="text-sm opacity-90">Total Personal</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <UserCheck className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">{activeStaff.length}</div>
              <p className="text-sm opacity-90">En Turno</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <Activity className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">
                {staff.length > 0 ? Math.round(staff.reduce((sum: number, s: any) => sum + (s.performance || 0), 0) / staff.length) : 0}%
              </div>
              <p className="text-sm opacity-90">Rendimiento Promedio</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6 text-center">
              <Star className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">98%</div>
              <p className="text-sm opacity-90">Satisfacción</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl text-blue-900">Personal Registrado</CardTitle>
            <CardDescription>Listado completo del equipo</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {allUsers.map((user: any) => {
                const staffStatus = staff.find((s: any) => s.id === user.id);
                const roleColors = {
                  mesero: "bg-purple-100 text-purple-800 border-purple-300",
                  cajero: "bg-orange-100 text-orange-800 border-orange-300",
                  cocinero: "bg-yellow-100 text-yellow-800 border-yellow-300",
                  administrador: "bg-blue-100 text-blue-800 border-blue-300"
                };
                
                return (
                  <div key={user.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {user.name?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {staffStatus && (
                          <p className="text-xs text-gray-500">Turno: {staffStatus.shift}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {staffStatus && (
                        <div className="text-right mr-4">
                          <p className="text-sm text-gray-600">Rendimiento</p>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${staffStatus.performance}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{staffStatus.performance}%</span>
                          </div>
                        </div>
                      )}
                      <Badge className={roleColors[user.role as keyof typeof roleColors] || "bg-gray-100 text-gray-800"}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                      {staffStatus?.status === "activo" ? (
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Activo
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                          Inactivo
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vista de cocina
  if (module === "kitchen") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
            Supervisión de Cocina
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Monitoreo de preparación de pedidos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6 text-center">
              <Clock className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">{orders.filter((o: any) => o.status === "pending").length}</div>
              <p className="text-sm opacity-90">Pendientes</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <ChefHat className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">{orders.filter((o: any) => o.status === "preparing").length}</div>
              <p className="text-sm opacity-90">En Preparación</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">{orders.filter((o: any) => o.status === "ready").length}</div>
              <p className="text-sm opacity-90">Listos</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl text-blue-900">Pedidos Activos</CardTitle>
            <CardDescription>Estado actual de la cocina</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {orders.filter((o: any) => o.status !== "paid" && o.status !== "served").map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      order.status === "pending" ? "bg-yellow-500" :
                      order.status === "preparing" ? "bg-blue-500" :
                      "bg-green-500"
                    }`}>
                      <span className="text-white font-bold">#{order.tableNumber}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">Mesa {order.tableNumber}</p>
                      <p className="text-sm text-gray-600">{order.items?.length || 0} productos</p>
                    </div>
                  </div>
                  <Badge className={
                    order.status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                    order.status === "preparing" ? "bg-blue-100 text-blue-800 border-blue-300" :
                    "bg-green-100 text-green-800 border-green-300"
                  }>
                    {order.status === "pending" ? "Pendiente" :
                     order.status === "preparing" ? "Preparando" :
                     "Listo"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vista de punto de venta
  if (module === "pos") {
    const todayPayments = payments.filter((p: any) => {
      const paymentDate = new Date(p.createdAt).toDateString();
      return paymentDate === new Date().toDateString();
    });
    const todaysSales = todayPayments.reduce((sum: number, p: any) => sum + (p.total || 0), 0);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
            Supervisión de Punto de Venta
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Monitoreo de transacciones y pagos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">${todaysSales.toLocaleString()}</div>
              <p className="text-sm opacity-90">Ventas del Día</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">{todayPayments.length}</div>
              <p className="text-sm opacity-90">Transacciones</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6 text-center">
              <Clock className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">{orders.filter((o: any) => o.status === "ready" || o.status === "served").length}</div>
              <p className="text-sm opacity-90">Pendientes de Pago</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl text-blue-900">Transacciones Recientes</CardTitle>
            <CardDescription>Últimos pagos procesados</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {todayPayments.slice(-10).reverse().map((payment: any) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">#{payment.tableNumber}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">Mesa {payment.tableNumber}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} • {payment.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-xl text-green-600">${payment.total?.toLocaleString() || 0}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vista de mesas
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
          Control de Mesas
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Monitoreo de servicio al cliente
        </p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-xl text-blue-900">Vista General</CardTitle>
          <CardDescription>Estado actual del restaurante</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500 py-8">
            Módulo de supervisión de mesas en desarrollo
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
