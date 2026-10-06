import { CERTIFICADOS } from '#shared/utils/certificado'

// Correos transaccionales con Cloudflare Email Service (binding `EMAIL` en wrangler.jsonc).
// Requiere que el dominio casacuidadoadistancia.com esté habilitado en Email Sending; mientras
// no lo esté, el envío falla y se registra en el log sin bloquear al usuario.
const REMITENTE = { email: 'casa@casacuidadoadistancia.com', name: 'C.A.S.A. — Del Cuidado a Distancia' }
const RESPONDER_A = 'fernando@ahorasoypapademispapas.com'

function escapar(texto: string) {
  return texto.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

export async function enviarFelicitacionContenido(
  email: SendEmail | undefined,
  datos: { para: string; nombre: string; slug: string; sitioUrl: string }
): Promise<boolean> {
  const certificado = CERTIFICADOS[datos.slug]
  if (!email || !certificado) return false

  const enlace = `${datos.sitioUrl.replace(/\/$/, '')}/certificado/${datos.slug}`
  const nombre = escapar(datos.nombre || 'Hola')
  const texto = [
    `¡FELICITACIONES, ${datos.nombre}!`,
    '',
    ...certificado.correo.flatMap((p) => [p, '']),
    certificado.siguiente,
    '',
    `Mira y descarga tu certificado: ${enlace}`,
    '',
    'Comenzaste la Primera Temporada.',
    'Esta es tu C.A.S.A.',
  ].join('\n')

  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#f2f2f2;font-family:Arial,Helvetica,sans-serif;color:#494949">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;padding:30px 0"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;border:2px solid #ffb100">
<tr><td style="padding:30px 30px 10px;text-align:center">
<img src="${datos.sitioUrl.replace(/\/$/, '')}/images/brand/casa-logo.png" alt="C.A.S.A." width="200" style="width:200px;height:auto">
</td></tr>
<tr><td style="padding:10px 40px;text-align:center">
<p style="font-size:28px;font-weight:bold;color:#ffb100;margin:10px 0">¡FELICITACIONES, ${nombre}!</p>
${certificado.correo.map((p) => `<p style="font-size:16px;line-height:1.5;margin:10px 0">${escapar(p)}</p>`).join('\n')}
<p style="font-size:16px;line-height:1.5;margin:10px 0">${escapar(certificado.siguiente)}</p>
<p style="margin:25px 0"><a href="${enlace}" style="background:#ffb100;color:#ffffff;text-decoration:none;font-weight:bold;padding:14px 28px;border-radius:10px;display:inline-block">Ver mi certificado</a></p>
<p style="font-size:16px;font-weight:bold;margin:10px 0 0">Comenzaste la Primera Temporada.</p>
<p style="font-size:16px;font-weight:bold;color:#0078cc;margin:4px 0 30px">Esta es tu C.A.S.A.</p>
</td></tr>
</table>
<p style="font-size:12px;color:#8a8a8a;margin:15px 0">® Todos los derechos reservados por Cuidar es 360 SAS</p>
</td></tr></table></body></html>`

  try {
    await email.send({
      to: datos.para,
      from: REMITENTE,
      cc: RESPONDER_A,
      replyTo: RESPONDER_A,
      subject: `¡Felicitaciones! Terminaste ${certificado.pilar} en C.A.S.A.`,
      html,
      text: texto,
    })
    return true
  } catch (e) {
    console.error('No se pudo enviar el correo de felicitación:', e)
    return false
  }
}
