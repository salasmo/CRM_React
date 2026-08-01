export function formatCurrencyCompact(value) {
  const num = Number(value) || 0
  const abs = Math.abs(num)
  if (abs >= 1_000_000) return `$${(num / 1_000_000).toLocaleString('es-MX', { maximumFractionDigits: 1 })}M`
  if (abs >= 1_000) return `$${(num / 1_000).toLocaleString('es-MX', { maximumFractionDigits: 0 })}K`
  return `$${num.toLocaleString('es-MX')}`
}

export function formatCurrency(value) {
  return `$${(Number(value) || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 })}`
}

export function formatPercent(value) {
  return `${(Number(value) || 0).toFixed(1)}%`
}

export function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-')
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${meses[Number(month) - 1]} ${year}`
}