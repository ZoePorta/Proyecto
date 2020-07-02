# Proyecto de Zoe Porta

Repositorio del proyecto final de Zoe Porta para el bootcamp de Hack a Boss.

## Configurar backend

### Archivo .env

Será necesario configurar el archivo .env que se encuentra dentro de la carpeta _back_:

- Para que funcione el envío de e-mails, se debe añadir una key y un sender de SendGrid.
- Se puede modificar la información de acceso a la base de datos. Actualmente está configurada para que funcione con el backup que se encuentra en la carpeta _sql_.

### Base de datos

Hay dos opciones, utilizar el backup que se incluye o generar las tablas y datos aleatorios automáticamente.

##### Generar tablas

Para generar las tablas, en lugar de usar el backup, será necesario tener creados previamente una base de datos y un usuario, y configurar el archivo .env según esos datos.

Hecho, esto, ejecutar el archivo initDB:

- Para generar las tablas vacías:

```
node initDB
```

- Para generar las tablas con datos aleatorios:

```
node initDB --data
```

### Correr el servidor local

En la carpeta _back_ ejecutar:

```
npm start
```

## Correr servidor local de frontend

En la carpeta _front_ ejecutar:

```
npm run serve
```
