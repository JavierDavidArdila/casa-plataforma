# Para preguntar al cliente (Fernando)

Salen del Word "INSCRIBETE 100 usuarios y VIP" (2 oct 2026).

1. **Países de origen.** Dejé solo los 20 del Word. Antes también estaban Cuba, España, Puerto Rico y República Dominicana
   (y "Otro"). ¿Se quedan fuera o se agregan? (`app/data/ubicaciones.ts` → `PAISES_ORIGEN`)
2. **Ortografía de ciudades.** Corregí por mi cuenta: "Prínce Edward Islan" → Prince Edward Island, "New Scotland" → Nova Scotia,
   "Columbia Disctric" → District of Columbia, y separé "Regina" de "Newfoundland and Labrador". Confirmar. Los estados de EE. UU.
   quedaron como en el Word (mezcla de español e inglés: Hawái, Luisiana, Nevada, New York...). ¿Se unifica el idioma?
3. **Cobro desde el inscrito 101.** Los 100 primeros activan gratis al crear su cuenta (`shared/utils/cupo.ts`). Del 101 en
   adelante ve la pantalla de pago. Falta que el cliente defina la pasarela (Hotmart necesita el `hottok`; Openpay aún sin
   integrar) y el precio.
4. **Clave Periodista/Invitado en el formulario de referidos.** Hoy solo se valida el formato y se guarda; no se comprueba
   contra `codigos_acceso`. ¿Debe validarse contra los códigos reales (y descontar un uso)?
5. **"Años cuidando a la distancia".** Quedó como campo nuevo del registro. El test ya tiene una pregunta parecida (años cuidando):
   ¿se elimina del test o se mantiene en ambos?
6. **Pendientes del Word sin construir:** PDF descargable de COMPRENDER con su video por correo, y las notificaciones por correo
   de la pasarela (compra y confirmación o rechazo del pago).

## Del Word "Textos plataforma Web C.A.S.A." (30 sep, recibido 5 oct 2026)

7. **Pilar 2: ¿APRENDER o ACOMPAÑAR?** El texto nuevo del Home dice "Comprender, Aprender, Sostener y Aliviar" y "Contenido 2.
   APRENDER", pero los resultados del test siguen diciendo ACOMPAÑAR. Los textos de bienvenida y Quiénes Somos van como los
   escribió el cliente (Aprender); las tarjetas de contenidos y el test siguen con "Acompañar" hasta que se confirme.
8. **Entrevista Jorge Ramos (Prensa).** Se enlazó el video de Al Punto/Univisión que estaba en ahorasoypapademispapas.com
   (youtube cUYoAXlBMWU). Confirmar que es la entrevista correcta ("encuentro de hijos que hablaban de sus mamás").
9. **Fotos del equipo (Quiénes Somos).** Solo hay foto de Fernando; faltan las de Luz María, Oscar Javier y Alejandra.
10. **Términos y condiciones.** El Word "enviado antes" no está en `correos/`; el enlace del footer sigue en `#`.
11. **Archivos de diseño de Oscar Javier** (cambios de títulos y distribución de Primera temporada y Prensa): no llegaron
    al correo; pedirlos para comparar.
12. **Fotos finales de los libros**: el correo del 5 oct dice "adjuntas" pero no venían; se mantienen las del 29 sep (de WhatsApp).
13. **URLs de las librerías** (Colombia, Ecuador, USA y E-Book) siguen sin enlace.
