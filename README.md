#Node.js API

El objetivo es crear un **API** en _Node.js_ a partir de una estructura definida.


La estructura general de un proyecto que aproveche este desarrollo es la siguiente:

project (dir)

 * config.js

 * app (dir)

    * models (dir)
    * controllers (dir)
    * helpers (dir)
    * services (dir)
    * tasks (dir)
    * config.js
    * content.js
    * errors.js
    * values.js 


El API resultante posee los siguientes elementos de importancia:

**config (server)**
Configuración de ejecución del servidor.

**config (app)**
Configuración de ejecución del API y sus componentes.

**content**
Catálogo de elementos activos de la API (roles, models, controllers, helpers, services, tasks).

**models**
Modelos de datos que representan a objetos dentro de la aplicación.

**controllers**
Controladores para operar sobre los modelos.

**helpers**
Funciones de apoyo para realizar tareas específicas.

**services**
Servicios web expuestos al usuario de la API.

**tasks**
Procesos que se ejecutan en background.

**errors**
Catálogo de errores específicos de la aplicación.

**values**
Catálogo de valores y constantes específicos de la aplicación.

