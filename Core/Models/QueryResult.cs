using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Vega.Core.Models
{
    public class QueryResult<T>
    {
        //the automatic property TotalItems gets for example respresented as " "totalItems": 11 " in the GET Vehicles response.
        public int TotalItems { get; set; }
        public IEnumerable<T> Items { get; set; }
    }
}
