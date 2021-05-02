# Money-Manager

### Backend
+ Java 16 + Spring Boot 
+ Made as a REST API but with session and Google OAuth2 authorization
+ Built frontend is in jar resources, single html page will be opened by Thymeleaf (Spring MVC)

### Frontend
+ TypeScript + React

### Instructions
#### Build and run
+ Call `mvn clean install` at root of the project
+ Built result (jar file) will be in 'target' directory at root of the project
+ Change GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env to actual
+ Call `java -jar money-manager-<version>.jar` to start the application
+ Optionally. It is possibly to build exe installer for windows, just run pack_exe_installer.bat after build
+ Optionally. Call `npm start` at frontend directory to start frontend dev server