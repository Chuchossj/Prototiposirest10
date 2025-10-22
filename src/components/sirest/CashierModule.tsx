import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner@2.0.3";
import { 
  CreditCard, 
  DollarSign, 
  Receipt, 
  Calculator,
  Clock,
  CheckCircle,
  Printer,
  Smartphone,
  Banknote,
  FileText,
  TrendingUp,
  QrCode
} from "lucide-react";
import { useRealtimeData, apiRequest } from "../../utils/useRealtimeData";

interface CashierModuleProps {
  activeTab?: string;
  accessToken: string;
}

export function CashierModule({ activeTab, accessToken }: CashierModuleProps) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [receivedAmount, setReceivedAmount] = useState<string>("");
  const [tipAmount, setTipAmount] = useState<string>("");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [cashCount, setCashCount] = useState("");
  const [closingNotes, setClosingNotes] = useState("");
  
  // Obtener datos en tiempo real
  const { data: ordersData, refetch: refetchOrders } = useRealtimeData({
    endpoint: "/orders",
    accessToken,
    refreshInterval: 2000
  });

  const { data: paymentsData, refetch: refetchPayments } = useRealtimeData({
    endpoint: "/payments",
    accessToken,
    refreshInterval: 3000
  });

  const orders = ordersData?.orders || [];
  const payments = paymentsData?.payments || [];

  // Filtrar pedidos listos para cobrar
  const pendingOrders = orders.filter((o: any) => o.status === "ready" || o.status === "served");

  // Pagos del día
  const todayPayments = payments.filter((p: any) => {
    const paymentDate = new Date(p.createdAt).toDateString();
    return paymentDate === new Date().toDateString();
  });

  const todaysSales = todayPayments.reduce((sum: number, p: any) => sum + (p.total || 0), 0);
  const todaysTransactions = todayPayments.length;

  const calculateTotals = (order: any) => {
    const subtotal = order.subtotal || 0;
    const tax = subtotal * 0.19; // 19% IVA Colombia
    const tip = parseFloat(tipAmount) || 0;
    const service = subtotal * 0.10; // 10% servicio
    const total = subtotal + tax + tip + service;
    
    return { subtotal, tax, tip, service, total };
  };

  const calculateChange = (order: any) => {
    const { total } = calculateTotals(order);
    const received = parseFloat(receivedAmount) || 0;
    return Math.max(0, received - total);
  };

  const processPayment = async () => {
    if (!selectedOrder || !paymentMethod) {
      toast.error("Complete todos los campos requeridos");
      return;
    }
    
    if (paymentMethod === "efectivo" && !receivedAmount) {
      toast.error("Ingrese el monto recibido");
      return;
    }

    try {
      const totals = calculateTotals(selectedOrder);
      
      const paymentData = {
        orderId: selectedOrder.id,
        tableNumber: selectedOrder.tableNumber,
        paymentMethod,
        subtotal: totals.subtotal,
        tax: totals.tax,
        service: totals.service,
        tip: totals.tip,
        total: totals.total,
        receivedAmount: paymentMethod === "efectivo" ? parseFloat(receivedAmount) : totals.total,
        change: paymentMethod === "efectivo" ? calculateChange(selectedOrder) : 0,
        notes: customerNotes
      };

      const response = await apiRequest("/payments", {
        method: "POST",
        body: paymentData,
        accessToken
      });

      if (response.success) {
        toast.success("Pago procesado exitosamente");
        setShowReceipt(true);
        resetForm();
        refetchOrders();
        refetchPayments();
      }
    } catch (error) {
      console.error("Error procesando pago:", error);
      toast.error("Error al procesar el pago");
    }
  };

  const resetForm = () => {
    setPaymentMethod("");
    setReceivedAmount("");
    setTipAmount("");
    setCustomerNotes("");
  };

  const generateClosingReport = async () => {
    if (!cashCount) {
      toast.error("Ingrese el conteo de efectivo");
      return;
    }

    try {
      const closingData = {
        cashCount: parseFloat(cashCount),
        notes: closingNotes,
        expectedCash: todayPayments.filter((p: any) => p.paymentMethod === "efectivo").reduce((sum: number, p: any) => sum + p.total, 0)
      };

      const response = await apiRequest("/cash-closing", {
        method: "POST",
        body: closingData,
        accessToken
      });

      if (response.success) {
        toast.success("Cierre de caja generado exitosamente");
        setCashCount("");
        setClosingNotes("");
        refetchPayments();
      }
    } catch (error) {
      console.error("Error generando cierre:", error);
      toast.error("Error al generar cierre de caja");
    }
  };

  // Mapear activeTab a las pestañas internas
  const getDefaultTab = () => {
    switch (activeTab) {
      case "pending-payments":
        return "pending";
      case "transactions":
        return "transactions";
      case "cash-management":
        return "cash-management";
      default:
        return "pending";
    }
  };
  
  const [activeInternalTab, setActiveInternalTab] = useState(getDefaultTab());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
            Panel de Caja
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Procesamiento de pagos y facturación
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Caja Operativa
          </Badge>
          <Badge className="bg-orange-100 text-orange-800 border-orange-300">
            Turno: 09:00 - 17:00
          </Badge>
        </div>
      </div>

      {/* Estadísticas del día */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Ventas del Día</CardTitle>
            <DollarSign className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${todaysSales.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs opacity-90 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>Operativo</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Transacciones</CardTitle>
            <Receipt className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todaysTransactions}</div>
            <div className="text-xs opacity-90 mt-1">
              Promedio: <span className="font-medium">${todaysTransactions > 0 ? (todaysSales / todaysTransactions).toLocaleString() : 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Órdenes Pendientes</CardTitle>
            <Clock className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingOrders.length}</div>
            <div className="text-xs opacity-90 mt-1">
              <span>Listas para cobrar</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Efectivo Total</CardTitle>
            <Banknote className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${todayPayments.filter((p: any) => p.paymentMethod === "efectivo").reduce((sum: number, p: any) => sum + p.total, 0).toLocaleString()}</div>
            <div className="text-xs opacity-90 mt-1">
              En caja
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeInternalTab} onValueChange={setActiveInternalTab} className="space-y-8">
        <TabsList className="grid w-full max-w-lg grid-cols-3 bg-white border shadow-sm">
          <TabsTrigger value="pending" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900">
            Órdenes Pendientes
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
            Transacciones
          </TabsTrigger>
          <TabsTrigger value="cash-management" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
            Caja y Arqueo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Órdenes pendientes */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl text-blue-900">Órdenes Listas para Cobrar</CardTitle>
                <CardDescription>
                  Selecciona una orden para procesar el pago
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 max-h-[600px] overflow-y-auto">
                {pendingOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay órdenes pendientes de pago</p>
                  </div>
                ) : (
                  pendingOrders.map((order: any) => (
                    <Card 
                      key={order.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                        selectedOrder?.id === order.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-blue-900">Mesa #{order.tableNumber}</h3>
                            <p className="text-sm text-gray-600">{order.items?.length || 0} productos</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-xl text-orange-600">${order.subtotal?.toLocaleString() || 0}</p>
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Listo
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Total con impuestos: ${(order.subtotal * 1.29).toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Panel de procesamiento de pago */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center space-x-2 text-xl text-blue-900">
                  <Calculator className="h-5 w-5" />
                  <span>Procesar Pago</span>
                </CardTitle>
                <CardDescription>
                  {selectedOrder ? `Mesa ${selectedOrder.tableNumber}` : "Selecciona una orden"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {selectedOrder ? (
                  <>
                    {/* Detalle de la orden */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-900">Detalle del Pedido</h4>
                      <div className="max-h-32 overflow-y-auto space-y-2 bg-gray-50 p-3 rounded-lg">
                        {selectedOrder.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cálculos detallados */}
                    <div className="border-t pt-4 space-y-3 bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${calculateTotals(selectedOrder).subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Servicio (10%):</span>
                        <span>${calculateTotals(selectedOrder).service.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>IVA (19%):</span>
                        <span>${calculateTotals(selectedOrder).tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Propina:</span>
                        <span>${calculateTotals(selectedOrder).tip.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2 text-blue-900">
                        <span>Total a Pagar:</span>
                        <span>${calculateTotals(selectedOrder).total.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Propina */}
                    <div className="space-y-3">
                      <Label htmlFor="tip" className="text-blue-900 font-medium">Propina (opcional)</Label>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setTipAmount((selectedOrder.subtotal * 0.10).toFixed(0))}
                          className="border-orange-300 text-orange-700 hover:bg-orange-50"
                        >
                          10%
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setTipAmount((selectedOrder.subtotal * 0.15).toFixed(0))}
                          className="border-orange-300 text-orange-700 hover:bg-orange-50"
                        >
                          15%
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setTipAmount((selectedOrder.subtotal * 0.20).toFixed(0))}
                          className="border-orange-300 text-orange-700 hover:bg-orange-50"
                        >
                          20%
                        </Button>
                        <Input
                          id="tip"
                          type="number"
                          placeholder="$0"
                          value={tipAmount}
                          onChange={(e) => setTipAmount(e.target.value)}
                          className="flex-1 border-gray-300 focus:border-orange-500"
                        />
                      </div>
                    </div>

                    {/* Método de pago */}
                    <div className="space-y-3">
                      <Label className="text-blue-900 font-medium">Método de Pago</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant={paymentMethod === "efectivo" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("efectivo")}
                          className={`flex items-center space-x-2 ${paymentMethod === "efectivo" ? "bg-green-600 hover:bg-green-700" : "border-gray-300"}`}
                        >
                          <Banknote className="h-4 w-4" />
                          <span>Efectivo</span>
                        </Button>
                        <Button
                          variant={paymentMethod === "tarjeta" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("tarjeta")}
                          className={`flex items-center space-x-2 ${paymentMethod === "tarjeta" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300"}`}
                        >
                          <CreditCard className="h-4 w-4" />
                          <span>Tarjeta</span>
                        </Button>
                        <Button
                          variant={paymentMethod === "transferencia" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("transferencia")}
                          className={`flex items-center space-x-2 ${paymentMethod === "transferencia" ? "bg-purple-600 hover:bg-purple-700" : "border-gray-300"}`}
                        >
                          <Smartphone className="h-4 w-4" />
                          <span>Transferencia</span>
                        </Button>
                        <Button
                          variant={paymentMethod === "qr" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("qr")}
                          className={`flex items-center space-x-2 ${paymentMethod === "qr" ? "bg-orange-600 hover:bg-orange-700" : "border-gray-300"}`}
                        >
                          <QrCode className="h-4 w-4" />
                          <span>QR</span>
                        </Button>
                      </div>
                    </div>

                    {/* Monto recibido (solo para efectivo) */}
                    {paymentMethod === "efectivo" && (
                      <div className="space-y-2">
                        <Label htmlFor="received" className="text-blue-900 font-medium">Monto Recibido</Label>
                        <Input
                          id="received"
                          type="number"
                          placeholder="$0"
                          value={receivedAmount}
                          onChange={(e) => setReceivedAmount(e.target.value)}
                          className="border-gray-300 focus:border-green-500"
                        />
                        {receivedAmount && (
                          <div className="flex justify-between text-lg font-medium p-3 bg-green-50 rounded-lg">
                            <span className="text-green-800">Cambio:</span>
                            <span className="text-green-700 font-bold">
                              ${calculateChange(selectedOrder).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notas */}
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-blue-900 font-medium">Notas (opcional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Observaciones adicionales..."
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        rows={2}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white" 
                        size="lg"
                        onClick={processPayment}
                        disabled={!paymentMethod || (paymentMethod === "efectivo" && !receivedAmount)}
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        Procesar Pago - ${calculateTotals(selectedOrder).total.toLocaleString()}
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                          <Printer className="h-4 w-4 mr-2" />
                          Factura
                        </Button>
                        <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                          <FileText className="h-4 w-4 mr-2" />
                          Recibo
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      Selecciona una orden para procesar el pago
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl text-blue-900">Transacciones del Día</CardTitle>
              <CardDescription>
                Historial de pagos procesados hoy
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {todayPayments.length === 0 ? (
                <div className="text-center py-8">
                  <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hay transacciones registradas hoy</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayPayments.map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold">#{payment.tableNumber}</span>
                        </div>
                        <div>
                          <p className="font-medium text-blue-900">Mesa {payment.tableNumber}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(payment.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} • {payment.paymentMethod}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-green-600">${payment.total?.toLocaleString() || 0}</p>
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completado
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-management" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Arqueo de caja */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl text-blue-900">Arqueo de Caja</CardTitle>
                <CardDescription>
                  Control de efectivo y cuadre de turno
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Movimientos del Día</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-700">Ingresos Efectivo</p>
                      <p className="text-xl font-bold text-green-600">
                        ${todayPayments.filter((p: any) => p.paymentMethod === 'efectivo').reduce((sum: number, p: any) => sum + p.total, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-700">Tarjetas</p>
                      <p className="text-xl font-bold text-blue-600">
                        ${todayPayments.filter((p: any) => p.paymentMethod === 'tarjeta').reduce((sum: number, p: any) => sum + p.total, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-700">Total Esperado en Caja</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ${todayPayments.filter((p: any) => p.paymentMethod === 'efectivo').reduce((sum: number, p: any) => sum + p.total, 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-blue-900 font-medium">Conteo Real de Efectivo</Label>
                  <Input 
                    type="number" 
                    placeholder="Ingrese el conteo manual"
                    value={cashCount}
                    onChange={(e) => setCashCount(e.target.value)}
                    className="border-gray-300 focus:border-blue-500"
                  />
                  
                  {cashCount && (
                    <div className={`p-3 rounded-lg ${
                      parseFloat(cashCount) === todayPayments.filter((p: any) => p.paymentMethod === 'efectivo').reduce((sum: number, p: any) => sum + p.total, 0) 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    } border`}>
                      <p className="text-sm font-medium">
                        Diferencia: ${Math.abs(parseFloat(cashCount) - todayPayments.filter((p: any) => p.paymentMethod === 'efectivo').reduce((sum: number, p: any) => sum + p.total, 0)).toLocaleString()}
                      </p>
                    </div>
                  )}

                  <Label className="text-blue-900 font-medium">Notas del Cierre</Label>
                  <Textarea
                    placeholder="Observaciones del arqueo..."
                    value={closingNotes}
                    onChange={(e) => setClosingNotes(e.target.value)}
                    rows={3}
                    className="border-gray-300 focus:border-blue-500"
                  />

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={generateClosingReport}
                    disabled={!cashCount}
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Generar Reporte de Cierre
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resumen de métodos de pago */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl text-blue-900">Resumen de Métodos de Pago</CardTitle>
                <CardDescription>
                  Distribución de pagos del día
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Banknote className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Efectivo</p>
                        <p className="text-sm text-green-600">
                          {todayPayments.filter((p: any) => p.paymentMethod === 'efectivo').length} transacciones
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        ${todayPayments.filter((p: any) => p.paymentMethod === 'efectivo').reduce((sum: number, p: any) => sum + p.total, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Tarjeta</p>
                        <p className="text-sm text-blue-600">
                          {todayPayments.filter((p: any) => p.paymentMethod === 'tarjeta').length} transacciones
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">
                        ${todayPayments.filter((p: any) => p.paymentMethod === 'tarjeta').reduce((sum: number, p: any) => sum + p.total, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-900">Transferencia</p>
                        <p className="text-sm text-purple-600">
                          {todayPayments.filter((p: any) => p.paymentMethod === 'transferencia').length} transacciones
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-purple-600">
                        ${todayPayments.filter((p: any) => p.paymentMethod === 'transferencia').reduce((sum: number, p: any) => sum + p.total, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-blue-900">Total General:</span>
                    <span className="text-2xl font-bold text-green-600">${todaysSales.toLocaleString()}</span>
                  </div>
                  
                  <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                    <FileText className="h-4 w-4 mr-2" />
                    Imprimir Resumen del Día
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog de recibo */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-blue-900">✅ Pago Procesado</DialogTitle>
            <DialogDescription className="text-center">
              Transacción completada exitosamente
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4 py-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <p className="text-lg font-semibold">Pago realizado correctamente</p>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button className="flex-1 bg-blue-600" onClick={() => setShowReceipt(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
