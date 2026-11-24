# Historia de usuario: moderación de reportes de la comunidad

**HU-CEL06-01 — Moderación y confianza**

Como moderador de la comunidad Sa·zón, quiero consultar, filtrar y revisar reportes sobre valoraciones, para decidir si el contenido reportado debe aprobarse o bloquearse.

## Criterios de aceptación

- Los reportes se cargan desde una fuente JSON de forma asíncrona.
- Mientras se cargan los datos se informa al usuario; si la solicitud falla, se muestra un error y se permite reintentar.
- El moderador puede buscar y filtrar reportes, consultar su detalle y aprobarlos o bloquearlos.
- La lista y las estadísticas se actualizan en la interfaz sin recargar la página.

## Ubicación de los componentes

Los componentes de esta historia están en `src/comunidad/reporteValoracion/`:

- `ReporteValoracion.jsx`: coordina la carga de datos, el estado, los filtros y las acciones.
- `EstadisticasModeracion.jsx`: presenta el resumen de reportes.
- `FiltrosReportes.jsx`: permite buscar y filtrar por estado.
- `TablaReportes.jsx`: muestra los resultados y la paginación.
- `DetalleReporteModal.jsx`: muestra el reporte y permite resolverlo.

Los datos simulados que consume la interfaz están en `public/data/reportes-moderacion.json`. La respuesta se carga en el cliente; aprobar o bloquear un reporte todavía no persiste el cambio en un servidor.
