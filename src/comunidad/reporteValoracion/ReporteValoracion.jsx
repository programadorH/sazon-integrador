import { useEffect, useMemo, useState } from 'react'
import EstadisticasModeracion from './EstadisticasModeracion'
import FiltrosReportes from './FiltrosReportes'
import TablaReportes from './TablaReportes'
import DetalleReporteModal from './DetalleReporteModal'

const REPORTES_URL = `${import.meta.env.BASE_URL}data/reportes-moderacion.json`
const ESTADOS_VALIDOS = new Set(['pendiente', 'aprobado', 'bloqueado'])
const CAMPOS_TEXTO_REPORTE = ['id', 'usuario', 'contenido', 'motivo', 'receta', 'marca', 'fecha']

const esListaDeReportesValida = (datos) =>
  Array.isArray(datos) &&
  datos.every(
    (reporte) =>
      reporte &&
      typeof reporte === 'object' &&
      CAMPOS_TEXTO_REPORTE.every((campo) => typeof reporte[campo] === 'string') &&
      ESTADOS_VALIDOS.has(reporte.estado) &&
      typeof reporte.prioridad === 'boolean',
  )
import { REPORTES_INICIALES } from './data'
import EncabezadoComunidad, { PanelDato } from '../EncabezadoComunidad'

const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'aprobado', label: 'Aprobados' },
  { id: 'bloqueado', label: 'Bloqueados / Descartados' },
]

function ReporteValoracion() {
  const [reportes, setReportes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [intentoCarga, setIntentoCarga] = useState(0)
  const [filtroActivo, setFiltroActivo] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const reportesPorPagina = 5

  useEffect(() => {
    const controlador = new AbortController()

    const cargarReportes = async () => {
      try {
        const respuesta = await fetch(REPORTES_URL, { signal: controlador.signal })
        if (!respuesta.ok) {
          throw new Error(`La solicitud de reportes respondió con HTTP ${respuesta.status}`)
        }

        const datos = await respuesta.json()
        if (!esListaDeReportesValida(datos)) {
          throw new Error('La respuesta de reportes no tiene el formato esperado')
        }

        setReportes(datos)
      } catch (error) {
        if (controlador.signal.aborted) return

        console.error('Error al cargar reportes de moderación:', error)
        setErrorCarga('No se pudieron cargar los reportes. Comprueba tu conexión e inténtalo de nuevo.')
      } finally {
        if (!controlador.signal.aborted) setCargando(false)
      }
    }

    cargarReportes()
    return () => controlador.abort()
  }, [intentoCarga])

  const conteos = useMemo(
    () => reportes.reduce(
      (totales, reporte) => {
        totales[reporte.estado] += 1
        return totales
      },
      { pendiente: 0, aprobado: 0, bloqueado: 0 },
    ),
    [reportes],
  )

  const reportesFiltrados = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase('es')
    return reportes.filter((reporte) => {
      const coincideEstado =
        filtroActivo === 'todos' ||
        (filtroActivo === 'bloqueado'
          ? reporte.estado === 'bloqueado'
          : reporte.estado === filtroActivo)
      const coincideBusqueda =
        !consulta ||
        [reporte.id, reporte.usuario, reporte.contenido, reporte.receta, reporte.marca]
          .join(' ')
          .toLocaleLowerCase('es')
          .includes(consulta)
      return coincideEstado && coincideBusqueda
    })
  }, [busqueda, filtroActivo, reportes])

  const totalPaginas = Math.max(1, Math.ceil(reportesFiltrados.length / reportesPorPagina))
  const reportesVisibles = reportesFiltrados.slice(
    (pagina - 1) * reportesPorPagina,
    pagina * reportesPorPagina,
  )

  const cambiarFiltro = (filtro) => {
    setFiltroActivo(filtro)
    setPagina(1)
  }

  const cambiarBusqueda = (valor) => {
    setBusqueda(valor)
    setPagina(1)
  }

  const reintentarCarga = () => {
    setCargando(true)
    setErrorCarga('')
    setIntentoCarga((actual) => actual + 1)
  }

  const resolverReporte = (id, estado) => {
    setReportes((actuales) =>
      actuales.map((reporte) =>
        reporte.id === id ? { ...reporte, estado } : reporte,
      ),
    )
    setReporteSeleccionado(null)
    setMensaje(estado === 'aprobado' ? 'Reporte aprobado.' : 'Contenido bloqueado.')
    window.setTimeout(() => setMensaje(''), 3500)
  }

  const exportarCSV = () => {
    const columnas = ['ID reporte', 'Usuario reporta', 'Contenido denunciado', 'Motivo', 'Receta', 'Marca', 'Fecha', 'Estado']
    const filas = reportesFiltrados.map((reporte) => [
      reporte.id,
      reporte.usuario,
      reporte.contenido,
      reporte.motivo,
      reporte.receta,
      reporte.marca,
      reporte.fecha,
      reporte.estado,
    ])
    const csv = [columnas, ...filas]
      .map((fila) => fila.map((celda) => `"${String(celda).replaceAll('"', '""')}"`).join(','))
      .join('\r\n')
    const archivo = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(archivo)
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = 'reportes-moderacion.csv'
    document.body.appendChild(enlace)
    enlace.click()
    enlace.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <section className="space-y-6">
      <EncabezadoComunidad
        icono="bi-shield-check"
        colorIcono="text-emerald-300"
        etiqueta="Moderación y confianza"
        titulo="Panel de moderación de reportes"
        descripcion="Supervisión, filtrado y resolución en tiempo real de interacciones comunitarias. Protección de recetas co-creadas con marcas Zenú, Doria, Pietrán, Noel, Chocolisto y Sello Rojo."
        aside={<PanelDato valor={conteos.pendiente} titulo="pendientes" detalle="SLA menor a 20 min" />}
      />

      {cargando ? (
        <p
          role="status"
          className="m-0 rounded-2xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-sazon-verdeNutresaCard dark:text-slate-300"
        >
          <i className="bi bi-arrow-repeat mr-2 inline-block animate-spin" aria-hidden="true"></i>
          Cargando reportes...
        </p>
      ) : errorCarga ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200"
        >
          <p className="m-0">{errorCarga}</p>
          <button
            type="button"
            onClick={reintentarCarga}
            className="mt-3 rounded-lg border border-red-300 px-3 py-2 text-xs font-bold transition hover:bg-red-100 dark:border-red-400/30 dark:hover:bg-red-400/10"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <EstadisticasModeracion
            pendientes={conteos.pendiente}
            aprobados={conteos.aprobado}
            bloqueados={conteos.bloqueado}
            prioritarios={reportes.filter((reporte) => reporte.estado === 'pendiente' && reporte.prioridad).length}
          />

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-sm dark:border-white/10 dark:bg-sazon-verdeNutresaCard">
            <FiltrosReportes
              filtros={FILTROS}
              filtroActivo={filtroActivo}
              conteos={conteos}
              total={reportes.length}
              busqueda={busqueda}
              onCambiarFiltro={cambiarFiltro}
              onCambiarBusqueda={cambiarBusqueda}
              onExportar={exportarCSV}
            />
            <TablaReportes
              reportes={reportesVisibles}
              total={reportesFiltrados.length}
              pagina={pagina}
              totalPaginas={totalPaginas}
              inicio={(pagina - 1) * reportesPorPagina}
              onCambiarPagina={setPagina}
              onAbrirReporte={setReporteSeleccionado}
            />
          </div>

          {reporteSeleccionado && (
            <DetalleReporteModal
              reporte={reporteSeleccionado}
              onCerrar={() => setReporteSeleccionado(null)}
              onResolver={resolverReporte}
            />
          )}
        </>
      )}

      {mensaje && (
        <p
          role="status"
          className="fixed bottom-20 left-1/2 z-50 m-0 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-sazon-verdeNoche px-4 py-3 text-sm text-white shadow-xl"
        >
          <i className="bi bi-check-circle-fill text-sazon-verdeNeon"></i>
          {mensaje}
        </p>
      )}
    </section>
  )
}

export default ReporteValoracion
