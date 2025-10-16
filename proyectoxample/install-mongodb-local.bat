@echo off
echo ================================================
echo    INSTALACION DE MONGODB LOCAL
echo ================================================
echo.

echo Descargando e instalando MongoDB...
echo.

REM Crear directorio temporal
if not exist "C:\temp" mkdir "C:\temp"

echo Descargando MongoDB Community Server...
powershell -Command "& {Invoke-WebRequest -Uri 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.6-signed.msi' -OutFile 'C:\temp\mongodb-installer.msi'}"

if exist "C:\temp\mongodb-installer.msi" (
    echo.
    echo Instalando MongoDB...
    msiexec /i "C:\temp\mongodb-installer.msi" /quiet /norestart
    
    echo.
    echo Configurando MongoDB...
    
    REM Crear directorio de datos
    if not exist "C:\data\db" mkdir "C:\data\db"
    if not exist "C:\data\log" mkdir "C:\data\log"
    
    REM Agregar al PATH del sistema
    setx PATH "%PATH%;C:\Program Files\MongoDB\Server\7.0\bin" /M
    
    echo.
    echo MongoDB instalado exitosamente!
    echo.
    echo Reinicia tu terminal y ejecuta: start-mongodb-local.bat
    echo.
    
    del "C:\temp\mongodb-installer.msi"
) else (
    echo.
    echo ERROR: No se pudo descargar MongoDB.
    echo Usa la Opcion 1 (MongoDB Atlas) que es mas facil.
    echo.
)

pause
