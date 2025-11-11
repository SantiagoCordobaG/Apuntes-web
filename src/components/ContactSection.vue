<template>
  <div class="contacto-container">
    <div class="contacto-card">
      <div class="contacto-header">
        <h1 class="contacto-title">Contáctanos</h1>
        <p class="contacto-subtitle">Síguenos en Instagram y escanea nuestros códigos QR</p>
      </div>

      <div class="qr-section">
        <div class="qr-grid">
          <div class="qr-card" v-for="(account, index) in instagramAccounts" :key="index">
            <div class="qr-wrapper">
              <img :src="account.qrImage" :alt="`QR Code ${account.username}`" class="qr-image" />
              <div class="qr-overlay">
                <el-icon class="qr-icon"><PictureRounded /></el-icon>
              </div>
            </div>
            <div class="qr-info">
              <h3 class="qr-username">{{ account.username }}</h3>
              <el-button 
                type="primary" 
                class="instagram-button"
                @click="openInstagram(account.url)"
              >
                <el-icon><Connection /></el-icon>
                Seguir en Instagram
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="contact-info">
        <div class="info-card">
          <el-icon class="info-icon"><Message /></el-icon>
          <h3>¿Tienes preguntas?</h3>
          <p>Escanea cualquiera de nuestros códigos QR o visita nuestros perfiles de Instagram para más información.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PictureRounded, Connection, Message } from '@element-plus/icons-vue';
import { ElButton, ElIcon, ElMessage } from 'element-plus';

const instagramAccounts = [
  {
    username: '333_ANTH',
    url: 'https://www.instagram.com/333_anth/',
    qrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.instagram.com/333_anth/'
  },
  {
    username: 'A.AARATH',
    url: 'https://www.instagram.com/a.aarath/',
    qrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.instagram.com/a.aarath/'
  },
  {
    username: 'HEY_TIAGOOOO',
    url: 'https://www.instagram.com/hey_tiagoooo/',
    qrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.instagram.com/hey_tiagoooo/'
  },
  {
    username: 'ALEXMAYA_11',
    url: 'https://www.instagram.com/alexmaya_11/',
    qrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.instagram.com/alexmaya_11/'
  }
];

const openInstagram = (url) => {
  window.open(url, '_blank');
  ElMessage.success('Redirigiendo a Instagram...');
};
</script>

<style scoped>
.contacto-container {
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

.contacto-card {
  width: 100%;
  max-width: 1200px;
  padding: 48px;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.contacto-header {
  text-align: center;
  margin-bottom: 48px;
}

.contacto-title {
  margin: 0 0 12px 0;
  font-size: 42px;
  font-weight: 700;
  color: #1a1a1a;
}

.contacto-subtitle {
  margin: 0;
  font-size: 18px;
  color: #666666;
}

.qr-section {
  margin-bottom: 48px;
}

.qr-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.qr-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.qr-wrapper {
  position: relative;
  width: 240px;
  height: 240px;
  margin-bottom: 24px;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  border: 2px solid rgba(0, 0, 0, 0.08);
}

.qr-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.qr-card:hover .qr-overlay {
  opacity: 1;
}

.qr-icon {
  font-size: 48px;
  color: white;
}

.qr-info {
  text-align: center;
  width: 100%;
}

.qr-username {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.instagram-button {
  width: 100%;
  height: 48px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  border: none;
  color: white;
}

.contact-info {
  text-align: center;
}

.info-card {
  padding: 32px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.info-icon {
  font-size: 48px;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.info-card h3 {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.info-card p {
  margin: 0;
  font-size: 16px;
  color: #666666;
  line-height: 1.6;
}
</style>

