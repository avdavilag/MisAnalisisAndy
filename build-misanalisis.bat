@echo off
rem ESTE COMANDO QUITA EL ERROR EN NODE V18
set NODE_OPTIONS=--openssl-legacy-provider
rem BORRAR CARPETA www
rd /s /q "www"
ECHO --CARPETA www ELIMINADA--
rem EJECUCION DEL BUILD
start cmd /c "ionic build --prod --outputHashing=all --release --base-href ./"
ECHO --EJECUTANDO IONIC BUILD--
ECHO ESPERE...
:WAIT_LOOP
tasklist /fi "imagename eq cmd.exe" | find /i "ionic build --prod" > nul
if not errorlevel 1 goto WAIT_LOOP
:CHECK_FOLDER
if not exist "www" (
    ping -n 5 127.0.0.1 > nul
	ECHO Comprobando carpeta wwww...
    goto CHECK_FOLDER
)
ECHO --------------------
ECHO FINALIZADO EL BUILD
ECHO ---VERSIONAMIENTO---
ECHO ---(Asegurese que es la misma version de src/app/staticVars.ts)---
set /p entrada1="Ingrese la version misAnalisis: "
set /p entrada2="Ingresa el comentario de esta version: "
set /p entrada3="Variables config.json para esta version cuales?(Enter 'no'): "
set /p entrada4="Cambios en cs-graphql si-no?(Enter 'no'):"
set /p entrada5="Cambios en cs-intra si-no?(Enter 'no'):"
set /p entrada6="Otro cambio? especifique(Enter 'no'):"
if "%entrada1%"=="" set entrada1="N/A"
if "%entrada2%"=="" set entrada2="N/A"
if "%entrada3%"=="" set entrada3="no"
if "%entrada4%"=="" set entrada4="no"
if "%entrada5%"=="" set entrada5="no"
if "%entrada6%"=="" set entrada6="no"
echo %entrada1%	%entrada2%	%entrada3%	%entrada4%	%entrada5%	%entrada6% >> versiones.txt
ECHO FINALIZADO REVISE versiones.txt GRACIAS :) 
pause   