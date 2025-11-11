<template>
  <div class="privacidad-container">
    <div class="privacidad-card">
      <div class="privacidad-header">
        <h1 class="privacidad-title">Política de Privacidad</h1>
        <p class="privacidad-date">Última actualización: {{ fechaActualizacion }}</p>
      </div>

      <div class="privacidad-content">
        <section class="privacidad-section">
          <h2 class="section-title">1. Introducción</h2>
          <p class="section-text">
            En el Repositorio de Apuntes, nos comprometemos a proteger su privacidad. Esta Política de 
            Privacidad explica cómo recopilamos, utilizamos, divulgamos y protegemos su información personal 
            cuando utiliza nuestro servicio.
          </p>
        </section>

        <section class="privacidad-section">
          <h2 class="section-title">2. Información que Recopilamos</h2>
          <p class="section-text">Recopilamos los siguientes tipos de información:</p>
          
          <h3 class="subsection-title">2.1. Información Personal</h3>
          <ul class="section-list">
            <li>Nombre completo</li>
            <li>Dirección de correo electrónico</li>
            <li>Información de perfil (carrera, universidad, rol)</li>
            <li>Contraseña (encriptada)</li>
          </ul>

          <h3 class="subsection-title">2.2. Información de Uso</h3>
          <ul class="section-list">
            <li>Documentos que sube y comparte</li>
            <li>Actividad en la plataforma</li>
            <li>Preferencias y configuraciones</li>
            <li>Ratings y comentarios</li>
          </ul>

          <h3 class="subsection-title">2.3. Información Técnica</h3>
          <ul class="section-list">
            <li>Dirección IP</li>
            <li>Tipo de navegador y dispositivo</li>
            <li>Fecha y hora de acceso</li>
            <li>Cookies y tecnologías similares</li>
          </ul>
        </section>

        <section class="privacidad-section">
          <h2 class="section-title">3. Cómo Utilizamos su Información</h2>
          <p class="section-text">Utilizamos la información recopilada para:</p>
          <ul class="section-list">
            <li>Proporcionar y mejorar nuestros servicios</li>
            <li>Autenticar su identidad y gestionar su cuenta</li>
            <li>Personalizar su experiencia en la plataforma</li>
            <li>Comunicarnos con usted sobre el servicio</li>
            <li>Detectar y prevenir fraudes o actividades no autorizadas</li>
            <li>Cumplir con obligaciones legales</li>
            <li>Analizar el uso del servicio para mejoras</li>
          </ul>
        </section>

        <section class="privacidad-section">
          <h2 class="section-title">4. Compartir Información</h2>
          <p class="section-text">
            No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en las 
            siguientes circunstancias:
          </p>
          <ul class="section-list">
            <li><strong>Con su consentimiento:</strong> Cuando usted autoriza explícitamente la divulgación</li>
            <li><strong>Proveedores de servicios:</strong> Con empresas que nos ayudan a operar el servicio (hosting, análisis)</li>
            <li><strong>Requisitos legales:</strong> Cuando sea necesario para cumplir con la ley o proteger nuestros derechos</li>
            <li><strong>Seguridad:</strong> Para proteger la seguridad de nuestros usuarios y del servicio</li>
          </ul>
        </section>

        <section class="privacidad-section">
          <h2 class="section-title">5. Seguridad de los Datos</h2>
          <p class="section-text">
            Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal 
            contra acceso no autorizado, alteración, divulgación o destrucción. Esto incluye:
          </p>
          <ul class="section-list">
            <li>Encriptación de contraseñas</li>
            <li>Protocolos de seguridad SSL/TLS</li>
            <li>Acceso restringido a información personal</li>
            <li>Monitoreo regular de sistemas de seguridad</li>
            <li>Copias de seguridad regulares</li>
          </ul>
        </section>

        <section class="privacidad-section">
          <h2 class="section-title">6. Cookies y Tecnologías Similares</h2>
          <p class="section-text">
            Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el uso del servicio 
            y personalizar el contenido. Puede controlar el uso de cookies a través de la configuración de su 
            navegador.
          </p>
        </section>

        <section class="privacidad-section">
          <h2 class="section-title">7. Sus Derechos</h2>
          <p class="section-text">Usted tiene derecho a:</p>
          <ul class="section-list">
            <li>Acceder a su información personal</li>
            <li>Corregir información inexacta o incompleta</li>
            <li>Solicitar la eliminación de su información</li>
            <li>Oponerse al procesamiento de su información</li>
            <li>Solicitar la portabilidad de sus datos</li>
            <li>Retirar su consentimiento en cualquier momento</li>
          </ul>
        </section>

        <section class="privacidad-section">
          <h2 class="section-title">8. Retención de Datos</h2>
          <p class="section-text">
            Conservamos su información personal durante el tiempo necesario para cumplir con los propósitos 
            descritos en esta política, a menos que la ley requiera o permita un período de retención más largo. 
            Cuando elimine su cuenta, eliminaremos o anonimizaremos su información personal, excepto cuando 
            la retención sea necesaria por razones legales.
          </p>
        </section>

        <section class="privacidad-section">
          <h2 class="section-title">9. Privacidad de Menores</h2>
          <p class="section-text">
            Nuestro servicio está dirigido a usuarios mayores de 13 años. No recopilamos intencionalmente 
            información personal de menores de 13 años. Si descubrimos que hemos recopilado información de 
            un menor sin el consentimiento de los padres, tomaremos medidas para eliminar esa información.
          </p>
        </section>

        <section class="privacidad-section">
          <h2 class="section-title">10. Cambios en esta Política</h2>
          <p class="section-text">
            Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos sobre cambios 
            significativos publicando la nueva política en esta página y actualizando la fecha de "Última 
            actualización". Le recomendamos que revise esta política periódicamente.
          </p>
        </section>

        <section class="privacidad-section">
          <h2 class="section-title">11. Contacto</h2>
          <p class="section-text">
            Si tiene preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o 
            el manejo de su información personal, puede contactarnos a través de nuestras redes sociales o 
            visitando nuestra página de contacto.
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
.privacidad-container {
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

.privacidad-card {
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

.privacidad-card:hover {
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.privacidad-header {
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

.privacidad-title {
  margin: 0 0 12px 0;
  font-size: 42px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -1px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
  line-height: 1.2;
}

.privacidad-date {
  margin: 0;
  font-size: 14px;
  color: #999999;
  font-weight: 400;
}

.privacidad-content {
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

.privacidad-section {
  margin-bottom: 40px;
  animation: sectionFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.privacidad-section:nth-child(1) { animation-delay: 0.1s; }
.privacidad-section:nth-child(2) { animation-delay: 0.2s; }
.privacidad-section:nth-child(3) { animation-delay: 0.3s; }
.privacidad-section:nth-child(4) { animation-delay: 0.4s; }
.privacidad-section:nth-child(5) { animation-delay: 0.5s; }
.privacidad-section:nth-child(6) { animation-delay: 0.6s; }
.privacidad-section:nth-child(7) { animation-delay: 0.7s; }
.privacidad-section:nth-child(8) { animation-delay: 0.8s; }
.privacidad-section:nth-child(9) { animation-delay: 0.9s; }
.privacidad-section:nth-child(10) { animation-delay: 1s; }
.privacidad-section:nth-child(11) { animation-delay: 1.1s; }

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

.subsection-title {
  margin: 20px 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
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

.section-list li strong {
  color: #1a1a1a;
  font-weight: 600;
}

@media (max-width: 768px) {
  .privacidad-container {
    padding: 20px 16px;
  }

  .privacidad-card {
    padding: 24px;
  }

  .privacidad-title {
    font-size: 32px;
  }

  .section-title {
    font-size: 20px;
  }

  .subsection-title {
    font-size: 16px;
  }

  .section-text,
  .section-list li {
    font-size: 14px;
  }
}
</style>

