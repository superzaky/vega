using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Vega.Core.Models
{
    public class Filter
    {
        //a nullable integer called "MakeId", because it's optional.
        public int? MakeId { get; set; }
        public int? ModelId { get; set; }
    }
}
