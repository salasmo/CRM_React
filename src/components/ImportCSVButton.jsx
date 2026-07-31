import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import Papa from 'papaparse'
import { supabase } from '../lib/supabase'

export default function ImportCSVButton({ table, columns, onDone }) {
  const inputRef = useRef(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    setResult(null)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (parsed) => {
        const rows = parsed.data
          .map(row => {
            const clean = {}
            columns.forEach(col => {
              const raw = row[col.label]
              if (raw !== undefined && raw !== '') {
                clean[col.key] = col.number ? Number(raw) || 0 : String(raw).trim()
              }
            })
            return clean
          })
          .filter(row => row[columns[0].key])

        if (rows.length === 0) {
          setImporting(false)
          setResult({ error: 'No se encontraron filas válidas. Revisa que los encabezados del CSV coincidan con la plantilla.' })
          e.target.value = ''
          return
        }

        const { error } = await supabase.from(table).insert(rows)
        setImporting(false)
        e.target.value = ''

        if (error) setResult({ error: error.message })
        else {
          setResult({ success: rows.length })
          onDone()
        }
      },
      error: (err) => {
        setImporting(false)
        setResult({ error: err.message })
      },
    })
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
      <button
        onClick={() => inputRef.current.click()}
        disabled={importing}
        className="flex items-center gap-2 border border-sf-border bg-white hover:bg-sf-bg px-3 py-2 rounded-md text-sm font-medium transition disabled:opacity-50"
      >
        <Upload size={16} /> {importing ? 'Importando...' : 'Importar CSV'}
      </button>
      {result?.success && <p className="text-xs text-sf-success mt-1">{result.success} registros importados correctamente.</p>}
      {result?.error && <p className="text-xs text-sf-danger mt-1">{result.error}</p>}
    </div>
  )
}