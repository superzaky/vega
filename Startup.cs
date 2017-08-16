using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Vega.Persistence;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Vega.Core;
using Vega.Core.Models;
using Vega.Controllers;

namespace WebApplicationBasic
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        //IServiceCollection is een container voor alle dependencies  in onze applicatie.
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<PhotoSettings>(Configuration.GetSection("PhotoSettings"));

            services.AddScoped<IVehicleRepository, VehicleRepository>();
            services.AddScoped<IPhotoRepository, PhotoRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            /*We want to use AddTransient because with our photoservice we don't have anything in the memory that we want to reuse in the context of request.*/
            services.AddTransient<IPhotoService, PhotoService>();
            /*In the future when we provide an implementation of this interface for Azure we'll register this interface and it's implementation conditionally
            based on the current enviroment. So if you're in the development environment we're gonna use filesystem for the storage, if we are in the production
            environment we are gonna use Azure for the storage. */
            services.AddTransient<IPhotoStorage, FileSystemPhotoStorage>();

            services.AddAutoMapper();
            //options => options.UseSqlServer("...") is een lambda expressie in C#.
            services.AddDbContext<VegaDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("Default")));
            // services.AddAuthorization(options => {
            //     options.AddPolicy(Policies.RequireAdminRole, policy => policy.RequireClaim("https://vega.com/roles", "Admin"));
            // });
            
            // Add framework services.
            //oftewel hier worden dependencies toegevoegd/geregistreerd bijv. services.AddMvc();
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            Console.WriteLine("is het dev?");
            Console.WriteLine(env.EnvironmentName);

            if (env.IsDevelopment())
            {
                //we toevoegen hier een paar middleware
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            var options = new JwtBearerOptions
            {
                //this determines who these tokens are for
                Audience = "https://api.vega.com",
                //the party that is generating authentication tokens
                Authority = "https://vegaproject3.auth0.com/"
            };
            //we're installing a middleware to verify json web tokens passed with the request
            app.UseJwtBearerAuthentication(options);

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
