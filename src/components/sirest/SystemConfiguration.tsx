import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";
import { toast } from "sonner@2.0.3";
import { 
  Settings, 
  Building2, 
  Bell, 
  Printer,
  DollarSign,
  Percent,
  Save,
  RefreshCw,
  AlertTriangle,
  Shield,
  Lock
} from "lucide-react";
import { useRealtimeData, apiRequest } from "../../utils/useRealtimeData";

interface SystemConfigurationProps {
  userRole: string;
  accessToken?: string;
}

export function SystemConfiguration({ userRole, accessToken }: SystemConfigurationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isAdmin = userRole === "administrador";
  
  // Obtener configuración del sistema
  const { data: configData, refetch } = useRealtimeData<{ success: boolean; configuration: any }>({
    endpoint: "/configuration",
    accessToken,
    refreshInterval: 5000
  });

  // Configuraciones del restaurante
  const [restaurantConfig, setRestaurantConfig] = useState({
    restaurantName: "",
    address: "",
    phone: "",
    email: "",
    taxRate: 19,
    currency: "COP",
    timezone: "America/Bogota"
  });

  // Sincronizar con datos del servidor
  useEffect(() => {
    if (configData?.success && configData.configuration) {
      setRestaurantConfig({
        restaurantName: configData.configuration.restaurantName || "SIREST - Globatech",
        address: configData.configuration.address || "Calle Principal #123",
        phone: configData.configuration.phone || "+57 300 123 4567",
        email: configData.configuration.email || "info@globatech.com",
        taxRate: configData.configuration.taxRate || 19,
        currency: configData.configuration.currency || "COP",
        timezone: configData.configuration.timezone || "America/Bogota"
      });
    }
  }, [configData]);

  const handleSaveConfiguration = async () => {
    if (!isAdmin) {
      toast.error("Solo los administradores pueden modificar la configuración");
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest("/configuration", {
        method: "PUT",
        body: restaurantConfig,
        accessToken
      });

      toast.success("Configuración actualizada exitosamente");
      refetch();
    } catch (error) {
      console.error("Error guardando configuración:", error);
      toast.error(error instanceof Error ? error.message : "Error al guardar la configuración");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Configuración del Sistema</h1>
              <p className="text-blue-100">
                {isAdmin ? "Gestiona las configuraciones de SIREST" : "Visualización de configuración (solo lectura)"}
              </p>
            </div>
          </div>
          <Badge className={isAdmin ? "bg-green-500/20 text-green-100 border-green-300/30" : "bg-yellow-500/20 text-yellow-100 border-yellow-300/30"}>
            {isAdmin ? (
              <>
                <Shield className="h-3 w-3 mr-1" />
                Acceso Completo
              </>
            ) : (
              <>
                <Lock className="h-3 w-3 mr-1" />
                Solo Lectura
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Alerta de permisos */}
      {!isAdmin && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Solo los administradores pueden modificar la configuración del sistema. 
            Puede visualizar la configuración actual pero no realizar cambios.
          </AlertDescription>
        </Alert>
      )}

      {/* Configuración del Restaurante */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span>Información del Restaurante</span>
          </CardTitle>
          <CardDescription>
            Configuración básica del establecimiento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Nombre del Restaurante</Label>
              <Input
                id="restaurantName"
                value={restaurantConfig.restaurantName}
                onChange={(e) => setRestaurantConfig({...restaurantConfig, restaurantName: e.target.value})}
                disabled={!isAdmin}
                className={!isAdmin ? "bg-gray-50" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={restaurantConfig.phone}
                onChange={(e) => setRestaurantConfig({...restaurantConfig, phone: e.target.value})}
                disabled={!isAdmin}
                className={!isAdmin ? "bg-gray-50" : ""}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                value={restaurantConfig.address}
                onChange={(e) => setRestaurantConfig({...restaurantConfig, address: e.target.value})}
                rows={2}
                disabled={!isAdmin}
                className={!isAdmin ? "bg-gray-50" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={restaurantConfig.email}
                onChange={(e) => setRestaurantConfig({...restaurantConfig, email: e.target.value})}
                disabled={!isAdmin}
                className={!isAdmin ? "bg-gray-50" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate" className="flex items-center space-x-2">
                <Percent className="h-4 w-4" />
                <span>Tasa de Impuesto (%)</span>
              </Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="50"
                value={restaurantConfig.taxRate}
                onChange={(e) => setRestaurantConfig({...restaurantConfig, taxRate: parseFloat(e.target.value)})}
                disabled={!isAdmin}
                className={!isAdmin ? "bg-gray-50" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select 
                value={restaurantConfig.currency} 
                onValueChange={(value) => setRestaurantConfig({...restaurantConfig, currency: value})}
                disabled={!isAdmin}
              >
                <SelectTrigger className={!isAdmin ? "bg-gray-50" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                  <SelectItem value="USD">Dólar Estadounidense (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Zona Horaria</Label>
              <Select 
                value={restaurantConfig.timezone} 
                onValueChange={(value) => setRestaurantConfig({...restaurantConfig, timezone: value})}
                disabled={!isAdmin}
              >
                <SelectTrigger className={!isAdmin ? "bg-gray-50" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Bogota">Colombia (UTC-5)</SelectItem>
                  <SelectItem value="America/Mexico_City">México (UTC-6)</SelectItem>
                  <SelectItem value="America/New_York">Nueva York (UTC-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isAdmin && (
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Recargar
              </Button>
              <Button 
                onClick={handleSaveConfiguration} 
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-900 to-purple-900"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Guardar Configuración
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3 text-sm text-gray-600">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 mb-1">Información de Seguridad</p>
              <p>
                Los cambios en la configuración del sistema son sensibles y solo pueden ser 
                realizados por usuarios con rol de Administrador. Todos los cambios quedan 
                registrados en el sistema de auditoría.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
