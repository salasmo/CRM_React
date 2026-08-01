export function formatCurrencyCompact(value) {
    const num = Number(value) || 0
    const abs = Math.abs(num)
    if (abs >= 1_000_000) return `$${(num / 1_000_000).toLocaleString('es-MX', { maximumFractionDigits: 1 })}M`
    if (abs >= 1_000) return `$${(num / 1_000).toLocaleString('es-MX', { maximumFractionDigits: 0 })}K`
    return `$${num.toLocaleString('es-MX')}`
  }