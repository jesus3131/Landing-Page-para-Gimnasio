# ZONAFIT - Landing Page para Gimnasio

Landing page moderna y responsiva para **ZONAFIT**, un gimnasio ubicado en **Montería, Córdoba, Colombia**. Construida con **React 19**, **Vite** y **Tailwind CSS 3**, con backend en **Supabase**.

## 🚀 Demo en vivo

| Proyecto | URL |
|----------|-----|
| Producción principal | [zonafit-lovat.vercel.app](https://zonafit-lovat.vercel.app) |
| Producción alternativa | [landing-page-para-gimnasio.vercel.app](https://landing-page-para-gimnasio.vercel.app) |

## ✨ Características

- **Diseño oscuro premium** con animaciones CSS nativas
- **10 secciones dinámicas**: Hero, Beneficios, Servicios, Planes, Coaches, Testimonios, Equipo, Eventos, Noticias, Galería
- **Panel de administración** con permisos granulares (admin, secretaria + 10 permisos individuales)
- **Precios en pesos colombianos (COP)** con formato de miles
- **Ubicación local**: Cra. 6 #58-12, Montería, Córdoba, Colombia
- **WhatsApp** integrado con número colombiano +57
- **Chatbot** flotante con respuestas automáticas
- **Galería** con subida drag & drop y layout masonry
- **Autenticación** por email/password
- **Gestión de usuarios**: crear, deshabilitar, asignar permisos
- **Dashboard** con métricas en tiempo real
- **Animaciones fade-in-up** con CSS @keyframes (carga inmediata)
- **Cierre de sesión** con redirección automática a la página principal
- **Responsive** adaptado a todos los dispositivos

## 🛠 Tecnologías

| Tecnología | Versión |
|------------|---------|
| React | 19 |
| Vite | 6+ |
| Tailwind CSS | 3 |
| Supabase (Auth, Database, Storage, Edge Functions) | 2.107+ |
| Node.js | 25 |
| Vercel | Deploy automático |

## 📁 Estructura del proyecto

```
src/
├── components/          # Vistas (componentes públicos y Admin)
│   ├── Admin.jsx        # Panel de administración (dashboard + 10 tabs)
│   ├── Hero.jsx         # Hero con estadísticas
│   ├── Benefits.jsx     # Beneficios
│   ├── Services.jsx     # Servicios
│   ├── Plans.jsx        # Planes con precios COP
│   ├── Coaches.jsx      # Coaches
│   ├── Testimonials.jsx # Testimonios
│   ├── Team.jsx         # Equipo
│   ├── Events.jsx       # Eventos
│   ├── News.jsx         # Noticias
│   ├── Gallery.jsx      # Galería con masonry
│   ├── Contact.jsx      # Contacto con ubicación Montería
│   ├── Navbar.jsx       # Navegación
│   ├── Footer.jsx       # Footer
│   ├── Chatbot.jsx      # Chatbot con WhatsApp
│   ├── WhatsApp.jsx     # Botón flotante WhatsApp
│   ├── Login.jsx        # Inicio de sesión
│   └── ScrollReveal.jsx # Animaciones (fallback reduced motion)
├── controllers/         # Hooks de estado (16 hooks)
│   ├── useAuth.js       # Autenticación + permisos
│   ├── useAdmin*.js     # 9 hooks para admin CRUD
│   ├── useBenefits.js   # Datos públicos con fallback
│   ├── useServices.js   # Datos públicos con fallback
│   ├── usePlans.js      # Planes con precios COP
│   └── ...
├── models/              # Consultas a Supabase (10 modelos)
│   ├── auth.model.js    # Auth (signIn, signOut, etc.)
│   ├── profile.model.js # Perfiles, permisos, Edge Function
│   ├── benefits.model.js
│   ├── services.model.js
│   ├── plans.model.js
│   ├── gallery.model.js
│   ├── testimonials.model.js
│   ├── coaches.model.js
│   ├── team.model.js
│   ├── events.model.js
│   └── news.model.js
├── context/             # AuthContext con useAuth
├── lib/                 # Cliente Supabase
├── App.jsx              # Punto de entrada con navegación
└── index.css            # Tailwind + animaciones globales

supabase/
├── migrations/          # Migraciones SQL
└── seed/                # Datos de prueba

vercel.json              # Configuración de deploy
```

## 💰 Planes y precios

| Plan | Precio (COP) | Características destacadas |
|------|-------------|---------------------------|
| Básico | **$79.000/mes** | Acceso gym 6am-10pm, 5 clases grupales |
| Profesional | **$129.000/mes** | Clases ilimitadas, piscina & spa |
| Premium | **$199.000/mes** | 24/7, entrenador personal, nutrición |

## 📍 Ubicación

**ZONAFIT** está ubicado en:
> **Cra. 6 #58-12, Montería, Córdoba, Colombia**

## 🔐 Permisos disponibles

El panel de administración cuenta con un sistema de **permisos granulares**:

| Permiso | Descripción |
|---------|-------------|
| `admin.access` | Acceso al panel de administración |
| `messages.manage` | Gestión de mensajes de contacto |
| `benefits.manage` | Gestión de beneficios |
| `services.manage` | Gestión de servicios |
| `coaches.manage` | Gestión de coaches |
| `team.manage` | Gestión del equipo |
| `events.manage` | Gestión de eventos |
| `news.manage` | Gestión de noticias |
| `gallery.manage` | Gestión de galería |
| `users.manage` | Gestión de usuarios |

El rol **admin** tiene todos los permisos automáticamente. Los usuarios no-admin pueden recibir permisos individuales desde el panel de administración.

## 👤 Credenciales de prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@zonafit.com | Admin123! |
| Secretaria | secretaria@zonafit.com | Secret123! |

## 🚀 Deploy

El proyecto está desplegado en **Vercel** con integración continua desde GitHub. Cada `push` a `main` redeploya automáticamente.

### Deploy manual
```bash
vercel --prod
```

### Variables de entorno requeridas
```
VITE_SUPABASE_URL=https://tyfzggtxbbtgxocwajkb.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_JHHRtDyKzKWpJBr7g7NI5g_BH1z0QPU
```

## 🗄 Base de datos (Supabase)

### Tablas principales
- `benefits` — Beneficios del gimnasio
- `services` — Servicios ofrecidos
- `plans` — Planes de membresía (con `currency = 'COP'`)
- `plan_features` — Características de cada plan
- `testimonials` — Testimonios de miembros
- `gallery` — Imágenes de la galería
- `contact_messages` — Mensajes del formulario de contacto
- `newsletter_subscribers` — Suscriptores del newsletter
- `profiles` — Perfiles de usuario (con `role` y `disabled`)
- `user_permissions` — Permisos individuales por usuario
- `coaches` — Entrenadores
- `team` — Equipo de trabajo
- `events` — Eventos del gimnasio
- `news` — Noticias

### Edge Functions
- `manage-users` — Creación de usuarios auth con `service_role`

## 📦 Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/jesus3131/Landing-Page-para-Gimnasio.git

# Entrar al directorio
cd "Landing Page para Gimnasio ZonaFit"

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 📄 Licencia

Todos los derechos reservados © ZONAFIT
