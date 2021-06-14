# Money-Manager
The main purpose of the application is to manage income, expenses and savings. 
[Demo](https://gasymovrv-money-manager.herokuapp.com/)

### Backend
+ Java 16, Spring Boot
+ Authentication with Google OAuth2
+ Application has made as a REST API but with session
+ Built frontend is in jar resources, single html page will be opened by Thymeleaf (Spring MVC)

### Frontend
+ TypeScript, React 17.0.3, Material-UI 4.11.1
+ No class components, only functional ones with React Hooks
+ Using Material-UI components for styling

### Instructions
#### Build and run
+ Change GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env (or as environment variables) to actual
+ Call `mvn clean install` at root of the project to build the application
+ Built result (jar file) will be in 'target' directory at root of the project
+ Call `java -Duser.timezone=UTC -jar money-manager-<version>.jar` to start the application
+ Optionally. It is possibly to build exe installer for Windows, just run pack_exe_installer.bat after build
+ Optionally. Call `npm start` at frontend directory to start frontend dev server