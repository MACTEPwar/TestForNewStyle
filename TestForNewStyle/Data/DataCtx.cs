using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestForNewStyle.Models;

namespace TestForNewStyle.Data
{
    public class DataCtx :DbContext
    {
        public DataCtx(DbContextOptions<DataCtx> options) : base (options)
        {

        }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Content> Contents { get; set; }
    }
}
