@echo off
echo ================================================
echo    INSTALACION DE MONGODB PARA WINDOWS
echo ================================================
echo.

echo Descargando MongoDB Community Server...
echo.

REM Crear directorio temporal
if not exist "C:\temp" mkdir "C:\temp"

REM Descargar MongoDB (versión más reciente)
echo Descargando MongoDB desde: https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-6.0.7-signed.msi
echo.
echo NOTA: Este proceso puede tomar varios minutos...
echo.

REM Usar PowerShell para descargar
powershell -Command "& {Invoke-WebRequest -Uri 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-6.0.7-signed.msi' -OutFile 'C:\temp\mongodb-installer.msi'}"

if exist "C:\temp\mongodb-installer.msi" (
    echo.
    echo Descarga completada. Instalando MongoDB...
    echo.
    
    REM Instalar MongoDB silenciosamente
    msiexec /i "C:\temp\mongodb-installer.msi" /quiet /norestart
    
    echo.
    echo MongoDB instalado. Configurando...
    echo.
    
    REM Crear directorio de datos
    if not exist "C:\data\db" mkdir "C:\data\db"
    
    REM Crear directorio de logs
    if not exist "C:\data\log" mkdir "C:\data\log"
    
    echo.
    echo ================================================
    echo    MONGODB INSTALADO EXITOSAMENTE
    echo ================================================
    echo.
    echo Para iniciar MongoDB, ejecuta:
    echo "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
    echo.
    echo O usa el script: start-mongodb.bat
    echo.
    
    REM Limpiar archivo temporal
    del "C:\temp\mongodb-installer.msi"
    
) else (
    echo.
    echo ERROR: No se pudo descargar MongoDB.
    echo Por favor, descarga manualmente desde:
    echo https://www.mongodb.com/try/download/community
    echo.
)

pause
