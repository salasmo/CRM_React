import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-sf-bg text-sf-text">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link to="/" className="flex items-center gap-2 mb-8 text-sf-text-muted hover:text-sf-blue transition w-fit">
          <Building2 size={18} className="text-sf-blue" />
          <span className="text-sm font-medium">Estatera</span>
        </Link>

        <h1 className="text-xl font-semibold mb-1">Aviso de privacidad</h1>
        <p className="text-sf-text-muted text-xs mb-8">Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-5 text-sm leading-relaxed text-sf-text">
          <section>
            <h2 className="font-medium mb-1">¿Qué es Estatera?</h2>
            <p className="text-sf-text-muted">Estatera es una plataforma de gestión comercial (CRM) utilizada por equipos de ventas inmobiliarias para dar seguimiento a prospectos, propiedades y comunicaciones con clientes.</p>
          </section>

          <section>
            <h2 className="font-medium mb-1">Datos que procesa la plataforma</h2>
            <p className="text-sf-text-muted">Estatera almacena datos capturados por el equipo de ventas que la utiliza, incluyendo: información de cuentas de usuario del personal (nombre, correo, rol), datos de contacto de prospectos (nombre, teléfono, correo), el contenido de conversaciones de WhatsApp cuando la plataforma se conecta a esa integración, y métricas de campañas publicitarias cuando se conecta a plataformas de terceros.</p>
          </section>

          <section>
            <h2 className="font-medium mb-1">Uso de la información</h2>
            <p className="text-sf-text-muted">La información se utiliza exclusivamente para fines de gestión comercial interna: dar seguimiento a prospectos, asignar leads al equipo de ventas correspondiente, y generar métricas de desempeño. No se comparte con terceros ajenos a la organización que opera la plataforma.</p>
          </section>

          <section>
            <h2 className="font-medium mb-1">Mensajería automatizada</h2>
            <p className="text-sf-text-muted">Cuando Estatera se conecta a WhatsApp, los mensajes entrantes pueden ser procesados por un asistente automatizado para generar una respuesta inicial. Cualquier persona puede solicitar en cualquier momento ser atendida por un miembro humano del equipo de ventas.</p>
          </section>

          <section>
            <h2 className="font-medium mb-1">Almacenamiento y seguridad</h2>
            <p className="text-sf-text-muted">Los datos se almacenan en infraestructura con controles de acceso, autenticación y cifrado estándar de la industria. El acceso está restringido al personal autorizado de la organización que utiliza la plataforma.</p>
          </section>

          <section>
            <h2 className="font-medium mb-1">Derechos de los usuarios</h2>
            <p className="text-sf-text-muted">Cualquier persona cuyos datos estén almacenados en la plataforma puede solicitar acceso, corrección o eliminación de su información, contactando directamente a la organización que la administra.</p>
          </section>
        </div>
      </div>
    </div>
  )
}