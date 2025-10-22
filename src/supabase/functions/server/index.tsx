import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger(console.log));

// Crear cliente Supabase
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// ==================== AUTENTICACIÓN ====================

// Registro de usuario
app.post("/make-server-71783a73/auth/signup", async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();

    // Validar que solo admin puede crear usuarios con ciertos roles
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.split(" ")[1];
    
    let requestingUser = null;
    if (token && token !== Deno.env.get("SUPABASE_ANON_KEY")) {
      const { data } = await supabase.auth.getUser(token);
      if (data?.user) {
        const userData = await kv.get(`user_profile:${data.user.id}`);
        requestingUser = userData;
      }
    }

    // Solo administradores pueden crear usuarios de staff
    if (role !== "cliente" && (!requestingUser || requestingUser.role !== "administrador")) {
      return c.json({ error: "Solo administradores pueden crear usuarios de staff" }, 403);
    }

    // Crear usuario en Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email ya que no hay servidor de email configurado
      user_metadata: { name, role }
    });

    if (error) {
      console.error("Error al crear usuario:", error);
      return c.json({ error: error.message }, 400);
    }

    // Guardar perfil del usuario en KV
    const userProfile = {
      id: data.user.id,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
      phone: "",
      avatar: "",
      active: true // Usuario activo por defecto
    };

    await kv.set(`user_profile:${data.user.id}`, userProfile);
    await kv.set(`user_by_email:${email}`, data.user.id);

    return c.json({ 
      success: true, 
      user: { id: data.user.id, email, name, role } 
    });
  } catch (error) {
    console.error("Error en signup:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Login de usuario
app.post("/make-server-71783a73/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    // Crear cliente temporal para login (sin SERVICE_ROLE_KEY)
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data, error } = await authClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Error al iniciar sesión:", error);
      return c.json({ error: "Credenciales inválidas" }, 401);
    }

    // Obtener perfil del usuario
    const userProfile = await kv.get(`user_profile:${data.user.id}`);

    // Verificar si el usuario está activo
    if (userProfile && userProfile.active === false) {
      return c.json({ 
        error: `Cuenta desactivada. Motivo: ${userProfile.deactivationNote || "No especificado"}` 
      }, 403);
    }

    return c.json({
      success: true,
      accessToken: data.session.access_token,
      user: userProfile || {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || "",
        role: data.user.user_metadata?.role || "cliente"
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Verificar sesión activa
app.get("/make-server-71783a73/auth/session", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    
    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return c.json({ error: "Invalid session" }, 401);
    }

    const userProfile = await kv.get(`user_profile:${data.user.id}`);

    return c.json({
      success: true,
      user: userProfile || {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || "",
        role: data.user.user_metadata?.role || "cliente"
      }
    });
  } catch (error) {
    console.error("Error verificando sesión:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== PERFIL DE USUARIO ====================

app.get("/make-server-71783a73/profile", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user_profile:${user.id}`);
    return c.json({ success: true, profile });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.put("/make-server-71783a73/profile", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const updates = await c.req.json();
    const currentProfile = await kv.get(`user_profile:${user.id}`) || {};
    
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      id: user.id, // No permitir cambiar ID
      role: currentProfile.role, // No permitir cambiar rol desde perfil
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user_profile:${user.id}`, updatedProfile);

    return c.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== GESTIÓN DE USUARIOS ====================

// Listar todos los usuarios
app.get("/make-server-71783a73/users", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Verificar que el usuario es administrador
    const profile = await kv.get(`user_profile:${user.id}`);
    if (!profile || profile.role !== "administrador") {
      return c.json({ error: "Solo administradores pueden ver usuarios" }, 403);
    }

    // Obtener todos los perfiles de usuarios
    const userProfiles = await kv.getByPrefix("user_profile:") || [];
    
    return c.json({ success: true, users: userProfiles });
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Actualizar usuario (activar/desactivar, etc.)
app.put("/make-server-71783a73/users/:userId", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Verificar que el usuario es administrador
    const profile = await kv.get(`user_profile:${user.id}`);
    if (!profile || profile.role !== "administrador") {
      return c.json({ error: "Solo administradores pueden modificar usuarios" }, 403);
    }

    const userId = c.req.param("userId");
    const updates = await c.req.json();
    
    const currentProfile = await kv.get(`user_profile:${userId}`);
    if (!currentProfile) {
      return c.json({ error: "Usuario no encontrado" }, 404);
    }

    // Construir perfil actualizado
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      id: userId, // No permitir cambiar ID
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    };

    // Si se está desactivando el usuario, agregar información adicional
    if (updates.active === false && updates.deactivationNote) {
      updatedProfile.deactivatedAt = new Date().toISOString();
      updatedProfile.deactivatedBy = user.id;
    }

    // Si se está reactivando el usuario, limpiar información de desactivación
    if (updates.active === true) {
      delete updatedProfile.deactivationNote;
      delete updatedProfile.deactivatedAt;
      delete updatedProfile.deactivatedBy;
      updatedProfile.reactivatedAt = new Date().toISOString();
      updatedProfile.reactivatedBy = user.id;
    }

    await kv.set(`user_profile:${userId}`, updatedProfile);

    return c.json({ success: true, user: updatedProfile });
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== CONFIGURACIÓN DEL SISTEMA ====================

app.get("/make-server-71783a73/configuration", async (c) => {
  try {
    const config = await kv.get("system_configuration") || {
      restaurantName: "SIREST - Globatech",
      address: "Calle Principal #123",
      phone: "+57 300 123 4567",
      email: "info@globatech.com",
      taxRate: 19,
      currency: "COP",
      timezone: "America/Bogota"
    };

    return c.json({ success: true, configuration: config });
  } catch (error) {
    console.error("Error obteniendo configuración:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.put("/make-server-71783a73/configuration", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Verificar que el usuario es administrador
    const profile = await kv.get(`user_profile:${user.id}`);
    if (!profile || profile.role !== "administrador") {
      return c.json({ error: "Solo administradores pueden modificar la configuración" }, 403);
    }

    const updates = await c.req.json();
    await kv.set("system_configuration", {
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    });

    return c.json({ success: true, configuration: updates });
  } catch (error) {
    console.error("Error actualizando configuración:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== PRODUCTOS/INVENTARIO ====================

app.get("/make-server-71783a73/products", async (c) => {
  try {
    const products = await kv.getByPrefix("product:") || [];
    return c.json({ success: true, products: products.map(p => p) });
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-71783a73/products", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const product = await c.req.json();
    const productId = `product:${Date.now()}`;
    
    const newProduct = {
      ...product,
      id: productId,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };

    await kv.set(productId, newProduct);

    return c.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error creando producto:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.put("/make-server-71783a73/products/:id", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const productId = c.req.param("id");
    const updates = await c.req.json();
    
    const currentProduct = await kv.get(productId);
    if (!currentProduct) {
      return c.json({ error: "Producto no encontrado" }, 404);
    }

    const updatedProduct = {
      ...currentProduct,
      ...updates,
      id: productId,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    };

    await kv.set(productId, updatedProduct);

    return c.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error actualizando producto:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.delete("/make-server-71783a73/products/:id", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const productId = c.req.param("id");
    await kv.del(productId);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== MESAS ====================

app.get("/make-server-71783a73/tables", async (c) => {
  try {
    const tables = await kv.getByPrefix("table:") || [];
    return c.json({ success: true, tables: tables.map(t => t) });
  } catch (error) {
    console.error("Error obteniendo mesas:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.put("/make-server-71783a73/tables/:id", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const tableId = c.req.param("id");
    const updates = await c.req.json();
    
    const currentTable = await kv.get(tableId) || {};

    const updatedTable = {
      ...currentTable,
      ...updates,
      id: tableId,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    };

    await kv.set(tableId, updatedTable);

    return c.json({ success: true, table: updatedTable });
  } catch (error) {
    console.error("Error actualizando mesa:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== PEDIDOS ====================

app.get("/make-server-71783a73/orders", async (c) => {
  try {
    const orders = await kv.getByPrefix("order:") || [];
    return c.json({ success: true, orders: orders.map(o => o) });
  } catch (error) {
    console.error("Error obteniendo pedidos:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-71783a73/orders", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    console.log("Authorization header:", authHeader);
    
    const token = authHeader?.split(" ")[1];
    console.log("Token extracted:", token ? "Present" : "Missing");
    
    if (!token) {
      console.error("No token provided in Authorization header");
      return c.json({ error: "Unauthorized - No token provided" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error("Error validating token:", error);
      return c.json({ error: `Unauthorized - ${error.message}` }, 401);
    }

    if (!user?.id) {
      console.error("No user found for token");
      return c.json({ error: "Unauthorized - Invalid user" }, 401);
    }

    console.log("User creating order:", user.id, user.email);

    const order = await c.req.json();
    const orderId = `order:${Date.now()}`;
    
    const newOrder = {
      ...order,
      id: orderId,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      status: order.status || "pending"
    };

    await kv.set(orderId, newOrder);

    // Crear alerta para nuevo pedido
    const alertId = `alert:${Date.now()}`;
    await kv.set(alertId, {
      id: alertId,
      type: "new_order",
      message: `Nuevo pedido para Mesa ${order.tableNumber}`,
      orderId: orderId,
      createdAt: new Date().toISOString(),
      read: false
    });

    console.log("Order created successfully:", orderId);
    return c.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error creando pedido:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.put("/make-server-71783a73/orders/:id", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const orderId = c.req.param("id");
    const updates = await c.req.json();
    
    const currentOrder = await kv.get(orderId);
    if (!currentOrder) {
      return c.json({ error: "Pedido no encontrado" }, 404);
    }

    const updatedOrder = {
      ...currentOrder,
      ...updates,
      id: orderId,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    };

    await kv.set(orderId, updatedOrder);

    // Crear alerta si el pedido está listo
    if (updates.status === "ready" && currentOrder.status !== "ready") {
      const alertId = `alert:${Date.now()}`;
      await kv.set(alertId, {
        id: alertId,
        type: "order_ready",
        message: `Pedido listo para Mesa ${updatedOrder.tableNumber}`,
        orderId: orderId,
        createdAt: new Date().toISOString(),
        read: false
      });
    }

    return c.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error actualizando pedido:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== USUARIOS (CRUD para Admin) ====================

app.get("/make-server-71783a73/users", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user_profile:${user.id}`);
    if (!profile || profile.role !== "administrador") {
      return c.json({ error: "Solo administradores pueden ver usuarios" }, 403);
    }

    const users = await kv.getByPrefix("user_profile:") || [];
    return c.json({ success: true, users: users.map(u => u) });
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== ALERTAS ====================

app.get("/make-server-71783a73/alerts", async (c) => {
  try {
    const alerts = await kv.getByPrefix("alert:") || [];
    return c.json({ success: true, alerts: alerts.filter(a => !a.read) });
  } catch (error) {
    console.error("Error obteniendo alertas:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.put("/make-server-71783a73/alerts/:id/read", async (c) => {
  try {
    const alertId = c.req.param("id");
    const alert = await kv.get(alertId);
    
    if (!alert) {
      return c.json({ error: "Alerta no encontrada" }, 404);
    }

    await kv.set(alertId, { ...alert, read: true });
    return c.json({ success: true });
  } catch (error) {
    console.error("Error marcando alerta:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== PAGOS ====================

app.post("/make-server-71783a73/payments", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const payment = await c.req.json();
    const paymentId = `payment:${Date.now()}`;
    
    const newPayment = {
      ...payment,
      id: paymentId,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      status: "completed"
    };

    await kv.set(paymentId, newPayment);

    // Actualizar el pedido a pagado
    if (payment.orderId) {
      const order = await kv.get(payment.orderId);
      if (order) {
        await kv.set(payment.orderId, { ...order, status: "paid", paidAt: new Date().toISOString() });
      }
    }

    return c.json({ success: true, payment: newPayment });
  } catch (error) {
    console.error("Error procesando pago:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-71783a73/payments", async (c) => {
  try {
    const payments = await kv.getByPrefix("payment:") || [];
    return c.json({ success: true, payments: payments.map(p => p) });
  } catch (error) {
    console.error("Error obteniendo pagos:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== REPORTES DE CAJA ====================

app.post("/make-server-71783a73/cash-closing", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const closingData = await c.req.json();
    const closingId = `cash_closing:${Date.now()}`;
    
    const payments = await kv.getByPrefix("payment:") || [];
    const todayPayments = payments.filter(p => {
      const paymentDate = new Date(p.createdAt).toDateString();
      return paymentDate === new Date().toDateString();
    });

    const totalSales = todayPayments.reduce((sum, p) => sum + (p.total || 0), 0);
    const totalCash = todayPayments.filter(p => p.paymentMethod === "efectivo").reduce((sum, p) => sum + (p.total || 0), 0);
    const totalCard = todayPayments.filter(p => p.paymentMethod === "tarjeta").reduce((sum, p) => sum + (p.total || 0), 0);
    
    const closingReport = {
      ...closingData,
      id: closingId,
      date: new Date().toISOString(),
      totalSales,
      totalCash,
      totalCard,
      totalTransactions: todayPayments.length,
      closedBy: user.id
    };

    await kv.set(closingId, closingReport);

    return c.json({ success: true, report: closingReport });
  } catch (error) {
    console.error("Error creando cierre de caja:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-71783a73/cash-closings", async (c) => {
  try {
    const closings = await kv.getByPrefix("cash_closing:") || [];
    return c.json({ success: true, closings: closings.map(c => c) });
  } catch (error) {
    console.error("Error obteniendo cierres de caja:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== ESTADO DEL PERSONAL ====================

app.get("/make-server-71783a73/staff-status", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user_profile:${user.id}`);
    if (!profile || profile.role !== "administrador") {
      return c.json({ error: "Solo administradores pueden ver estado del personal" }, 403);
    }

    const users = await kv.getByPrefix("user_profile:") || [];
    const staff = users.filter(u => u.role !== "cliente" && u.role !== "administrador");
    
    const staffStatus = staff.map(s => {
      const statusData = {
        id: s.id,
        name: s.name,
        role: s.role,
        status: "activo", // En producción esto vendría de un sistema de asistencia
        shift: s.role === "cocinero" ? "11:00 - 22:00" : s.role === "mesero" ? "10:00 - 20:00" : "09:00 - 17:00",
        performance: Math.floor(Math.random() * 30) + 70 // Simulado
      };
      return statusData;
    });

    return c.json({ success: true, staff: staffStatus });
  } catch (error) {
    console.error("Error obteniendo estado del personal:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== INICIALIZACIÓN ====================

// Endpoint para inicializar datos de ejemplo
app.post("/make-server-71783a73/init-demo-data", async (c) => {
  try {
    // Crear usuarios de demostración para todos los roles
    const demoUsers = [
      {
        email: "admin@globatech.com",
        password: "admin123",
        name: "Administrador Principal",
        role: "administrador",
        phone: "+57 1 234 5678"
      },
      {
        email: "mesero@globatech.com",
        password: "mesero123",
        name: "Carlos Mesero",
        role: "mesero",
        phone: "+57 300 111 2222"
      },
      {
        email: "cajero@globatech.com",
        password: "cajero123",
        name: "María Cajera",
        role: "cajero",
        phone: "+57 300 333 4444"
      },
      {
        email: "cocinero@globatech.com",
        password: "cocinero123",
        name: "Juan Cocinero",
        role: "cocinero",
        phone: "+57 300 555 6666"
      },
      {
        email: "cliente@globatech.com",
        password: "cliente123",
        name: "Ana Cliente",
        role: "cliente",
        phone: "+57 300 777 8888"
      }
    ];

    for (const user of demoUsers) {
      try {
        const existingUserId = await kv.get(`user_by_email:${user.email}`);
        
        if (existingUserId) {
          console.log(`Usuario ${user.email} ya existe, verificando perfil...`);
          
          // Verificar que el perfil existe en KV
          const existingProfile = await kv.get(`user_profile:${existingUserId}`);
          
          if (!existingProfile) {
            // El usuario existe en Auth pero no tiene perfil en KV, crearlo
            const userProfile = {
              id: existingUserId,
              email: user.email,
              name: user.name,
              role: user.role,
              createdAt: new Date().toISOString(),
              phone: user.phone,
              avatar: "",
              active: true
            };
            await kv.set(`user_profile:${existingUserId}`, userProfile);
            console.log(`Perfil creado para usuario existente: ${user.email}`);
          }
          continue;
        }

        // Intentar crear el usuario en Supabase Auth
        const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: { 
            name: user.name, 
            role: user.role 
          }
        });

        if (userError) {
          // Si el usuario ya existe en Auth, obtener su ID
          if (userError.message?.includes("already been registered")) {
            console.log(`Usuario ${user.email} ya existe en Auth, buscando ID...`);
            
            // Buscar el usuario por email en Auth
            const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
            
            if (!listError && users) {
              const existingAuthUser = users.find(u => u.email === user.email);
              
              if (existingAuthUser) {
                // Crear perfil en KV para usuario existente
                const userProfile = {
                  id: existingAuthUser.id,
                  email: user.email,
                  name: user.name,
                  role: user.role,
                  createdAt: new Date().toISOString(),
                  phone: user.phone,
                  avatar: "",
                  active: true
                };
                await kv.set(`user_profile:${existingAuthUser.id}`, userProfile);
                await kv.set(`user_by_email:${user.email}`, existingAuthUser.id);
                console.log(`Perfil sincronizado para usuario existente: ${user.email}`);
              }
            }
          } else {
            console.error(`Error creando usuario ${user.email}:`, userError.message);
          }
          continue;
        }

        if (newUser?.user) {
          const userProfile = {
            id: newUser.user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: new Date().toISOString(),
            phone: user.phone,
            avatar: "",
            active: true
          };

          await kv.set(`user_profile:${newUser.user.id}`, userProfile);
          await kv.set(`user_by_email:${user.email}`, newUser.user.id);
          console.log(`Usuario ${user.role} creado exitosamente: ${user.email}`);
        }
      } catch (userCreationError) {
        console.error(`Excepción al procesar usuario ${user.email}:`, userCreationError.message);
        // Continuar con el siguiente usuario
        continue;
      }
    }

    // Crear mesas de ejemplo si no existen
    const existingTables = await kv.getByPrefix("table:");
    
    if (!existingTables || existingTables.length === 0) {
      const tables = [
        { id: "table:1", number: "1", capacity: 4, status: "disponible", waiter: null },
        { id: "table:2", number: "2", capacity: 2, status: "disponible", waiter: null },
        { id: "table:3", number: "3", capacity: 6, status: "disponible", waiter: null },
        { id: "table:4", number: "4", capacity: 4, status: "disponible", waiter: null },
        { id: "table:5", number: "5", capacity: 8, status: "disponible", waiter: null },
        { id: "table:6", number: "6", capacity: 2, status: "disponible", waiter: null },
        { id: "table:7", number: "7", capacity: 4, status: "disponible", waiter: null },
        { id: "table:8", number: "8", capacity: 6, status: "disponible", waiter: null },
        { id: "table:9", number: "9", capacity: 4, status: "disponible", waiter: null },
        { id: "table:10", number: "10", capacity: 2, status: "disponible", waiter: null },
        { id: "table:11", number: "11", capacity: 4, status: "disponible", waiter: null },
        { id: "table:12", number: "12", capacity: 6, status: "disponible", waiter: null },
      ];

      for (const table of tables) {
        await kv.set(table.id, table);
      }
    }

    // Crear productos de ejemplo si no existen
    const existingProducts = await kv.getByPrefix("product:");
    
    if (!existingProducts || existingProducts.length === 0) {
      const products = [
        { id: "product:1", name: "Bandeja Paisa", category: "Platos Fuertes", price: 28000, stock: 50, minStock: 10, image: "" },
        { id: "product:2", name: "Ajiaco Santafereño", category: "Platos Fuertes", price: 22000, stock: 30, minStock: 10, image: "" },
        { id: "product:3", name: "Sancocho", category: "Platos Fuertes", price: 20000, stock: 40, minStock: 10, image: "" },
        { id: "product:4", name: "Arroz con Pollo", category: "Platos Fuertes", price: 18000, stock: 35, minStock: 10, image: "" },
        { id: "product:5", name: "Limonada Natural", category: "Bebidas", price: 5000, stock: 100, minStock: 20, image: "" },
        { id: "product:6", name: "Café", category: "Bebidas", price: 3000, stock: 150, minStock: 30, image: "" },
        { id: "product:7", name: "Jugo de Naranja", category: "Bebidas", price: 6000, stock: 80, minStock: 20, image: "" },
        { id: "product:8", name: "Brownie", category: "Postres", price: 8000, stock: 25, minStock: 5, image: "" },
      ];

      for (const product of products) {
        await kv.set(product.id, product);
      }
      console.log("Productos de ejemplo creados exitosamente");
    } else {
      console.log("Los productos ya existen, saltando creación");
    }

    // Configuración inicial del sistema (solo si no existe)
    const existingConfig = await kv.get("system_configuration");
    
    if (!existingConfig) {
      const defaultConfig = {
        restaurantName: "SIREST - Globatech",
        address: "Calle Principal #123, Bogotá, Colombia",
        phone: "+57 300 123 4567",
        email: "info@globatech.com",
        taxRate: 19,
        currency: "COP",
        timezone: "America/Bogota",
        updatedAt: new Date().toISOString()
      };

      await kv.set("system_configuration", defaultConfig);
      console.log("Configuración del sistema creada exitosamente");
    } else {
      console.log("La configuración del sistema ya existe");
    }

    return c.json({ 
      success: true, 
      message: "Datos de ejemplo inicializados correctamente",
      users: {
        admin: "admin@globatech.com / admin123",
        mesero: "mesero@globatech.com / mesero123",
        cajero: "cajero@globatech.com / cajero123",
        cocinero: "cocinero@globatech.com / cocinero123",
        cliente: "cliente@globatech.com / cliente123"
      }
    });
  } catch (error) {
    console.error("Error inicializando datos:", error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);
