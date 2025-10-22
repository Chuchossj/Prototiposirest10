import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { 
  CreditCard, 
  DollarSign, 
  Receipt, 
  Calculator,
  Percent,
  Users,
  Clock,
  CheckCircle,
  Printer,
  Smartphone,
  Banknote,
  Zap,
  FileText,
  TrendingUp
} from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface PendingOrder {
  id: number;
  tableNumber: string;
  waiter: string;
  items: OrderItem[];
  subtotal: number;
  time: string;
  status: "pending" | "processing" | "ready";
}

interface Transaction {
  id: number;
  tableNumber: string;
  amount: number;
  paymentMethod: string;
  time: string;
  receiptNumber: string;
}

const pendingOrders: PendingOrder[] = [
  {
    id: 1,
    tableNumber: "02",
    waiter: "Ana M.",
    time: "12:30",
    status: "ready",
    subtotal: 85.50,
    items: [
      { id: 1, name: "Hamburguesa Clásica", price: 15.99, quantity: 2, category: "principales" },
      { id: 2, name: "Pizza Margarita", price: 18.50, quantity: 1, category: "principales" },
      { id: 3, name: "Coca Cola", price: 3.50, quantity: 3, category: "bebidas" },
      { id: 4, name: "Café Americano", price: 3.50, quantity: 2, category: "bebidas" }
    ]
  },
  {
    id: 2,
    tableNumber: "06",
    waiter: "Ana M.",
    time: "11:45",
    status: "ready",
    subtotal: 67.20,
    items: [
      { id: 5, name: "Ensalada César", price: 12.99, quantity: 2, category: "ensaladas" },
      { id: 6, name: "Pasta Carbonara", price: 16.80, quantity: 1, category: "principales" },
      { id: 7, name: "Limonada Natural", price: 4.25, quantity: 2, category: "bebidas" },
      { id: 8, name: "Cheesecake", price: 8.99, quantity: 2, category: "postres" }
    ]
  }
];

const recentTransactions: Transaction[] = [
  { id: 1, tableNumber: "05", amount: 42.30, paymentMethod: "Efectivo", time: "12:15", receiptNumber: "001234" },
  { id: 2, tableNumber: "12", amount: 78.90, paymentMethod: "Tarjeta", time: "12:08", receiptNumber: "001233" },
  { id: 3, tableNumber: "08", amount: 156.75, paymentMethod: "Transferencia", time: "11:55", receiptNumber: "001232" },
  { id: 4, tableNumber: "03", amount: 23.50, paymentMethod: "Efectivo", time: "11:42", receiptNumber: "001231" }
];

export function CashierDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<PendingOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [receivedAmount, setReceivedAmount] = useState<string>("");
  const [tipAmount, setTipAmount] = useState<string>("");
  const [customerNotes, setCustomerNotes] = useState<string>("");

  const calculateTotals = (order: PendingOrder) => {
    const subtotal = order.subtotal;
    const tax = subtotal * 0.16; // 16% IVA
    const tip = parseFloat(tipAmount) || 0;
    const total = subtotal + tax + tip;
    
    return { subtotal, tax, tip, total };
  };

  const calculateChange = (order: PendingOrder) => {
    const { total } = calculateTotals(order);
    const received = parseFloat(receivedAmount) || 0;
    return Math.max(0, received - total);
  };

  const processPayment = () => {
    if (!selectedOrder || !paymentMethod) return;
    
    // Aquí iría la lógica de procesamiento del pago
    console.log("Procesando pago...", {
      order: selectedOrder,
      paymentMethod,
      receivedAmount,
      tipAmount
    });
    
    // Resetear formulario
    setSelectedOrder(null);
    setPaymentMethod("");
    setReceivedAmount("");
    setTipAmount("");
    setCustomerNotes("");
  };

  const todaysSales = recentTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const todaysTransactions = recentTransactions.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Caja</h1>
          <p className="text-gray-600 mt-1">
            Procesamiento de pagos y facturación - Luis Pérez
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Caja Abierta
          </Badge>
          <Badge variant="secondary">
            Turno: 09:00 - 17:00
          </Badge>
        </div>
      </div>

      {/* Estadísticas del día */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Día</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todaysSales.toFixed(2)}</div>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+8%</span>
              <span>vs ayer</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
            <Receipt className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysTransactions}</div>
            <div className="text-xs text-gray-600">
              Promedio: <span className="font-medium">${(todaysSales / todaysTransactions).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders.length}</div>
            <div className="text-xs text-gray-600">
              <span className="text-orange-600">Listas para cobrar</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efectivo en Caja</CardTitle>
            <Banknote className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,250.00</div>
            <div className="text-xs text-gray-600">
              Último arqueo: <span className="font-medium">09:00</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending">Órdenes Pendientes</TabsTrigger>
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Órdenes pendientes */}
            <Card>
              <CardHeader>
                <CardTitle>Órdenes Listas para Cobrar</CardTitle>
                <CardDescription>
                  Selecciona una orden para procesar el pago
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingOrders.map((order) => (
                  <Card 
                    key={order.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedOrder?.id === order.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">Mesa #{order.tableNumber}</h3>
                          <p className="text-sm text-gray-600">Mesero: {order.waiter}</p>
                          <p className="text-sm text-gray-600">Hora: {order.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${order.subtotal.toFixed(2)}</p>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Listo
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items.length} productos • Total: ${(order.subtotal * 1.16).toFixed(2)} (con IVA)
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Panel de procesamiento de pago */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Procesar Pago</span>
                </CardTitle>
                <CardDescription>
                  {selectedOrder ? `Mesa ${selectedOrder.tableNumber}` : "Selecciona una orden"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedOrder ? (
                  <>
                    {/* Detalle de la orden */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Detalle del Pedido</h4>
                      <div className="max-h-32 overflow-y-auto space-y-2">
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cálculos */}
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${calculateTotals(selectedOrder).subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IVA (16%):</span>
                        <span>${calculateTotals(selectedOrder).tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Propina:</span>
                        <span>${calculateTotals(selectedOrder).tip.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>${calculateTotals(selectedOrder).total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Propina */}
                    <div className="space-y-2">
                      <Label htmlFor="tip">Propina (opcional)</Label>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setTipAmount((selectedOrder.subtotal * 0.10).toFixed(2))}
                        >
                          10%
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setTipAmount((selectedOrder.subtotal * 0.15).toFixed(2))}
                        >
                          15%
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setTipAmount((selectedOrder.subtotal * 0.20).toFixed(2))}
                        >
                          20%
                        </Button>
                        <Input
                          id="tip"
                          type="number"
                          placeholder="$0.00"
                          value={tipAmount}
                          onChange={(e) => setTipAmount(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {/* Método de pago */}
                    <div className="space-y-2">
                      <Label>Método de Pago</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={paymentMethod === "efectivo" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("efectivo")}
                          className="flex items-center space-x-2"
                        >
                          <Banknote className="h-4 w-4" />
                          <span>Efectivo</span>
                        </Button>
                        <Button
                          variant={paymentMethod === "tarjeta" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("tarjeta")}
                          className="flex items-center space-x-2"
                        >
                          <CreditCard className="h-4 w-4" />
                          <span>Tarjeta</span>
                        </Button>
                        <Button
                          variant={paymentMethod === "transferencia" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("transferencia")}
                          className="flex items-center space-x-2"
                        >
                          <Smartphone className="h-4 w-4" />
                          <span>Transferencia</span>
                        </Button>
                        <Button
                          variant={paymentMethod === "mixto" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("mixto")}
                          className="flex items-center space-x-2"
                        >
                          <Zap className="h-4 w-4" />
                          <span>Mixto</span>
                        </Button>
                      </div>
                    </div>

                    {/* Monto recibido (solo para efectivo) */}
                    {paymentMethod === "efectivo" && (
                      <div className="space-y-2">
                        <Label htmlFor="received">Monto Recibido</Label>
                        <Input
                          id="received"
                          type="number"
                          placeholder="$0.00"
                          value={receivedAmount}
                          onChange={(e) => setReceivedAmount(e.target.value)}
                        />
                        {receivedAmount && (
                          <div className="flex justify-between text-sm">
                            <span>Cambio:</span>
                            <span className="font-bold text-green-600">
                              ${calculateChange(selectedOrder).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notas */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notas (opcional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Notas adicionales..."
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        rows={2}
                      />
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={processPayment}
                        disabled={!paymentMethod || (paymentMethod === "efectivo" && !receivedAmount)}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Procesar Pago - ${calculateTotals(selectedOrder).total.toFixed(2)}
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                          <Printer className="h-4 w-4 mr-2" />
                          Factura
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Ticket
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Selecciona una orden para procesar el pago
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transacciones del Día</CardTitle>
              <CardDescription>
                Historial de pagos procesados hoy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">#{transaction.tableNumber}</span>
                      </div>
                      <div>
                        <p className="font-medium">Mesa {transaction.tableNumber}</p>
                        <p className="text-sm text-gray-600">
                          {transaction.time} • {transaction.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${transaction.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">#{transaction.receiptNumber}</p>
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