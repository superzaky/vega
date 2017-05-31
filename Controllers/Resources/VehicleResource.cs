using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.ObjectModel;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Vega.Controllers.Resources
{
    public class VehicleResource : Controller
    {
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        public int Id { get; set; }
        public ModelResource Model { get; set; }
        public MakeResource Make { get; set; }
        public bool IsRegistered { get; set; }
        public ContactResource Contact { get; set; }

        public DateTime LastUpdate { get; set; }
        public ICollection<FeatureResource> Features { get; set; }

        public VehicleResource()
        {
            Features = new Collection<FeatureResource>();
        }
    }
}
