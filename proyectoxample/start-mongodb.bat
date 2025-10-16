@echo off
echo ================================================
echo    INICIANDO SERVIDOR MONGODB
echo ================================================
echo.

REM Verificar si MongoDB está instalado
if exist "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" (
    set MONGODB_PATH="C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
) else if exist "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" (
    set MONGODB_PATH="C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
) else if exist "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" (
    set MONGODB_PATH="C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
) else (
    echo ERROR: MongoDB no encontrado en las ubicaciones estándar.
    echo.
    echo Buscando MongoDB en el sistema...
    where mongod >nul 2>&1
    if %errorlevel% == 0 (
        set MONGODB_PATH=mongod
    ) else (
        echo.
        echo MongoDB no está instalado o no está en el PATH.
        echo.
        echo Opciones:
        echo 1. Ejecutar install-mongodb.bat para instalar MongoDB localmente
        echo 2. Usar MongoDB Atlas (cloud) - ver setup-mongodb-atlas.md
        echo.
        pause
        exit /b 1
    )
)

REM Crear directorio de datos si no existe
if not exist "C:\data\db" (
    echo Creando directorio de datos...
    mkdir "C:\data\db"
)

REM Crear directorio de logs si no existe
if not exist "C:\data\log" (
    echo Creando directorio de logs...
    mkdir "C:\data\log"
)

echo.
echo Iniciando MongoDB...
echo Ruta: %MONGODB_PATH%
echo Directorio de datos: C:\data\db
echo Directorio de logs: C:\data\log
echo.
echo Para detener MongoDB, presiona Ctrl+C
echo.

REM Iniciar MongoDB
%MONGODB_PATH% --dbpath C:\data\db --logpath C:\data\log\mongod.log --install --serviceName MongoDB

echo.
echo MongoDB iniciado como servicio.
echo.
echo Para verificar el estado:
echo net start MongoDB
echo.
echo Para detener MongoDB:
echo net stop MongoDB
echo.

pause
