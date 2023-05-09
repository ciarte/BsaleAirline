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
