# 📘 Documentación Técnica - FinanzasPro

Esta documentación detalla el funcionamiento interno de la aplicación y la arquitectura de la API.

## 1. Arquitectura de Datos (Oracle ORDS)

La comunicación se realiza mediante una API RESTful expuesta por ORDS. El módulo principal es `api_finanzas` con la ruta base `/api/`.

### Endpoints Principales:

| Método | Endpoint | Descripción | Parámetros |
| :--- | :--- | :--- | :--- |
| **POST** | `/usuarios/registro` | Sincroniza el usuario de Supabase con Oracle | `{uid, email}` |
| **GET** | `/usuarios/:uid/movimientos` | Obtiene el historial del usuario | `uid` (Supabase ID) |
| **POST** | `/movimientos` | Crea un nuevo registro | `{uid, categoria_id, monto, descripcion}` |
| **PUT** | `/movimientos/:id` | Actualiza un movimiento existente | `id` (Oracle ID), `{categoria_id, monto, descripcion}` |
| **DELETE**| `/movimientos/:id` | Elimina un movimiento | `id` (Oracle ID) |

## 2. Implementación de Zoneless en Angular 19

Esta aplicación funciona **sin Zone.js**, lo que mejora el rendimiento al eliminar la sobrecarga de detección de cambios global.

### Configuración:
*   `app.config.ts`: Se utiliza `provideExperimentalZonelessChangeDetection()`.
*   `angular.json`: Se ha eliminado `"zone.js"` de la sección de `polyfills`.
*   **Reactividad**: Se utilizan exclusivamente **Angular Signals** (`signal`, `computed`, `effect`) para manejar el estado de las transacciones y los cálculos financieros.

## 3. Flujo de Autenticación

1.  **Supabase Auth**: Maneja el registro y login (JWT).
2.  **Sincronización**: Al detectar el evento `SIGNED_IN`, el `AuthService` llama al endpoint de registro en Oracle para asegurar que el usuario exista en la tabla local de `USUARIOS`.
3.  **Persistencia**: El UID de Supabase se utiliza como llave foránea lógica para todas las consultas de movimientos.

## 4. Estilos y Diseño

*   **Variables CSS**: Centralizadas en `styles.css` para colores de marca (Cyan, Navy, Emerald).
*   **Responsividad**: Se utiliza una combinación de Flexbox y Grid de Bootstrap 5 con media queries personalizadas para la barra de navegación inferior.

## 5. Mantenimiento de la Base de Datos

Para resetear o actualizar la API, se debe re-ejecutar el bloque `BEGIN ... END;` del archivo `FINANZAS.sql`. Los handlers de ORDS son dinámicos y se actualizan inmediatamente al ejecutar el script en SQL Developer.
