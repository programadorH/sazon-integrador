import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './components/Header'
import Comunidad from './comunidad/valoracion/Comunidad'
import ReporteValoracion from './comunidad/reporteValoracion/ReporteValoracion'
import { Favoritos } from './comunidad/favoritos'
import { Colecciones } from './comunidad/colecciones'
import { Comentarios } from './comunidad/comentarios'
import { ReporteValoracion } from './comunidad/reporteValoracion'

// Pestañas de la Célula 6 · Comunidad
const VISTAS = [
  { id: 'valoraciones', etiqueta: 'Valoraciones', Componente: Comunidad },
  { id: 'favoritos', etiqueta: 'Favoritos', Componente: Favoritos },
  { id: 'colecciones', etiqueta: 'Colecciones', Componente: Colecciones },
  { id: 'comentarios', etiqueta: 'Comentarios', Componente: Comentarios },
  { id: 'reportes', etiqueta: 'Reportes', Componente: ReporteValoracion },
]

export function App() {
  const [vista, setVista] = useState('favoritos')
  const { Componente } = VISTAS.find((item) => item.id === vista)

  return (
    <Header>
      <nav className="mb-6 flex gap-2" aria-label="Módulos de comunidad">
        <button
          type="button"
          aria-pressed={vista === 'valoraciones'}
          className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
            vista === 'valoraciones'
              ? 'bg-emerald-800 text-white shadow-sm dark:bg-emerald-400 dark:text-emerald-950'
              : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-700 hover:text-emerald-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-emerald-300 dark:hover:text-emerald-200'
          }`}
          onClick={() => setVista('valoraciones')}
        >
          Valoraciones
        </button>
        <button
          type="button"
          aria-pressed={vista === 'favoritos'}
          className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
            vista === 'favoritos'
              ? 'bg-emerald-800 text-white shadow-sm dark:bg-emerald-400 dark:text-emerald-950'
              : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-700 hover:text-emerald-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-emerald-300 dark:hover:text-emerald-200'
          }`}
          onClick={() => setVista('favoritos')}
        >
          Favoritos
        </button>
        <button
          type="button"
          aria-pressed={vista === 'reportes'}
          className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
            vista === 'reportes'
              ? 'bg-emerald-800 text-white shadow-sm dark:bg-emerald-400 dark:text-emerald-950'
              : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-700 hover:text-emerald-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-emerald-300 dark:hover:text-emerald-200'
          }`}
          onClick={() => setVista('reportes')}
        >
          Reportes
        </button>
      </nav>
      {vista === 'favoritos' ? (
        <Favoritos />
      ) : vista === 'reportes' ? (
        <ReporteValoracion />
      ) : (
        <Comunidad />
      )}
      <nav className="mb-6 flex flex-wrap gap-2.5" aria-label="Módulos de comunidad">
        {VISTAS.map(({ id, etiqueta }) => (
          <button
            key={id}
            type="button"
            aria-pressed={vista === id}
            className={`rounded-xl border px-5 py-2.5 font-mono-tag text-sm font-bold transition-colors ${
              vista === id
                ? 'border-emerald-900 bg-emerald-900 text-white shadow-sm dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950'
                : 'border-emerald-800 bg-white text-emerald-950 hover:bg-emerald-50 dark:border-emerald-300/60 dark:bg-white/5 dark:text-emerald-100 dark:hover:bg-emerald-300/10'
            }`}
            onClick={() => setVista(id)}
          >
            {etiqueta}
          </button>
        ))}
      </nav>
      <Componente />
    </Header>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)