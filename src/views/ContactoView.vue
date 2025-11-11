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

.contacto-card:hover {
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.contacto-header {
  text-align: center;
  margin-bottom: 48px;
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

.contacto-title {
  margin: 0 0 12px 0;
  font-size: 42px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -1px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
  line-height: 1.2;
}

.contacto-subtitle {
  margin: 0;
  font-size: 18px;
  color: #666666;
  font-weight: 400;
}

.qr-section {
  margin-bottom: 48px;
  animation: qrFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
}

@keyframes qrFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: qrCardIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.qr-card:nth-child(1) { animation-delay: 0.1s; }
.qr-card:nth-child(2) { animation-delay: 0.2s; }
.qr-card:nth-child(3) { animation-delay: 0.3s; }
.qr-card:nth-child(4) { animation-delay: 0.4s; }

@keyframes qrCardIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.qr-card:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.12);
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.qr-card:hover .qr-wrapper {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.qr-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.qr-card:hover .qr-image {
  transform: scale(1.05);
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
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.qr-card:hover .qr-overlay {
  opacity: 1;
}

.qr-icon {
  font-size: 48px;
  color: white;
  transform: scale(0.8);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.qr-card:hover .qr-icon {
  transform: scale(1);
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
  letter-spacing: -0.3px;
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.instagram-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.instagram-button:hover::before {
  width: 300px;
  height: 300px;
}

.instagram-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(188, 24, 136, 0.3);
}

.instagram-button:active {
  transform: translateY(0) scale(0.98);
}

.contact-info {
  animation: infoFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both;
}

@keyframes infoFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-card {
  text-align: center;
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
}

.info-card p {
  margin: 0;
  font-size: 16px;
  color: #666666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .contacto-container {
    padding: 20px 16px;
  }

  .contacto-card {
    padding: 24px;
  }

  .contacto-title {
    font-size: 32px;
  }

  .qr-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .qr-wrapper {
    width: 200px;
    height: 200px;
  }
}
</style>

