# ZONAFIT - Landing Page para Gimnasio

Landing page moderna y responsiva para un gimnasio, construida con **React 19**, **Vite** y **Tailwind CSS 3**, con backend en **Supabase**.

## Características

- Diseño oscuro premium con animaciones CSS nativas
- Panel de administración con permisos granulares (admin / secretaria + permisos individuales)
- 8 secciones dinámicas: Beneficios, Servicios, Planes, Testimonios, Coaches, Equipo, Eventos, Noticias
- Galería con subida drag & drop y layout masonry
- Autenticación por email/password
- Roles y permisos: cada sección controlable individualmente
- Gestión de usuarios: crear, deshabilitar, asignar permisos
- Chatbot flotante con integración a WhatsApp
- Dashboard con métricas en tiempo real
- Animaciones fade-in-up con CSS @keyframes (carga inmediata, sin dependencia de scroll)

## Tecnologías

- React 19 + Vite
- Tailwind CSS 3
- Supabase (Auth, Database, Storage, Edge Functions)
- MVC Architecture

## Estructura del proyecto

```
src/
├── components/       # Vistas (componentes públicos y Admin)
├── controllers/      # Hooks de estado y lógica de negocio
├── models/           # Consultas a Supabase (CRUD)
├── context/          # AuthContext con useAuth
├── App.jsx           # Punto de entrada con navegación
└── index.css         # Tailwind + animaciones globales
```

## Permisos disponibles

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

El rol **admin** tiene todos los permisos automáticamente.

## Credenciales de prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@zonafit.com | Admin123! |
| Secretaria | secretaria@zonafit.com | Secret123! |
