# sazon-integrador

## Carga de reportes de valoración

El panel de moderación solicita los datos de forma asíncrona desde `public/data/reportes-moderacion.json`. Vite sirve ese archivo bajo `${import.meta.env.BASE_URL}data/reportes-moderacion.json`; el componente comprueba el estado HTTP y el formato de la respuesta, muestra estados de carga y error, y permite reintentar si la solicitud falla.

La respuesta simulada es un arreglo de reportes con este contrato:

```json
[
  {
    "id": "REP-2408",
    "usuario": "Valentina Ríos",
    "contenido": "Comentario reportado",
    "motivo": "Lenguaje ofensivo",
    "receta": "Arepas de choclo rellenas",
    "marca": "Noel",
    "fecha": "Hoy, 10:42",
    "estado": "pendiente",
    "prioridad": true
  }
]
```

Cuando el equipo de backend defina el endpoint real, se debe reemplazar la URL local en `src/comunidad/reporteValoracion/ReporteValoracion.jsx` por la ruta acordada, conservando el formato de respuesta. Por ejemplo, `GET /api/reportes-moderacion` es una ruta propuesta, no confirmada. La resolución de reportes actualmente solo actualiza el estado de la interfaz; persistirla requerirá también un endpoint de actualización acordado con backend.