export default function StatCard({ icon: Icon, label, value, color }) {
    return (
      <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm min-w-0">
        <div className={`w-9 h-9 rounded-md flex items-center justify-center mb-3 ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        <p className="text-sf-text-muted text-sm truncate">{label}</p>
        <p className="text-xl sm:text-2xl font-bold mt-1 truncate" title={typeof value === 'string' ? value : undefined}>
          {value}
        </p>
      </div>
    )
  }