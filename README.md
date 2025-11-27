# Book Review App 
## 1. Live Deployment 
La aplicación está desplegada y funcional en Railway:
**URL en Vivo:** https://bookreviewapp-production.up.railway.app/login
## 2. Tecnologías Usadas 
* **Frontend:** Next.js 15 (App Router), React, Tailwind CSS (con `clsx`).
* **Backend:** Next.js API Routes & Server Actions.
* **Base de Datos:** PostgreSQL.
* **ORM:** Prisma.
* **Autenticación:** JWT (librería `jose`), Cookies HttpOnly, bcryptjs.
* **Gestor de Paquetes:** Yarn.

## 3. Descripción del campo "Mood" 
Para el campo `mood` (estado de ánimo), implementé un **"Selector de Atmósfera"** en lugar de un campo de texto libre.

**Decisión de Diseño:**
Se definieron 5 categorías emocionales con una paleta de colores específica para mejorar la Experiencia de Usuario (UX):
* **Alucinante:** Tema Morado.
*  **Relajante:** Tema Naranja/Ámbar.
*  **Emotivo:** Tema Azul.
*  **Intelectual:** Tema Verde azulado (Teal).
*  **Inspirador:** Tema Amarillo/Dorado.

**Implementación Técnica:**
Cada tarjeta de reseña renderiza dinámicamente un degradado de fondo y un badge de color basado en la elección del usuario, facilitando la identificación visual del "vibe" del libro.

## 4. Instrucciones de Instalación (Setup) 

### A. Ejecución Local (Local Environment)
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/s0cr4mqwerty/book_review_app.git
   cd book-review-app
   ```
2. **Instalar dependencias:**
   ```bash
   yarn install
   ```
4. **Configurar variables de entorno** Crea un archivo .env en la raíz (puedes guiarte del archivo .env.example incluido ) con el siguiente formato:
   ```bash
    DATABASE_URL="postgresql://usuario:password@localhost:5432/mydb?schema=public"
    JWT_SECRET="tu_clave_secreta_local"
   ```
6. **Ejecutar las migracioes de prisma**
   ```bash
   yarn prisma migrate dev
   ```
8. **Correr el servidor**
   ```bash
   yarn dev
   ```
### B. Producción (Railway)
1. Conectar el repositorio de GitHub a Railway.
2. Agregar el plugin de PostgreSQL.
3. Definir las variables de entorno en Railway (DATABASE_URL, JWT_SECRET).
4. Railway ejecutará automáticamente prisma generate gracias al script postinstall configurado en package.json.
5. Ejecutar migraciones en producción (desde terminal local conectada a la DB remota):
    ```bash
      yarn prisma migrate deploy
    ```
## 5. Bugs Conocidos y Trade-offs (Decisiones Técnicas)

- Arquitectura Híbrida (API Routes + Server Actions): Aunque Next.js promueve el uso de Server Actions, se implementaron API Routes RESTful estándar (ej: DELETE /api/reviews/:id) para cumplir estrictamente con los requisitos de la prueba técnica que solicitaban endpoints específicos. Se combinaron con Server Actions para utilidades de sesión (getMyUserId) para mantener el código limpio.

- Compatibilidad Next.js 15: Se manejó el cambio en los params de las rutas dinámicas (ahora son Promesas asíncronas) para asegurar el funcionamiento correcto de los endpoints DELETE y PUT.

- Validaciones: La validación de coincidencia de contraseñas se realiza en el cliente (Frontend) para una mejor UX inmediata, mientras que la validación de unicidad de email se asegura en el Backend/Base de datos.

## 6. Tiempo Estimado

**Tiempo total invertido: ~6 horas.**
- Configuración y Base de Datos: 1 hora.
- Autenticación (Back & Front): 2 horas.
- CRUD de Reseñas y Lógica: 2 horas.
- Estilizado (UI/UX) y Despliegue: 1 hora.

## 7. Bonus

#### Uso de Prisma ORM
Para este proyecto opté por utilizar **Prisma** en lugar de SQL puro u otros ORMs por tres razones clave que optimizan el desarrollo Fullstack con TypeScript:

1.  **Seguridad de Tipos (Type Safety):** Prisma genera automáticamente tipos de TypeScript basados en el esquema de la base de datos (`schema.prisma`). Esto permite que el autocompletado del editor prevenga errores, asegurando que si llamo a `review.user.name`, TypeScript garantice que el campo existe.
2.  **Productividad:** Definir las relaciones (como `user` <-> `reviews`) en el archivo `schema` es declarativo y visual, lo que acelera la configuración inicial requerida en el punto 4 del test .
3.  **Seguridad:** Prisma escapa las consultas por defecto, protegiendo la aplicación contra inyecciones SQL sin necesidad de sanitización manual.

### Patrón Singleton para Prisma Client (`src/lib/prisma.ts`)
Implementé el patrón **Singleton** para instanciar el `PrismaClient`.

**El Problema Técnico:**
Next.js utiliza *Hot Module Replacement (HMR)* en el entorno de desarrollo. Esto significa que cada vez que guardo un archivo, el servidor se "recarga". Si instanciara `new PrismaClient()` directamente en cada archivo API, cada recarga crearía una nueva conexión a la base de datos sin cerrar las anteriores.
Esto agotaría rápidamente el *pool* de conexiones de PostgreSQL en Railway, causando el error fatal: `Too many connections`.

**La Solución:**
Utilizando el objeto global `globalThis`, guardo una única instancia del cliente de Prisma. El código verifica si ya existe una instancia activa antes de crear una nueva:

```typescript
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
