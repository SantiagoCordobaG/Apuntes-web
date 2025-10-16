@echo off
echo ================================================
echo    CONFIGURACION RAPIDA CON MONGODB ATLAS
echo ================================================
echo.

echo 1. Ve a: https://www.mongodb.com/atlas
echo 2. Crea una cuenta GRATIS
echo 3. Crea un cluster M0 (gratis)
echo 4. Configura usuario: admin + contraseña
echo 5. Permite acceso desde cualquier IP (0.0.0.0/0)
echo 6. Copia la cadena de conexion
echo.

echo Presiona cualquier tecla cuando tengas la cadena de conexion...
pause >nul

echo.
echo Ahora vamos a configurar tu proyecto con MongoDB Atlas...
echo.

REM Crear archivo .env
echo MONGODB_URI=mongodb+srv://admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/documentos_db?retryWrites=true^&w=majority > .env
echo PORT=3001 >> .env
echo NODE_ENV=development >> .env
echo MAX_FILE_SIZE=10485760 >> .env
echo UPLOAD_PATH=./uploads >> .env

echo.
echo Archivo .env creado. Ahora edita la cadena de conexion:
echo.
echo 1. Abre el archivo .env
echo 2. Reemplaza TU_PASSWORD con tu contraseña real
echo 3. Reemplaza cluster0.xxxxx.mongodb.net con tu cluster real
echo.

start notepad .env

echo.
echo Presiona cualquier tecla cuando hayas actualizado el archivo .env...
pause >nul

echo.
echo ================================================
echo    CONTINUANDO CON LA CONFIGURACION...
echo ================================================

pause
