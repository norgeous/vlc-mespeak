@ECHO OFF
SET dirpath=%~dp0
SET ps1exec=%dirpath%ps1exec.bat
SET ps1script=%dirpath%tts.ps1
call %ps1exec% %ps1script%