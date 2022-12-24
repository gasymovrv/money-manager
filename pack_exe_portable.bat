@rd /s /q "portable"

jpackage ^
--name money-manager ^
--input target ^
--win-console ^
--main-jar money-manager-1.0.0.jar ^
--type app-image ^
--java-options "-Duser.timezone=UTC -Dspring.config.import=optional:file:app/.env[.properties]" ^
--app-version 1.0.0 ^
--dest portable ^
--vendor R.Gasymov ^
--icon logo.ico

pause
