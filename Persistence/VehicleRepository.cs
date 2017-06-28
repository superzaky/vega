﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Vega.Core;
using Vega.Core.Models;

namespace Vega.Persistence
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly VegaDbContext context;
        public VehicleRepository(VegaDbContext context)
        {
            this.context = context;
        }

        //since in most scenarios we need to include the related objects we give includeRelated a default value of true 
        public async Task<Vehicle> GetVehicle(int id, bool includeRelated = true)
        {

            if (!includeRelated)
                return await context.Vehicles.FindAsync(id);

            return await context.Vehicles
                .Include(v => v.Features)
                    .ThenInclude(vf => vf.Feature)
                .Include(v => v.Model)
                    .ThenInclude(m => m.Make)
                .SingleOrDefaultAsync(v => v.Id == id);
        }

        public void Add(Vehicle vehicle)
        {
            context.Vehicles.Add(vehicle);
        }

        public void Remove(Vehicle vehicle)
        {
            context.Remove(vehicle);
        }

        public async Task<IEnumerable<Vehicle>> GetVehicles(VehicleQuery queryObj)
        {
            var query = context.Vehicles
              .Include(v => v.Model)
                .ThenInclude(m => m.Make)
              .Include(v => v.Features)
                .ThenInclude(vf => vf.Feature)
              .AsQueryable();

            if (queryObj.MakeId.HasValue)
                query = query.Where(v => v.Model.MakeId == queryObj.MakeId.Value);

            if (queryObj.ModelId.HasValue)
                query = query.Where(v => v.ModelId == queryObj.ModelId.Value);

            //Een Dictionary in C# is hetzelfde als een map in Java. Dus de keys zijn strings en de values zijn Expressions.
            var columnsMap = new Dictionary<string, Expression<Func<Vehicle, object>>>()
            {
                ["make"] = v => v.Model.Make.Name,
                ["model"] = v => v.Model.Name,
                ["contactName"] = v => v.ContactName,
                ["id"] = v => v.Id
            };

            if (queryObj.IsSortAscending)
                query.OrderBy(columnsMap[queryObj.SortBy]);
            else 
                query.OrderByDescending(columnsMap[queryObj.SortBy]);

            return await query.ToListAsync();
        }
    }
}
