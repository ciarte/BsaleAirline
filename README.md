# Airline - Bsale 	:airplane:

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

Luego en el archivo db.js, deberas comentar/descomentar el codigo de acuerdo a si sera en local o remota la base de datos.
Crear un archivo .env con las siguientes consideraciones
```

PORT = '3000'
HOST = 'mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com'
USER = 'bsale_test'
PASSWORD = 'bsale_test'
DATABASE = 'airline'

PORT_LOCAL = "puerto_configurado_de_MYSQL"
HOST_LOCAL = "localhost"
USER_LOCAL = "tu_usuario"
PASSWORD_LOCAL = "tu_contrasena"
DATABASE_LOCAL = "airline"
```

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

Para modularizar el codigo, las llamadas a la DB se hacen desde la carpeta services, y en la carpeta controllers tendremos la logica del codigo, la carpeta V1 sera para las versiones.
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
El reto consistio en desarrollar un algoritmo que ubique en el avion a los pasajeros menores de edad con al menos uno de sus acompa;antes en el asiento de al lado, de la misma columna, sin espacio en medio (ya sea pasillo u otro pasajero). :seat::seat:
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
Para resolver esta problematica, primero se dividio la lista de los pasajeros para obtener un Array de pares clave-valor, donde la clave representa el 'purchase_id' y cada valor es un objeto que contiene dos Arrays, uno para menores de edad(<18) y otro para adultos, y por otro lado un Array con lista de asientos disponibles

Ya que la condicion critica es sentar a los menores con sus respectivos adultos, lo primero que buscamos es un asiento disponible para los menores segun el 'seat_type_id' que posean, de la lista de asientos encontrados se le asigna el primer asiento mediante su ID, se elimina dicho asiento de la lista de asientos y al adulto que coincida con su 'purchase_id' se le asigna el asiento de la fila siguiente pero de la misma columna

```
 ...
  let availableSeatsForMinor = availableSeat.filter(
         (seat) => seat.seat_type_id === seatType
       );
  if (availableSeatsForMinor.length === 0) continue;
        let seatForMinor = availableSeatsForMinor[0];
        minor.seat_id = seatForMinor.seat_id;
        availableSeat.splice(availableSeat.indexOf(seatForMinor), 1);
  ...
  ```
Luego se obtiene el codigo ASCII de la letra de la columna del asiento del menor, se le suma 1 y se convierte en el siguiente caracter con la funcion 'String.fromCharCode()', que devuelve una cadena creada a partir de la secuencia de valores Unicode especificados.
```
...
  let seatRow = seatForMinor.seat_row;
        let nextSeatColumn = String.fromCharCode(
          seatForMinor.seat_column.charCodeAt() + 1
        );
        let availableSeatForAdult = availableSeat.find(
          (seat) =>
            seat.seat_row === seatRow && seat.seat_column === nextSeatColumn
        );
   ....
 ```
Se van a buscar el resto de asientos para los pasajeros adultos, ubicandolos en asientos mas cercanos ya sea por filas o columnas, se va eliminando el asiento de la lista de asientos disponibles y se elimina al menor y al adulto de sus respectivos arreglos de pasajeros.

Despues de esa asignacion de asientos a todos los menores y uno de sus adultos, se va a asignar los asientos a los pasajeros restantes que aun no tengan asignado uno, de manera que se trata de sentar a los adultos con igual 'purchase_id' en asientos cercanos.

Y por ultimo se da formato indicado en las condiciones del ejercicio a los pasajeros, con los datos solicitados y ordenandolo por 'purchase_id'.
 ```
 ...
    resultFlights.passengers = boardingPass
      .map(
        (d) =>
          (d = {
            passengerId: d.passenger_id,
            dni: d.dni,
            name: d.name,
            age: d.age,
            country: d.country,
            boardingPassId: d.boarding_pass_id,
            purchaseId: d.purchase_id,
            seatTypeId: d.seat_type_id,
            seatId: d.seat_id,
          })
      )
      .sort(sortFunc);
      ...
 ```

## Despliegue 📦

Realizado en Railway, donde el endpoibt valido es:
[Mi Endpoint](https://bsaleairline-production.up.railway.app/flights/1/passengers)

ID, debe ser un numero. (tiene como valor por defecto el id: 1)

## Construido con 🛠️

JavaScript como lenguaje de programacion.
Node.js con Express como entorno de trabajo.
MYSQL como base de datos suministrada.

## Autores ✒️

* **Gabriel Iciarte** - *Trabajo Back-end* - [Gabriel Iciarte](https://www.linkedin.com/in/gabriel-iciarte/)
* **Bsale** - *DATA BASE solo lectura* 


## Expresiones de Gratitud 🎁

<!-- * Comenta a otros sobre este proyecto u otro de mi repositorio que te interese 📢
* Invita una cerveza 🍺 o un café ☕ a alguien del equipo.  -->
* Pido Feedback sobre el codigo y observaciones para mejorarlo :man_teacher: 



---
⌨️ con ❤️ por [Gabriel Iciarte](https://github.com/ciarte) 😊
