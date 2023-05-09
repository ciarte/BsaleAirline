# AIRLINE - BSALE

Ejercicio de Postulacion donde se simula un Check-in automatico de los pasajerosd de una Aerolinea,
se trata de una API REST con un solo endpoint que permite coonsultar por ID de vuelo y retorna la simulacion, la cual le debe asignar los asientos a cada pasajero que aun no tenga uno asignado.

## Comenzando 🚀

Si deseas correr el proyecto en local aca esta el script para una base de datos en MYSQL https://drive.google.com/file/d/1BhiiN7poQvSpCD5Pf01_V_KtOZ7BdpWO/view?usp=sharing

Mira **Deployment** para conocer como desplegar el proyecto.


### Pre-requisitos 📋

intalar las dependencias de node.js

```
npm i
```
Tener instalado MYSQL & MYSQL Workbench
https://dev.mysql.com/downloads/

Luego en el archivo db.js, deberas comentar/descomentar el codigo de acuerdo a si sera en localhost o remota la base de datos.

### Instalación 🔧

Luego tenemos otras dependencias, que con npm i, deberia estar completo pero si presenta algun conflicto podrias revisar el package.json en caso que falte alguna aca puedes seguir los pasos

```
npm i express
npm install --save mysql2
npm install --save sequelize
```

```
npm i nodemon
npm i dotenv
```

Para realizar la consulta y la simulacion en LOCALHOST tenemos dos endpoints,
el principal donde se realiza la simulacion que se pide en la postulacion, y adicional uno para corroborar los asientos disponibles en cada avion.

## Ejecutando las pruebas ⚙️

[http://localhost:3000/flights/:id/passengers](http://localhost:3000/flights/:id/passengers) como endpoint a evaluar.

Donde el :id refiere al ID del vuelo buscado para la simulacion,
el cual retorna un objeto con la informacion completa del vuelo, incluyendo lugar de partida y destino, fecha, ID del avion y lista de pasajeros.

### Analice la peticion HTTPS y el codigo🔩

En la base de datos tenemos una tabla de pasajeros, la cual tiene algunos pasajeros con asiento asignado y otros no.

```
"code": 200,
  "data": {
    "flightId": 2,
    "takeoffDateTime": 1688491980,
    "takeoffAirport": "Aeropuerto Internacional Jorge Cháve, Perú",
    "landingDateTime": 1688495580,
    "landingAirport": "Aeropuerto Francisco Carlé, Perú",
    "airplaneId": 2,
    "passengers": [
    {},
    {},
    ...]
    }
```
El reto consistio en desarrollar un algoritmo que ubique en el avion a los pasajeros menores de edad con al menos uno de sus acompa;antes en el asiento de al lado, de la misma columna, sin espacio en medio (ya sea pasillo u otro pasajero).
otra de las consignas es que los pasajeros con mismo numero de boarding Pass, queden sentados juntos o lo mas cerca posible.

```
  "data": {
    ... 
    "passengers": [
       {
        "passengerId": 48,
        "dni": "262424652",
        "name": "Antonia",
        "age": 15,
        "country": "México",
        "boardingPassId": 19,
        "purchaseId": 59,
        "seatTypeId": 3,
        "seatId": 172
      },
      {
        "passengerId": 155,
        "dni": "776418510",
        "name": "Monserrat",
        "age": 31,
        "country": "Chile",
        "boardingPassId": 245,
        "purchaseId": 59,
        "seatTypeId": 3,
        "seatId": 192
      },
      ...]
```

## Despliegue 📦

_Agrega notas adicionales sobre como hacer deploy_

## Construido con 🛠️

JavaScript como lenguaje de programacion,
Node.js con Express como entorno de trabajo,
Sequelize.js como posible ORM,
MYSQL como base de datos suministrada,

## Versionado 📌

Usamos [SemVer](http://semver.org/) para el versionado. Para todas las versiones disponibles, mira los [tags en este repositorio](https://github.com/tu/proyecto/tags).

## Autores ✒️

_Menciona a todos aquellos que ayudaron a levantar el proyecto desde sus inicios_

* **Gabriel Iciarte** - *Trabajo Inicial* - [Gabriel Iciarte](https://www.linkedin.com/in/gabriel-iciarte/)
* **Fulanito Detal** - *Documentación* - [fulanitodetal](#fulanito-de-tal)

También puedes mirar la lista de todos los [contribuyentes](https://github.com/your/project/contributors) quíenes han participado en este proyecto. 

## Licencia 📄

Este proyecto está bajo la Licencia (Tu Licencia) - mira el archivo [LICENSE.md](LICENSE.md) para detalles

## Expresiones de Gratitud 🎁

* Comenta a otros sobre este proyecto 📢
* Invita una cerveza 🍺 o un café ☕ a alguien del equipo. 
* Da las gracias públicamente 🤓.
* Dona con cripto a esta dirección: `0xf253fc233333078436d111175e5a76a649890000`
* etc.



---
⌨️ con ❤️ por [Villanuevand](https://github.com/Villanuevand) 😊
