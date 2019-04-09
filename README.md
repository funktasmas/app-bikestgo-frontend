# App Bike Stgo Frontend
## Entorno
El proyecto realizado se encuentra ejecutado con las siguientes herramientas generales. Para mayor detalles de las librerias visualizar archivo package.json.
- Lenguajes: Javascript (ES6), HTML y CSS
- Framework: React 16.x.y

## Requisitos
- Es necesario tener instalado en el sistema operativo (windows, linux, unix) **Nodejs** en version 11.x.y o superior, [pasos para su instalación](https://nodejs.org/es/). IMPORTANTE: En el instalador de Nodejs seleccionar el paquete ***npm*** ya que es ocupado para realizar el levantamiento del proyecto frontend.
- Es obligatorio tener levantado el servidor local de la App Bike Stgo Backend. Para esto seguir las instrucciones en el [README del proyecto backend](https://github.com/funktasmas/app-bikestgo-backend).

## Levantar proyecto
Seguir las siguientes instrucciones para poder levantar el proyecto frontend.
``` javascript
// IMPORTANTE: Siempre estar dentro de la carpeta del proyecto

// 1. Instalar dependencias del proyecto. Esta paso se demora algunos minutos
npm install

// 2. Arrancar servidor local del proyecto.
npm start
// se abrira automaticamente en el navegador favorito el proyecto.
```
## Visualizaciones

### A. Pagina Inicio
El proyecto frontend es visualizado en la siguiente direccion.  
URL: [http://localhost:3000](http://localhost:3000)

## Interación Backend
El proyecto frontend interactua con el backend mediante una petición GET hacia el API de los datos de las estaciones. El endpoint de los datos se puede visualizar en la siguiente dirección:
- URL: [http://127.0.0.1:8000/api/store/stations/](http://127.0.0.1:8000/api/store/stations/). Solo esta disponible si el proyecto backend ha iniciado su servidor local.

## Screenshot
Se muestra un screenshot de la plataforma backend con datos en un periodo de una hora.

![alt text](https://i.imgur.com/6mSMXsq.png)