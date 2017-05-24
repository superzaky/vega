using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Vega.Models;
using Vega.Persistence;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Vega.Controllers.Resources;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Vega.Controllers
{
    public class MakesController : Controller
    {
        private readonly VegaDbContext context;
        private readonly IMapper mapper;

        public MakesController(VegaDbContext context, IMapper mapper)
        {
            this.mapper = mapper;
            this.context = context;
        }

        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("/api/makes")]
        public async Task <IEnumerable<MakeResource>> GetMakes()
        {
            var makes = await context.Makes.Include(m => m.Models).ToListAsync();

            return mapper.Map<List<Make>, List<MakeResource>>(makes);
        }
    }
}
