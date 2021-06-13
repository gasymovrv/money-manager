@rd /s /q "installer"

jpackage ^
--name money-manager ^
--input target ^
--win-console ^
--win-dir-chooser ^
--win-shortcut ^
--win-per-user-install ^
--main-jar money-manager-1.0.0.jar ^
--type exe ^
--java-options "-Duser.timezone=UTC -Dspring.config.import=optional:file:app/.env[.properties]" ^
--app-version 1.0.0 ^
--dest installer ^
--vendor R.Gasymov

pause