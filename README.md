Vega
----------------
Vega is a vehicle dealer app made with .NET Core, Entity Framework Core and Angular 4. 

## To run the application:
    npm install
    dotnet restore
    dotnet user-secrets set ConnectionStrings:Default "<YOUR CONNETION STRING>"
    webpack --config webpack.config.vendor.js
    webpack 
    dotnet ef database update
    dotnet watch run 
