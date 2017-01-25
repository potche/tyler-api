
# API de evaluaciones "Tyler" #

El motor de evaluaciones que será utilizado por usuarios de las diversas aplicaciones de UNOi que estén registradas para uso de este sistema, quienes podrán gestionar evaluaciones de acuerdo a las necesidades de medición de desempeño y reglas de negocio de cada plataforma, es un producto de software que permitirá gestionar la creación, consulta, modificación e inactivación de evaluaciones empleadas por los diversos componentes de UNO Internacional por medio de una API, de modo que cualquier aplicación que haga uso de evaluaciones tenga la flexibilidad requerida para consumirlas, crearlas y modificarlas, así como poder obtener información de evaluaciones útil para la presentación de estadísticas.

Las características básicas con las que este producto debe contar son:
 
* La información sobre evaluaciones nuevas, o existentes debe ser recibida o entregada a través de la API del Motor de Evaluaciones.
* Las Evaluaciones pueden tener un periodo de tiempo para que sean contestadas.
* Cada evaluación puede ser generada a partir de un banco de preguntas, de forma aleatoria o definida por el usuario.
* Se registrara el tiempo de inicio, fin y duración en que se contesta de la evaluación a través de trazas de TinCan que deben almacenarse en un LRS.
* Cada reactivo puede tener un tipo distinto de opciones de respuesta y debe tener al menos una opción para responder.
* Un conjunto de reactivos pueden estar agrupadas en una sección
* Se puede crear una evaluación a partir de una existente (clonar).
* La evaluación puede ser editada únicamente hasta finalizar su periodo de aplicación o cuando esté recién creada (sandbox).
* Se guardará el resultado o la calificación por persona cuando aplique tener una calificación en la evaluación.
* El motor de evaluaciones debe contar con un panel de administración donde se puedan gestionar las aplicaciones que harán uso de éste, así como gestionar nuevas características del motor tales como los tipos de reactivos que se pueden utilizar, así como visualizar estadísticas de tipos de reactivos y de las evaluaciones en general.

### Requisitos de instalación ###

* **Node.js** v.4.0^
* **MongoDB** v.3.0^
* **PM2** v.1.0^
* Diversas dependencias (ver Package.json)

### Instalación ###

1. Clonar repositorio en directorio local
1. Ejecutar npm install
1. Para correr pruebas, ejecutar npm run coverage
1. Ejecutar pm2 start