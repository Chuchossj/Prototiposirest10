# SIREST - Sistema de Gestión de Restaurante
## Globatech S.A.S.

### 🎯 Bienvenido al Sistema SIREST

Este es un sistema completo de gestión de restaurantes con autenticación real, base de datos en tiempo real y control de roles.

---

## 🚀 Primeros Pasos

### 1. Inicialización Automática
Al cargar la aplicación por primera vez, se crea automáticamente:
- ✅ Usuario administrador predeterminado
- ✅ Datos de ejemplo (productos, mesas)
- ✅ Configuración inicial del sistema

### 2. Credenciales de Administrador
Para acceder como administrador:
- **Email:** `admin@globatech.com`
- **Contraseña:** `admin123`

---

## 👥 Registro de Usuarios

### Para Clientes (Auto-registro)
1. Ir a la pestaña **"Registrarse"** en la pantalla de login
2. Completar:
   - Nombre completo
   - Correo electrónico
   - Contraseña (mínimo 6 caracteres)
3. Hacer clic en **"Crear Cuenta"**
4. Automáticamente se crea una cuenta de tipo **Cliente**

### Para Personal de Staff (Solo Admin)
Los usuarios de staff (Mesero, Cajero, Cocinero) **solo pueden ser creados por el administrador**:

1. Iniciar sesión como administrador
2. Ir a **"Gestión de Usuarios"** en el menú
3. Hacer clic en **"Nuevo Usuario"**
4. Completar los datos y seleccionar el rol apropiado:
   - 👨‍💼 **Administrador** - Acceso completo al sistema
   - 🧑‍🍳 **Mesero** - Gestión de mesas y pedidos
   - 💰 **Cajero** - Procesamiento de pagos
   - 👨‍🍳 **Cocinero** - Preparación de pedidos
5. El nuevo usuario recibirá sus credenciales

---

## 🔐 Inicio de Sesión

1. Ingresar correo electrónico y contraseña
2. El sistema redirigirá automáticamente según el rol:
   - **Admin** → Panel de administración completo
   - **Mesero** → Módulo de gestión de mesas
   - **Cajero** → Módulo de punto de venta
   - **Cocinero** → Módulo de cocina
   - **Cliente** → Portal simplificado

---

## ⚙️ Funcionalidades por Rol

### 👨‍💼 Administrador
- ✅ Gestión completa de usuarios
- ✅ Control de inventario (CRUD completo)
- ✅ Configuración del sistema (editable)
- ✅ Visualización de reportes
- ✅ Supervisión de operaciones (cocina, POS, mesas)
- ✅ Edición de perfil personal

### 🧑‍🍳 Mesero
- ✅ Gestión de mesas asignadas
- ✅ Creación y seguimiento de pedidos
- ✅ Visualización de menú
- ✅ Edición de perfil personal
- 🔒 Configuración del sistema (solo lectura)

### 💰 Cajero
- ✅ Procesamiento de pagos
- ✅ Gestión de transacciones
- ✅ Control de caja
- ✅ Edición de perfil personal
- 🔒 Configuración del sistema (solo lectura)

### 👨‍🍳 Cocinero
- ✅ Visualización de pedidos pendientes
- ✅ Actualización de estado de preparación
- ✅ Marcado de pedidos listos
- ✅ Edición de perfil personal
- 🔒 Configuración del sistema (solo lectura)

### 🧑 Cliente
- ✅ Consulta de estado de pedido
- ✅ Solicitud de cuenta
- ✅ Edición de perfil personal
- 🔒 Sin acceso a módulos administrativos

---

## 💾 Datos en Tiempo Real

El sistema utiliza **Supabase** para mantener todos los datos sincronizados en tiempo real:

- 🔄 **Inventario:** Se actualiza cada 3 segundos
- 🔄 **Usuarios:** Se actualiza cada 5 segundos
- 🔄 **Pedidos:** Se actualiza cada 3 segundos
- 🔄 **Mesas:** Se actualiza cada 3 segundos
- 🔄 **Configuración:** Se actualiza cada 5 segundos

### Ventajas:
- Varios usuarios pueden trabajar simultáneamente
- Los cambios se reflejan inmediatamente en todas las sesiones
- No se requiere recargar la página

---

## 👤 Perfil de Usuario

**Todos los usuarios pueden editar su perfil:**

1. Hacer clic en **"Mi Perfil"** en el menú inferior del sidebar
2. Hacer clic en **"Editar Perfil"**
3. Modificar:
   - Nombre completo
   - Correo electrónico
   - Teléfono
4. Guardar cambios

### Cambio de Contraseña:
1. Ir a la pestaña **"Seguridad"** en el perfil
2. Ingresar nueva contraseña (mínimo 6 caracteres)
3. Confirmar la contraseña
4. Hacer clic en **"Actualizar Contraseña"**

---

## ⚙️ Configuración del Sistema

### Solo Administradores
La configuración del sistema **solo puede ser modificada por administradores**:

- ✏️ Nombre del restaurante
- ✏️ Dirección y contacto
- ✏️ Tasa de impuestos
- ✏️ Moneda
- ✏️ Zona horaria

### Otros Roles
Los demás usuarios pueden **visualizar** la configuración pero **no editarla**.

---

## 📦 Gestión de Inventario (Admin)

### Agregar Producto:
1. Ir a **"Inventario"**
2. Clic en **"Agregar Producto"**
3. Completar información:
   - Nombre del producto
   - Categoría
   - Precio
   - Stock inicial
   - Stock mínimo
4. Guardar

### Editar Producto:
1. Hacer clic en el ícono de editar (lápiz)
2. Modificar los datos necesarios
3. Guardar cambios

### Eliminar Producto:
1. Hacer clic en el ícono de eliminar (papelera)
2. Confirmar la eliminación

### Alertas de Stock:
- 🟢 **Normal:** Stock por encima del mínimo
- 🟡 **Stock Bajo:** Stock igual o menor al mínimo
- 🔴 **Agotado:** Stock en 0

---

## 🔒 Seguridad

### Características de Seguridad:
- ✅ Autenticación real con Supabase Auth
- ✅ Contraseñas encriptadas
- ✅ Tokens de sesión seguros
- ✅ Control de permisos por rol
- ✅ Validación de datos en backend
- ✅ Protección contra acceso no autorizado

### Buenas Prácticas:
- 🔐 Usar contraseñas fuertes (mínimo 6 caracteres)
- 🔐 No compartir credenciales
- 🔐 Cerrar sesión al terminar
- 🔐 Cambiar contraseña periódicamente

---

## 🎨 Paleta de Colores Corporativa

- **Azul Oscuro:** `#0B2240` - Encabezados y elementos principales
- **Morado:** `#5B2C90` - Acentos y gradientes
- **Naranja:** `#F28C1B` - Alertas y notificaciones importantes
- **Amarillo:** `#FFD23F` - Advertencias y badges
- **Blanco:** `#FFFFFF` - Fondo y texto

---

## 📱 Diseño Responsivo

El sistema está optimizado para:
- 💻 **Desktop** - Experiencia completa
- 📱 **Tablet** - Diseño adaptado
- 📱 **Mobile** - Interfaz táctil optimizada

---

## 🆘 Solución de Problemas

### No puedo iniciar sesión
- Verificar que el email y contraseña sean correctos
- Si olvidó su contraseña, contactar al administrador

### No veo los datos actualizados
- Hacer clic en el botón **"Actualizar"** o esperar la actualización automática
- Verificar su conexión a internet

### No puedo editar la configuración
- Solo los administradores pueden editar la configuración
- Si es administrador y no puede editar, verifique su sesión

### Error al crear un usuario
- Verificar que todos los campos estén completos
- La contraseña debe tener al menos 6 caracteres
- El email no debe estar ya registrado
- Solo administradores pueden crear usuarios de staff

---

## 📞 Soporte

Para soporte técnico, contactar a:
- **Email:** info@globatech.com
- **Teléfono:** +57 300 123 4567

---

## 📄 Licencia

© 2024 Globatech S.A.S. - Sistema SIREST v2.0
Todos los derechos reservados.

---

**¡Gracias por usar SIREST!** 🎉
