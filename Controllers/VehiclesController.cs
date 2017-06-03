using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Vega.Controllers.Resources;
using AutoMapper;
using Vega.Models;
using Vega.Persistence;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Vega.Controllers
{
    [Route("api/vehicles")]
    public class VehiclesController : Controller
    {
        private readonly IMapper mapper;
        private readonly VegaDbContext context;
        private readonly IVehicleRepository repository;
        public VehiclesController(IMapper mapper, VegaDbContext context, IVehicleRepository repository)
        {
            this.repository = repository;
            this.context = context;
            this.mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromBody] SaveVehicleResource vehicleResource)
        {
            if (!ModelState.IsValid)
                //it's not valid because it violates the Data Annotations
                return BadRequest(ModelState);

            /*For this application we see the below code as an overkill, because the client of this API is our vehicle form that we have built with Angular 2.
             So technically we should not send an invalid modelId. Because what the user selects from a dropdown list comes from the server. So the only way an invalid ID is 
             sent to the server is when a malicious user/hacker tries to manipulate this API. And in that case when they are in the production environment they are just 
             gonna get an internal server error without the exception details. */
            //var model = await context.Models.FindAsync(vehicleResource.ModelId);
            //if(model == null)
            //{
            //    ModelState.AddModelError("ModelId", "Invalid modelId.");
            //    return BadRequest(ModelState);
            //}

            var vehicle = mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource);
            vehicle.LastUpdate = DateTime.Now;

            context.Vehicles.Add(vehicle);
            await context.SaveChangesAsync();

            /*Here below we are not gonna store this object into vehicle.Model. It's not necessary, because once this Model object is loaded in the context Entity Framework will
             internally create this association. */
            //await context.Models.Include(m => m.Make).SingleOrDefaultAsync(m => m.Id == vehicle.ModelId);

            vehicle = await repository.GetVehicle(vehicle.Id);

            var result = mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] SaveVehicleResource vehicleResource)
        {
            if (!ModelState.IsValid)
                //it's not valid because it violates the Data Annotations
                return BadRequest(ModelState);

            var vehicle = await repository.GetVehicle(id);

            if (vehicle == null)
                return NotFound();

            mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource, vehicle);
            vehicle.LastUpdate = DateTime.Now;

            await context.SaveChangesAsync();

            var result = mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await context.Vehicles.FindAsync(id);

            if (vehicle == null)
                return NotFound();

            context.Remove(vehicle);
            await context.SaveChangesAsync();

            return Ok(id);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVehicle(int id)
        {
            var vehicle = await repository.GetVehicle(id);

            if (vehicle == null)
                return NotFound();

            var vehicleResource = mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(vehicleResource);
        }
    }
}
