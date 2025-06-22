# Acumulapp API Express - TypeSript - Prisma

Proyecto de API REST, con base robusta y escalable. Diseñada con principios de organización modular para facilitar mantenimiento y expansión

## Características

- **TypeSript**: Tipado estático para mayor seguridad y productividad
- **Express.js**: Frameword web minimalista y flexible para Node.js
- **Arquitectura Modular**: Separación clara de responsabilidades por carpetar
- **Versionado de API**: Estructura preparada para mejorar diferentes vesionde de la API (ej: `/api/v1` )
- **Manejo Asíncrono Simplificado**: Utilidad `asyncHandler` para evitar `try-catch` repetitivos en controladores
- **Configuración Centralizada**: Archivos dedicados para gestionar la configuración de la aplicación

## Prerrequisitos

- Node.js (v16 o superior)
- npm(o yarm, bun)

## Instalación

1. Clona este repositorio
2. Navega a la carpeta reiz del proyecto
3. Instala las dependencias

```sh
npm install
```

## Configuración

1. Crea un archivo `.env` en la raiz del proyecto. Puedes copiar el contenido de `.env.example` como punto de partida:

```sh
cp .env.example .env
```

2. Modifica el archivo `.env` con tus propias configuraciones(puerto, variables de entorno para la base de datos).

- `PORT`: Puerto en el que se ejecutará el servidor(por defecto 3000).
- `NODE_ENV`: Ambiente de ejecución( development, production, test).

3. Las configuraciones cargadas desde `.env` están disponibles de forma tipada a través del objeto `enviroment` exportado desde `src/config/api/enviroment.ts`.

## Ejecución de la Aplicación

### Modo Desarrollo

Ejecuta el servidor en modo desarrollo con recarga automática ante cambios en los archivos `.ts`:

```sh
npm run dev
```

### Modo producción

1. **Compilar**: Transpila el código TypeScript a JavaScript en la carpeta `dist/` :

```sh
npm run build
```

2. **Iniciar**: Ejecuta la aplicación compilada desde la carpeta `dist/`

```sh
npm run start
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo con `nodemon` y `ts-node`.
- `npm run build`: Compila el proyecto TypeScript a JavaScript (en `dist/`).
- `npm run start`: Ejecuta la aplicación compilada desde `dist/` (requiere `npm run build` previo).
- `npm test`: (Pendiente de implementar) Ejecuta las pruebas unitarias/integración

## Estructura del Proyecto

```sh
.
├── bun.lock  # Metadados para dependencias con bun
├── Dockerfile # Construccion de imagen con docker
├── package.json # Metadatos y dependencias del proyecto
├── prisma/ # Archivos del ORM Prisma
│   └── schema.prisma # Definición del esquema de base de datos para prisma
├── src/ # Codigo fuente de typeScript
│   ├── app.ts # Creación y configuración de la instación de Express
│   ├── server.ts # Punto de entrada, ininia el servidor HTTP
│   ├── types/ # Tipados globales de ts
│   ├── utils/ # Funciones de utilidad generales y reutilizables
│   ├── api/ # Definición de rutas y contraladores por versión de API
│   │   └── v1/ # Versión 1 de la API
│   │       ├── controllers/ # Controladores especificos de la API (capa HTTP)
│   │       └── routes/ # Definición de rutas de Express
│   ├── config/ # Gestión de configuración y variables de entorno
│   ├── core/ # Clases base, errores personalizados, lógica transversal
│   │   ├── errors/
│   │   └── utils/ # Utilidades especificas del core (ej: asyncHandler)
│   ├── middelwares/ # Middlewares personalizados de Express
│   └── modules/ # Logica de Negocio principal
│       └── account/
│           ├── Account.controller.ts
│           ├── Account.model.ts
│           ├── Account.repository.ts
│           ├── Account.router.ts
│           ├── Account.service.ts
│           └── DTO/
│               ├── Request/
│               │   └── index.ts
│               └── Response/
│                   └── index.ts
└── tsconfig.json # Configuración del compilador TypeScript
```
