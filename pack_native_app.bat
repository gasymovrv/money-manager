@rd /s /q "installer"

jpackage ^
--name money-manager ^
--input target ^
--win-console ^
--win-dir-chooser ^
--win-shortcut ^
--win-per-user-install ^
--main-jar money-manager-0.0.1.jar ^
--type exe ^
--java-options "-Duser.timezone=UTC -Dspring.config.import=optional:file:app/.env[.properties]" ^
--app-version 0.0.1 ^
--dest installer ^
--vendor R.Gasymov

pause