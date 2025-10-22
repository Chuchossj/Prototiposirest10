import { useState, useEffect } from "react";
import { SecureLogin } from "./components/sirest/SecureLogin";
import { ClientPortal } from "./components/sirest/ClientPortal";
import { AdminDashboard } from "./components/sirest/AdminDashboard";
import { AdminSupervisionView } from "./components/sirest/AdminSupervisionView";
import { WaiterModule } from "./components/sirest/WaiterModule";
import { CashierModule } from "./components/sirest/CashierModule";
import { KitchenModule } from "./components/sirest/KitchenModule";
import { UserProfile } from "./components/sirest/UserProfile";
import { SystemConfiguration } from "./components/sirest/SystemConfiguration";
import { PasswordReset } from "./components/sirest/PasswordReset";
import { InventoryManagement } from "./components/restaurant/InventoryManagement";
import { UserManagement } from "./components/restaurant/UserManagement";
import { ReportsAndAnalytics } from "./components/restaurant/ReportsAndAnalytics";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger
} from "./components/ui/sidebar";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Toaster } from "./components/ui/sonner";
import { 
  Home, 
  Package, 
  Users, 
  CreditCard, 
  ChefHat,
  Utensils,
  BarChart3,
  Settings,
  User,
  LogOut,
  Building2,
  Clock,
  Receipt,
  UserCheck,
  Calculator,
  FileText,
  Bell
} from "lucide-react";

interface UserSession {
  role: string;
  username: string;
  userData: any;
  accessToken: string;
}

// Configuración de menús por rol con seguridad estricta
const getMenuItems = (role: string) => {
  const menuConfigs = {
    administrador: [
      {
        title: "Panel Principal",
        items: [
          { title: "Dashboard", icon: Home, id: "dashboard", badge: null }
        ]
      },
      {
        title: "Gestión Administrativa",
        items: [
          { title: "Gestión de Usuarios", icon: Users, id: "users", badge: null },
          { title: "Inventario", icon: Package, id: "inventory", badge: null },
          { title: "Reportes y Análisis", icon: BarChart3, id: "reports", badge: null }
        ]
      },
      {
        title: "Supervisión",
        items: [
          { title: "Centro de Alertas", icon: Bell, id: "alerts-view", badge: null },
          { title: "Estado del Personal", icon: UserCheck, id: "staff-view", badge: null },
          { title: "Control de Cocina", icon: ChefHat, id: "kitchen-view", badge: null },
          { title: "Punto de Venta", icon: CreditCard, id: "pos-view", badge: null },
          { title: "Control de Mesas", icon: Utensils, id: "tables-view", badge: null }
        ]
      }
    ],
    mesero: [
      {
        title: "Panel de Servicio",
        items: [
          { title: "Mi Dashboard", icon: Home, id: "dashboard", badge: null }
        ]
      },
      {
        title: "Gestión de Mesas",
        items: [
          { title: "Mis Mesas", icon: Utensils, id: "tables", badge: "4" },
          { title: "Nuevo Pedido", icon: FileText, id: "new-order", badge: null },
          { title: "Pedidos Activos", icon: Clock, id: "active-orders", badge: "7" }
        ]
      }
    ],
    cajero: [
      {
        title: "Panel de Caja",
        items: [
          { title: "Mi Dashboard", icon: Home, id: "dashboard", badge: null }
        ]
      },
      {
        title: "Procesamiento",
        items: [
          { title: "Órdenes a Cobrar", icon: CreditCard, id: "pending-payments", badge: "3" },
          { title: "Transacciones", icon: Receipt, id: "transactions", badge: null },
          { title: "Caja y Arqueo", icon: Calculator, id: "cash-management", badge: null }
        ]
      }
    ],
    cocinero: [
      {
        title: "Panel de Cocina",
        items: [
          { title: "Mi Dashboard", icon: Home, id: "dashboard", badge: null }
        ]
      },
      {
        title: "Producción",
        items: [
          { title: "Órdenes Pendientes", icon: Clock, id: "pending-orders", badge: "8" },
          { title: "En Preparación", icon: ChefHat, id: "preparing-orders", badge: "3" },
          { title: "Órdenes Listas", icon: Receipt, id: "ready-orders", badge: "2" }
        ]
      }
    ]
  };

  return menuConfigs[role as keyof typeof menuConfigs] || [];
};

const getRoleIcon = (role: string) => {
  const icons = {
    administrador: UserCheck,
    mesero: Users,
    cajero: CreditCard,
    cocinero: ChefHat
  };
  return icons[role as keyof typeof icons] || User;
};

const getRoleColor = (role: string) => {
  const colors = {
    administrador: "bg-gray-900 text-white border-gray-700",
    mesero: "bg-blue-100 text-blue-800 border-blue-300",
    cajero: "bg-green-100 text-green-800 border-green-300",
    cocinero: "bg-yellow-100 text-yellow-800 border-yellow-300"
  };
  return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const getModuleName = (activeModule: string, role: string) => {
  if (activeModule === "profile") return "Mi Perfil";
  if (activeModule === "configuration") return "Configuración";
  
  const allItems = getMenuItems(role).flatMap(g => g.items);
  return allItems.find(item => item.id === activeModule)?.title || "Dashboard";
};

function AppSidebar({ 
  userSession, 
  activeModule, 
  setActiveModule, 
  onLogout 
}: { 
  userSession: UserSession;
  activeModule: string; 
  setActiveModule: (module: string) => void;
  onLogout: () => void;
}) {
  const menuItems = getMenuItems(userSession.role);
  const RoleIcon = getRoleIcon(userSession.role);

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center shadow">
            <Utensils className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">SIREST</h2>
            <p className="text-xs text-gray-600">Globatech S.A.S</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {menuItems.map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel className="text-gray-700 font-medium text-xs uppercase tracking-wide">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        isActive={activeModule === item.id}
                        onClick={() => setActiveModule(item.id)}
                        className="w-full hover:bg-gray-100 data-[state=active]:bg-gray-900 data-[state=active]:text-white transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge className="ml-auto bg-red-100 text-red-800 border-red-300">
                            {item.badge}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => setActiveModule("configuration")}
              className={`hover:bg-gray-100 transition-colors ${activeModule === "configuration" ? "bg-gray-900 text-white" : ""}`}
            >
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => setActiveModule("profile")}
              className={`hover:bg-gray-100 transition-colors ${activeModule === "profile" ? "bg-gray-900 text-white" : ""}`}
            >
              <User className="h-4 w-4" />
              <span>Mi Perfil</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onLogout} className="hover:bg-red-50 text-red-600 transition-colors">
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function MainContent({ 
  userSession, 
  activeModule,
  onUserUpdate,
  onNavigate
}: { 
  userSession: UserSession;
  activeModule: string;
  onUserUpdate: (updatedData: any) => void;
  onNavigate: (module: string) => void;
}) {
  const renderContent = () => {
    // Módulos universales disponibles para todos los roles
    if (activeModule === "profile") {
      return <UserProfile userSession={userSession} accessToken={userSession.accessToken} onUpdate={onUserUpdate} />;
    }
    
    if (activeModule === "configuration") {
      return <SystemConfiguration userRole={userSession.role} accessToken={userSession.accessToken} />;
    }

    // Sistema de seguridad: Solo módulos autorizados por rol
    switch (userSession.role) {
      case "administrador":
        switch (activeModule) {
          case "dashboard":
            return <AdminDashboard onNavigate={onNavigate} />;
          case "users":
            return <UserManagement accessToken={userSession.accessToken} />;
          case "inventory":
            return <InventoryManagement accessToken={userSession.accessToken} />;
          case "reports":
            return <ReportsAndAnalytics />;
          case "alerts-view":
            return <AdminSupervisionView module="alerts" accessToken={userSession.accessToken} />; // Centro de alertas
          case "staff-view":
            return <AdminSupervisionView module="staff" accessToken={userSession.accessToken} />; // Estado del personal
          case "kitchen-view":
            return <AdminSupervisionView module="kitchen" accessToken={userSession.accessToken} />; // Vista de supervisión de cocina
          case "pos-view":
            return <AdminSupervisionView module="pos" accessToken={userSession.accessToken} />; // Vista de supervisión de punto de venta
          case "tables-view":
            return <AdminSupervisionView module="tables" accessToken={userSession.accessToken} />; // Vista de supervisión de mesas
          default:
            return <AdminDashboard onNavigate={onNavigate} />;
        }
      
      case "mesero":
        switch (activeModule) {
          case "dashboard":
          case "tables":
          case "new-order":
          case "active-orders":
            return <WaiterModule activeTab={activeModule} accessToken={userSession.accessToken} />;
          default:
            return <WaiterModule accessToken={userSession.accessToken} />;
        }
      
      case "cajero":
        switch (activeModule) {
          case "dashboard":
          case "pending-payments":
          case "transactions":
          case "cash-management":
            return <CashierModule activeTab={activeModule} accessToken={userSession.accessToken} />;
          default:
            return <CashierModule accessToken={userSession.accessToken} />;
        }
      
      case "cocinero":
        switch (activeModule) {
          case "dashboard":
          case "pending-orders":
          case "preparing-orders":
          case "ready-orders":
            return <KitchenModule activeTab={activeModule} accessToken={userSession.accessToken} />;
          default:
            return <KitchenModule accessToken={userSession.accessToken} />;
        }
      
      default:
        return <div className="p-8 text-center text-red-600">Acceso no autorizado</div>;
    }
  };

  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      <div className="container mx-auto py-8 px-6">
        {renderContent()}
      </div>
    </main>
  );
}

export default function App() {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [activeModule, setActiveModule] = useState("dashboard");
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'success' | 'info' | 'warning'}>>([]);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar datos de ejemplo al cargar la aplicación
  useEffect(() => {
    const initializeData = async () => {
      if (!isInitialized) {
        try {
          const { projectId, publicAnonKey } = await import('./utils/supabase/info');
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-71783a73/init-demo-data`,
            {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${publicAnonKey}`,
                "Content-Type": "application/json"
              }
            }
          );
          
          if (response.ok) {
            console.log("Datos inicializados correctamente");
            setIsInitialized(true);
          }
        } catch (error) {
          console.error("Error al inicializar datos:", error);
        }
      }
    };

    initializeData();
  }, []);

  const handleLogin = (role: string, username: string, userData: any, accessToken: string) => {
    setUserSession({ role, username, userData, accessToken });
    setActiveModule("dashboard");
  };

  const handleLogout = () => {
    setUserSession(null);
    setActiveModule("dashboard");
  };

  const handleUserUpdate = (updatedData: any) => {
    if (userSession) {
      setUserSession({
        ...userSession,
        userData: updatedData
      });
    }
  };

  // Simular notificaciones del sistema para demostrar interactividad
  useEffect(() => {
    if (!userSession) return;

    const notificationInterval = setInterval(() => {
      const systemNotifications = [
        { message: "Nuevo pedido recibido en Mesa 5", type: "info" as const },
        { message: "Pedido listo para servir - Mesa 12", type: "success" as const },
        { message: "Stock bajo: Tomates Cherry", type: "warning" as const },
        { message: "Pago procesado exitosamente - Mesa 8", type: "success" as const },
        { message: "Nueva reserva para esta noche", type: "info" as const }
      ];

      const randomNotification = systemNotifications[Math.floor(Math.random() * systemNotifications.length)];
      const notificationId = Date.now().toString();
      
      setNotifications(prev => [...prev, { id: notificationId, ...randomNotification }]);

      // Limpiar notificación después de 5 segundos
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }, 5000);
    }, 8000); // Nueva notificación cada 8 segundos

    return () => clearInterval(notificationInterval);
  }, [userSession]);

  // Si no hay sesión, mostrar login o reset de contraseña
  if (!userSession) {
    if (showPasswordReset) {
      return <PasswordReset onClose={() => setShowPasswordReset(false)} />;
    }
    return <SecureLogin onLogin={handleLogin} onPasswordReset={() => setShowPasswordReset(true)} />;
  }

  // Interfaz completamente aislada para clientes
  if (userSession.role === "cliente") {
    return <ClientPortal userData={userSession.userData} onLogout={handleLogout} accessToken={userSession.accessToken} />;
  }

  const RoleIcon = getRoleIcon(userSession.role);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-white">
        <AppSidebar 
          userSession={userSession}
          activeModule={activeModule} 
          setActiveModule={setActiveModule}
          onLogout={handleLogout}
        />
        <div className="flex flex-col flex-1">
          <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="bg-gray-50 border-gray-300 text-gray-700 px-3 py-1">
                    <Building2 className="h-3 w-3 mr-2" />
                    SIREST • Globatech S.A.S
                  </Badge>
                  <Badge className={getRoleColor(userSession.role)}>
                    <RoleIcon className="h-3 w-3 mr-2" />
                    {userSession.role.charAt(0).toUpperCase() + userSession.role.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-700">
                    Módulo: {getModuleName(activeModule, userSession.role)}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* Notificaciones */}
                {notifications.length > 0 && (
                  <div className="flex flex-col space-y-1 max-w-xs">
                    {notifications.slice(-2).map((notification) => (
                      <div
                        key={notification.id}
                        className={`text-xs px-3 py-2 rounded-lg animate-fade-in shadow-sm ${
                          notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                          notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                          'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {notification.message}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{userSession.username}</p>
                  <p className="text-xs text-gray-600">
                    {userSession.role === "administrador" ? "Administrador del Sistema" :
                     userSession.role === "mesero" ? "Encargado de Servicio" :
                     userSession.role === "cajero" ? "Especialista en Pagos" :
                     userSession.role === "cocinero" ? "Chef de Cocina" :
                     "Usuario"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center shadow">
                  <RoleIcon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </header>
          <MainContent userSession={userSession} activeModule={activeModule} onUserUpdate={handleUserUpdate} onNavigate={setActiveModule} />
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}