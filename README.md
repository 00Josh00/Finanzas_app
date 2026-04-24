# 🏦 FinanzasPro - Personal Finance App

¡Bienvenido a **FinanzasPro**! Una aplicación de gestión de finanzas personales moderna, rápida y 100% responsiva, diseñada para ofrecer un control total sobre tus ingresos y gastos con una experiencia de usuario de nivel premium.

![App Icon](file:///C:/Users/Joseph/.gemini/antigravity/brain/62cdaf81-89d1-4f77-843a-31c9e4ca460f/app_icon_finanzas_pro_1776994051790.png)

## 🚀 Tecnologías Utilizadas

Este proyecto utiliza un stack tecnológico de última generación para garantizar el máximo rendimiento:

*   **Frontend**: Angular 19 (Standalone Components).
    *   **Zoneless Change Detection**: Optimización extrema de rendimiento eliminando Zone.js.
    *   **Angular Signals**: Estado reactivo y eficiente.
*   **Estilos**: Bootstrap 5 + Tailwind CSS + Custom CSS (Sistema de diseño "FinanzasPro").
*   **Backend**: Oracle Database con **ORDS** (Oracle REST Data Services).
*   **Autenticación**: Supabase Auth (Email/Password).
*   **Gráficos**: Chart.js (Visualización dinámica de gastos).

---

## ✨ Características Principales

*   **Dashboard Inteligente**: Visualización de saldo total, ingresos y gastos en tiempo real.
*   **Gráfico de Gastos**: Análisis visual por categorías mediante un gráfico de dona.
*   **CRUD Completo**:
    *   **Crear**: Registro rápido de movimientos.
    *   **Leer**: Historial de transacciones sincronizado con el usuario.
    *   **Editar**: Modal de edición rápida para corregir montos o categorías.
    *   **Borrar**: Eliminación con confirmación de seguridad.
*   **Mobile-First (PWA Ready)**: Diseño optimizado para celulares con barra de navegación inferior y botones táctiles (FAB).
*   **Sincronización Automática**: El UID de Supabase se vincula automáticamente con el esquema de Oracle al iniciar sesión.

---

## 🛠️ Configuración e Instalación

### 1. Requisitos Previos
*   Node.js (v18+)
*   Angular CLI (`npm install -g @angular/cli`)
*   Acceso a una instancia de Oracle Database (OCI o Local).

### 2. Base de Datos (Oracle)
Todo el esquema se encuentra en el archivo `FINANZAS.sql`. Debes ejecutarlo en tu consola de Oracle para crear:
*   Tablas de Usuarios, Categorías y Transacciones.
*   Módulos y Handlers de ORDS (REST API).

### 3. Frontend (Angular)
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve -o
```

---

## 📂 Estructura del Proyecto

*   `src/app/auth`: Gestión de sesiones y guardianes de ruta.
*   `src/app/services`: Lógica de comunicación con Oracle ORDS.
*   `src/app/components`:
    *   `dashboard`: Panel principal con gráficos y lista.
    *   `login`: Interfaz de acceso profesional.
    *   `nueva-transaccion`: Formulario de registro.
    *   `layout/navbar`: Navegación dual (Desktop Top / Mobile Bottom).
*   `FINANZAS.sql`: Script completo de base de datos y API.

---

## 📱 Instalación en el Celular
Para usarlo como una aplicación nativa:
1. Abre la URL en tu navegador móvil.
2. Selecciona **"Compartir"** (iOS) o **"Menú"** (Android).
3. Haz clic en **"Agregar a la pantalla de inicio"**.

---

## 👤 Autor
Desarrollado con ❤️ para una gestión financiera impecable.
