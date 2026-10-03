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
