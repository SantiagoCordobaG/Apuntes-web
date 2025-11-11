<template>
  <div class="terminos-view">
    <el-card class="terms-card">
      <template #header>
        <div class="card-header">
          <h1>📋 Términos de Uso</h1>
          <p class="last-updated">Última actualización: {{ new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
        </div>
      </template>
      
      <div class="terms-content">
        <section class="terms-section">
          <h2>1. Aceptación de los Términos</h2>
          <p>Al acceder y utilizar el Repositorio de Apuntes, usted acepta cumplir con estos Términos de Uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.</p>
        </section>

        <section class="terms-section">
          <h2>2. Descripción del Servicio</h2>
          <p>El Repositorio de Apuntes es una plataforma que permite a los usuarios:</p>
          <ul>
            <li>Subir, almacenar y compartir documentos académicos</li>
            <li>Buscar y descargar documentos compartidos por otros usuarios</li>
            <li>Valorar y comentar sobre la calidad de los documentos</li>
            <li>Acceder a recursos educativos de manera colaborativa</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>3. Registro y Cuenta de Usuario</h2>
          <p>Para utilizar ciertas funcionalidades del servicio, debe:</p>
          <ul>
            <li>Crear una cuenta proporcionando información veraz y completa</li>
            <li>Mantener la confidencialidad de su contraseña</li>
            <li>Ser responsable de todas las actividades que ocurran bajo su cuenta</li>
            <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>4. Contenido del Usuario</h2>
          <p>Usted conserva todos los derechos sobre los documentos que sube. Al subir contenido, usted:</p>
          <ul>
            <li>Garantiza que tiene el derecho legal de compartir el contenido</li>
            <li>Otorga una licencia no exclusiva para almacenar y distribuir su contenido a través de la plataforma</li>
            <li>Acepta que otros usuarios puedan descargar y utilizar su contenido según las opciones de visibilidad que seleccione</li>
            <li>Es responsable de respetar los derechos de autor y propiedad intelectual de terceros</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>5. Uso Aceptable</h2>
          <p>Está prohibido utilizar el servicio para:</p>
          <ul>
            <li>Subir contenido ilegal, ofensivo, difamatorio o que viole derechos de terceros</li>
            <li>Compartir material protegido por derechos de autor sin autorización</li>
            <li>Realizar actividades fraudulentas o engañosas</li>
            <li>Interferir con el funcionamiento del servicio o acceder a áreas restringidas</li>
            <li>Recopilar información de otros usuarios sin su consentimiento</li>
            <li>Utilizar el servicio para fines comerciales no autorizados</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>6. Propiedad Intelectual</h2>
          <p>El servicio, incluyendo su diseño, funcionalidades y contenido propio, está protegido por leyes de propiedad intelectual. Usted no puede:</p>
          <ul>
            <li>Copiar, modificar o distribuir el servicio sin autorización</li>
            <li>Utilizar nuestras marcas o logotipos sin permiso</li>
            <li>Realizar ingeniería inversa o intentar extraer el código fuente</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>7. Limitación de Responsabilidad</h2>
          <p>El servicio se proporciona "tal cual" y "según disponibilidad". No garantizamos:</p>
          <ul>
            <li>La exactitud, integridad o utilidad del contenido subido por los usuarios</li>
            <li>La disponibilidad ininterrumpida del servicio</li>
            <li>La ausencia de errores o virus en el contenido descargado</li>
          </ul>
          <p>No seremos responsables de daños indirectos, incidentales o consecuentes derivados del uso del servicio.</p>
        </section>

        <section class="terms-section">
          <h2>8. Modificaciones del Servicio</h2>
          <p>Nos reservamos el derecho de:</p>
          <ul>
            <li>Modificar, suspender o discontinuar cualquier aspecto del servicio en cualquier momento</li>
            <li>Actualizar estos Términos de Uso periódicamente</li>
            <li>Eliminar contenido que viole estos términos sin previo aviso</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>9. Terminación</h2>
          <p>Podemos suspender o terminar su acceso al servicio si:</p>
          <ul>
            <li>Viola estos Términos de Uso</li>
            <li>Utiliza el servicio de manera fraudulenta o ilegal</li>
            <li>No utiliza su cuenta durante un período prolongado</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>10. Contacto</h2>
          <p>Si tiene preguntas sobre estos Términos de Uso, puede contactarnos a través de la sección de Contacto disponible en la plataforma.</p>
        </section>
      </div>
    </el-card>
  </div>
</template>

<script setup>
</script>

<style scoped>
.terminos-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.terms-card {
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

.terms-content {
  padding: 20px 0;
}

.terms-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.terms-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.terms-section h2 {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.terms-section p {
  font-size: 16px;
  line-height: 1.7;
  color: #4b5563;
  margin: 0 0 12px 0;
}

.terms-section ul {
  margin: 12px 0;
  padding-left: 24px;
}

.terms-section li {
  font-size: 16px;
  line-height: 1.7;
  color: #4b5563;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .terminos-view {
    padding: 20px 16px;
  }

  .card-header h1 {
    font-size: 24px;
  }

  .terms-section h2 {
    font-size: 20px;
  }

  .terms-section p,
  .terms-section li {
    font-size: 15px;
  }
}
</style>

