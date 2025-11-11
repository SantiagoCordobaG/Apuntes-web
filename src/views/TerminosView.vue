<template>
  <div class="terminos-container">
    <div class="terminos-card">
      <div class="terminos-header">
        <h1 class="terminos-title">Términos de Uso</h1>
        <p class="terminos-date">Última actualización: {{ fechaActualizacion }}</p>
      </div>

      <div class="terminos-content">
        <section class="terminos-section">
          <h2 class="section-title">1. Aceptación de los Términos</h2>
          <p class="section-text">
            Al acceder y utilizar el Repositorio de Apuntes, usted acepta cumplir con estos Términos de Uso 
            y todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, 
            no debe utilizar nuestro servicio.
          </p>
        </section>

        <section class="terminos-section">
          <h2 class="section-title">2. Uso del Servicio</h2>
          <p class="section-text">
            El Repositorio de Apuntes es una plataforma diseñada para compartir y acceder a materiales 
            educativos. Usted se compromete a:
          </p>
          <ul class="section-list">
            <li>Utilizar el servicio únicamente para fines educativos y legales</li>
            <li>No subir contenido que infrinja derechos de autor o propiedad intelectual</li>
            <li>No compartir material protegido por derechos de autor sin autorización</li>
            <li>Respetar los derechos de otros usuarios</li>
            <li>No utilizar el servicio para actividades ilegales o no autorizadas</li>
          </ul>
        </section>

        <section class="terminos-section">
          <h2 class="section-title">3. Contenido del Usuario</h2>
          <p class="section-text">
            Usted es responsable de todo el contenido que suba, publique o comparta a través del servicio. 
            Al subir contenido, usted garantiza que:
          </p>
          <ul class="section-list">
            <li>Posee los derechos necesarios sobre el contenido o tiene autorización para compartirlo</li>
            <li>El contenido no viola ninguna ley o derecho de terceros</li>
            <li>El contenido es preciso y no es engañoso</li>
            <li>No contiene material ofensivo, difamatorio o ilegal</li>
          </ul>
        </section>

        <section class="terminos-section">
          <h2 class="section-title">4. Propiedad Intelectual</h2>
          <p class="section-text">
            Todos los materiales educativos compartidos en la plataforma mantienen sus derechos de autor 
            originales. Los usuarios conservan la propiedad de su contenido, pero otorgan a la plataforma 
            una licencia no exclusiva para almacenar, mostrar y distribuir dicho contenido.
          </p>
        </section>

        <section class="terminos-section">
          <h2 class="section-title">5. Prohibiciones</h2>
          <p class="section-text">Está estrictamente prohibido:</p>
          <ul class="section-list">
            <li>Subir contenido protegido por derechos de autor sin permiso</li>
            <li>Utilizar el servicio para distribuir malware o software malicioso</li>
            <li>Intentar acceder a áreas restringidas del sistema</li>
            <li>Interferir con el funcionamiento del servicio</li>
            <li>Suplantar la identidad de otra persona</li>
            <li>Recopilar información de otros usuarios sin autorización</li>
          </ul>
        </section>

        <section class="terminos-section">
          <h2 class="section-title">6. Modificaciones del Servicio</h2>
          <p class="section-text">
            Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio 
            en cualquier momento, con o sin previo aviso. No seremos responsables ante usted ni ante ningún 
            tercero por cualquier modificación, suspensión o discontinuación del servicio.
          </p>
        </section>

        <section class="terminos-section">
          <h2 class="section-title">7. Limitación de Responsabilidad</h2>
          <p class="section-text">
            El servicio se proporciona "tal cual" y "según disponibilidad". No garantizamos que el servicio 
            esté libre de errores, interrupciones o defectos. No seremos responsables por daños directos, 
            indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de usar el servicio.
          </p>
        </section>

        <section class="terminos-section">
          <h2 class="section-title">8. Terminación</h2>
          <p class="section-text">
            Nos reservamos el derecho de suspender o terminar su acceso al servicio en cualquier momento, 
            con o sin causa, y con o sin previo aviso, por cualquier motivo, incluyendo pero no limitado a 
            la violación de estos Términos de Uso.
          </p>
        </section>

        <section class="terminos-section">
          <h2 class="section-title">9. Cambios en los Términos</h2>
          <p class="section-text">
            Podemos modificar estos Términos de Uso en cualquier momento. Los cambios entrarán en vigor 
            inmediatamente después de su publicación. Su uso continuado del servicio después de los cambios 
            constituye su aceptación de los nuevos términos.
          </p>
        </section>

        <section class="terminos-section">
          <h2 class="section-title">10. Contacto</h2>
          <p class="section-text">
            Si tiene preguntas sobre estos Términos de Uso, puede contactarnos a través de nuestras 
            redes sociales o visitando nuestra página de contacto.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const fechaActualizacion = ref('Enero 2025');
</script>

<style scoped>
.terminos-container {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  min-height: calc(100vh - 160px);
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.terminos-card {
  width: 100%;
  max-width: 900px;
  padding: 48px;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.terminos-card:hover {
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.terminos-header {
  text-align: center;
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  animation: headerFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

@keyframes headerFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.terminos-title {
  margin: 0 0 12px 0;
  font-size: 42px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -1px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
  line-height: 1.2;
}

.terminos-date {
  margin: 0;
  font-size: 14px;
  color: #999999;
  font-weight: 400;
}

.terminos-content {
  animation: contentFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.terminos-section {
  margin-bottom: 40px;
  animation: sectionFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.terminos-section:nth-child(1) { animation-delay: 0.1s; }
.terminos-section:nth-child(2) { animation-delay: 0.2s; }
.terminos-section:nth-child(3) { animation-delay: 0.3s; }
.terminos-section:nth-child(4) { animation-delay: 0.4s; }
.terminos-section:nth-child(5) { animation-delay: 0.5s; }
.terminos-section:nth-child(6) { animation-delay: 0.6s; }
.terminos-section:nth-child(7) { animation-delay: 0.7s; }
.terminos-section:nth-child(8) { animation-delay: 0.8s; }
.terminos-section:nth-child(9) { animation-delay: 0.9s; }
.terminos-section:nth-child(10) { animation-delay: 1s; }

@keyframes sectionFadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
  letter-spacing: -0.3px;
}

.section-text {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #666666;
  line-height: 1.8;
  font-weight: 400;
}

.section-list {
  margin: 16px 0;
  padding-left: 24px;
  list-style: none;
}

.section-list li {
  margin-bottom: 12px;
  font-size: 16px;
  color: #666666;
  line-height: 1.8;
  position: relative;
  padding-left: 24px;
}

.section-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #1a1a1a;
  font-weight: 600;
  font-size: 20px;
}

@media (max-width: 768px) {
  .terminos-container {
    padding: 20px 16px;
  }

  .terminos-card {
    padding: 24px;
  }

  .terminos-title {
    font-size: 32px;
  }

  .section-title {
    font-size: 20px;
  }

  .section-text,
  .section-list li {
    font-size: 14px;
  }
}
</style>

