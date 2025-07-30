Aquí tienes un resumen de los endpoints, su seguridad y sugerencias para la gestión de roles:

### Listado y Categorización de Endpoints

**Módulo de Ejemplo (Pruebas)**
*   `GET /api/v1/example`: Obtiene un ejemplo.

**Módulo de Cuentas (Autenticación y Registro)**
*   `POST /account/login`: Inicio de sesión.
*   `POST /account/register/client`: Registro de un nuevo cliente.
*   `POST /account/register/business`: Registro de una nueva empresa.
*   `GET /account/email/:email`: Obtiene detalles de la cuenta por email.
*   `GET /account/:id`: Obtiene detalles de la cuenta por ID.

**Módulo de Empresas (Business)**
*   `GET /business`: Obtiene una lista de empresas.
*   `GET /business/categories`: Obtiene todas las categorías de empresas.
*   `GET /business/:id`: Obtiene una empresa por su ID.
*   `PUT /business/:id`: Actualiza el perfil de una empresa.
*   `PUT /business/:id/categories`: Actualiza las categorías de una empresa.

**Módulo de Tarjetas (Card)**
*   `GET /card`: Obtiene una lista de todas las tarjetas.
*   `GET /card/states`: Obtiene todos los estados posibles de una tarjeta.
*   `GET /card/business/:id`: Obtiene todas las tarjetas de una empresa específica.
*   `POST /card`: Crea una nueva tarjeta.

**Módulo de Tarjetas de Cliente (ClientCard)**
*   `POST /client-card`: Asigna una tarjeta a un cliente.
*   `GET /client-card/client`: Obtiene todas las tarjetas de un cliente.
*   `GET /client-card/business`: Obtiene todas las tarjetas de cliente de una empresa.
*   `GET /client-card/:id`: Obtiene una tarjeta de cliente por su ID.
*   `GET /client-card/unique-code/:uniqueCode`: Obtiene una tarjeta de cliente por su código único.
*   `POST /client-card/activate/:uniqueCode`: Activa la tarjeta de un cliente.
*   `POST /client-card/add-stamp/:uniqueCode`: Añade un sello a la tarjeta de un cliente.
*   `POST /client-card/mark-as-redeemed/:uniqueCode`: Marca una tarjeta de cliente como canjeada.

### Seguridad Utilizada

La seguridad principal se implementa a través del middleware `authenticateToken`. Este middleware se aplica a casi todos los endpoints, excepto a los de registro e inicio de sesión, lo que significa que **la mayoría de las rutas requieren un token de autenticación válido**.

### Sugerencias de Comprobaciones de Seguridad por Roles

Aquí te doy algunas sugerencias para implementar la seguridad de acceso por roles (owner vs. collaborator) en tus endpoints:

**Reglas Generales:**

*   **Owner:** Tiene control total sobre los recursos de su empresa. Puede crear, leer, actualizar y eliminar (CRUD) cualquier dato relacionado con su negocio.
*   **Collaborator:** Tiene permisos más restringidos. Generalmente puede realizar acciones operativas, pero no puede modificar la configuración crítica del negocio ni eliminar recursos importantes.

**Sugerencias por Módulo:**

**Módulo de Empresas (Business)**
*   `PUT /business/:id`:
    *   **Owner:** Permitido.
    *   **Collaborator:** **No permitido.** Solo el dueño debería poder modificar los datos principales de la empresa.
*   `PUT /business/:id/categories`:
    *   **Owner:** Permitido.
    *   **Collaborator:** **No permitido.** La categorización del negocio es una decisión estratégica que debería recaer en el dueño.

**Módulo de Tarjetas (Card)**
*   `POST /card`:
    *   **Owner:** Permitido.
    *   **Collaborator:** **No permitido.** La creación de nuevas tarjetas (nuevas "ofertas") debería ser una acción exclusiva del dueño.
*   `GET /card/business/:id`:
    *   **Owner:** Permitido.
    *   **Collaborator:** Permitido. Ambos roles necesitan poder ver las tarjetas que ofrece la empresa.

**Módulo de Tarjetas de Cliente (ClientCard)**
*   `POST /client-card/add-stamp/:uniqueCode`:
    *   **Owner:** Permitido.
    *   **Collaborator:** Permitido. Esta es una acción operativa del día a día.
*   `POST /client-card/mark-as-redeemed/:uniqueCode`:
    *   **Owner:** Permitido.
    *   **Collaborator:** Permitido. Similar a añadir un sello, es una acción operativa.
*   `GET /client-card/business`:
    *   **Owner:** Permitido.
    *   **Collaborator:** Permitido. Ambos roles necesitan poder ver el estado de las tarjetas de los clientes.

**Implementación:**

Para implementar esto, te sugiero crear un nuevo middleware que se ejecute *después* de `authenticateToken`. Este middleware se encargaría de:

1.  Obtener el rol del usuario a partir del token decodificado.
2.  Comprobar si el rol del usuario tiene permiso para acceder al recurso solicitado.
3.  Si no tiene permiso, devolver un error de "Acceso denegado" (403 Forbidden).

Espero que este análisis te sea de gran ayuda para mejorar la seguridad de tu aplicación. ¡No dudes en consultarme si tienes más preguntas!