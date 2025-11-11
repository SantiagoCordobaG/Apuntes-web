<template>
  <div class="privacidad-view">
    <el-card class="privacy-card">
      <template #header>
        <div class="card-header">
          <h1>🔒 Política de Privacidad</h1>
          <p class="last-updated">Última actualización: {{ new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
        </div>
      </template>
      
      <div class="privacy-content">
        <section class="privacy-section">
          <h2>1. Introducción</h2>
          <p>En el Repositorio de Apuntes, nos comprometemos a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, utilizamos, compartimos y protegemos su información personal cuando utiliza nuestro servicio.</p>
        </section>

        <section class="privacy-section">
          <h2>2. Información que Recopilamos</h2>
          <h3>2.1. Información que usted nos proporciona</h3>
          <ul>
            <li><strong>Datos de registro:</strong> Nombre, correo electrónico, contraseña, rol (estudiante/profesor), carrera y universidad</li>
            <li><strong>Contenido:</strong> Documentos, títulos, descripciones, etiquetas y metadatos que sube a la plataforma</li>
            <li><strong>Interacciones:</strong> Valoraciones, comentarios y preferencias de búsqueda</li>
          </ul>
          
          <h3>2.2. Información recopilada automáticamente</h3>
          <ul>
            <li><strong>Datos de uso:</strong> Páginas visitadas, tiempo de permanencia, búsquedas realizadas</li>
            <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, sistema operativo, dispositivo utilizado</li>
            <li><strong>Cookies y tecnologías similares:</strong> Para mejorar la experiencia de usuario y analizar el uso del servicio</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>3. Uso de la Información</h2>
          <p>Utilizamos su información para:</p>
          <ul>
            <li>Proporcionar, mantener y mejorar nuestros servicios</li>
            <li>Procesar sus solicitudes y transacciones</li>
            <li>Personalizar su experiencia en la plataforma</li>
            <li>Comunicarnos con usted sobre el servicio, actualizaciones y notificaciones importantes</li>
            <li>Detectar y prevenir fraudes, abusos y actividades ilegales</li>
            <li>Cumplir con obligaciones legales y resolver disputas</li>
            <li>Realizar análisis y estudios para mejorar nuestros servicios</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>4. Compartir Información</h2>
          <p>No vendemos su información personal. Podemos compartir su información en las siguientes circunstancias:</p>
          <ul>
            <li><strong>Con otros usuarios:</strong> Información de perfil pública (nombre, avatar) y contenido que usted hace público</li>
            <li><strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar el servicio (hosting, análisis, seguridad) bajo estrictos acuerdos de confidencialidad</li>
            <li><strong>Cumplimiento legal:</strong> Cuando sea necesario para cumplir con leyes, regulaciones o procesos legales</li>
            <li><strong>Protección de derechos:</strong> Para proteger nuestros derechos, propiedad o seguridad, así como la de nuestros usuarios</li>
            <li><strong>Con su consentimiento:</strong> En cualquier otra situación con su autorización explícita</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>5. Privacidad de los Documentos</h2>
          <p>Usted tiene control sobre la visibilidad de sus documentos:</p>
          <ul>
            <li><strong>Documentos públicos:</strong> Visibles y descargables por todos los usuarios</li>
            <li><strong>Documentos privados:</strong> Solo visibles para usted</li>
            <li>Puede cambiar la configuración de privacidad de sus documentos en cualquier momento</li>
            <li>Los metadatos (título, descripción, etiquetas) de documentos públicos son visibles para facilitar las búsquedas</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>6. Seguridad de la Información</h2>
          <p>Implementamos medidas de seguridad técnicas y organizativas para proteger su información:</p>
          <ul>
            <li>Cifrado de datos en tránsito y en reposo</li>
            <li>Autenticación segura y almacenamiento encriptado de contraseñas</li>
            <li>Acceso restringido a información personal solo para personal autorizado</li>
            <li>Monitoreo regular de sistemas para detectar vulnerabilidades</li>
            <li>Copias de seguridad regulares de los datos</li>
          </ul>
          <p>Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro.</p>
        </section>

        <section class="privacy-section">
          <h2>7. Sus Derechos</h2>
          <p>Usted tiene derecho a:</p>
          <ul>
            <li><strong>Acceso:</strong> Solicitar una copia de la información personal que tenemos sobre usted</li>
            <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
            <li><strong>Eliminación:</strong> Solicitar la eliminación de su información personal (sujeto a ciertas limitaciones legales)</li>
            <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado y de uso común</li>
            <li><strong>Oposición:</strong> Oponerse al procesamiento de su información en ciertas circunstancias</li>
            <li><strong>Retirar consentimiento:</strong> Retirar su consentimiento cuando el procesamiento se base en él</li>
          </ul>
          <p>Para ejercer estos derechos, puede contactarnos a través de la sección de Contacto.</p>
        </section>

        <section class="privacy-section">
          <h2>8. Cookies y Tecnologías de Seguimiento</h2>
          <p>Utilizamos cookies y tecnologías similares para:</p>
          <ul>
            <li>Mantener su sesión activa</li>
            <li>Recordar sus preferencias</li>
            <li>Analizar el uso del servicio</li>
            <li>Mejorar la funcionalidad del sitio</li>
          </ul>
          <p>Puede configurar su navegador para rechazar cookies, pero esto puede afectar la funcionalidad del servicio.</p>
        </section>

        <section class="privacy-section">
          <h2>9. Retención de Datos</h2>
          <p>Conservamos su información personal mientras:</p>
          <ul>
            <li>Su cuenta esté activa</li>
            <li>Sea necesario para proporcionar nuestros servicios</li>
            <li>Sea requerido por obligaciones legales o para resolver disputas</li>
          </ul>
          <p>Cuando elimine su cuenta, eliminaremos o anonimizaremos su información personal, excepto cuando la ley requiera su conservación.</p>
        </section>

        <section class="privacy-section">
          <h2>10. Menores de Edad</h2>
          <p>Nuestro servicio está dirigido a usuarios mayores de 13 años. No recopilamos intencionalmente información de menores de 13 años. Si descubrimos que hemos recopilado información de un menor, la eliminaremos inmediatamente.</p>
        </section>

        <section class="privacy-section">
          <h2>11. Cambios a esta Política</h2>
          <p>Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios significativos mediante:</p>
          <ul>
            <li>Una notificación en la plataforma</li>
            <li>Un correo electrónico a la dirección asociada con su cuenta</li>
            <li>Actualización de la fecha de "Última actualización" en esta página</li>
          </ul>
          <p>Le recomendamos revisar esta política regularmente para estar informado sobre cómo protegemos su información.</p>
        </section>

        <section class="privacy-section">
          <h2>12. Contacto</h2>
          <p>Si tiene preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o el tratamiento de su información personal, puede contactarnos a través de la sección de Contacto disponible en la plataforma.</p>
        </section>
      </div>
    </el-card>
  </div>
</template>

<script setup>
</script>

<style scoped>
.privacidad-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.privacy-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
}

.card-header {
  text-align: center;
  padding: 20px 0;
}

.card-header h1 {
  margin: 0 0 10px 0;
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
}

.last-updated {
  margin: 0;
  font-size: 14px;
  color: #666;
  font-style: italic;
}

.privacy-content {
  padding: 20px 0;
}

.privacy-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.privacy-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.privacy-section h2 {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.privacy-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 20px 0 12px 0;
}

.privacy-section p {
  font-size: 16px;
  line-height: 1.7;
  color: #4b5563;
  margin: 0 0 12px 0;
}

.privacy-section ul {
  margin: 12px 0;
  padding-left: 24px;
}

.privacy-section li {
  font-size: 16px;
  line-height: 1.7;
  color: #4b5563;
  margin-bottom: 8px;
}

.privacy-section li strong {
  color: #1a1a1a;
  font-weight: 600;
}

@media (max-width: 768px) {
  .privacidad-view {
    padding: 20px 16px;
  }

  .card-header h1 {
    font-size: 24px;
  }

  .privacy-section h2 {
    font-size: 20px;
  }

  .privacy-section h3 {
    font-size: 17px;
  }

  .privacy-section p,
  .privacy-section li {
    font-size: 15px;
  }
}
</style>

