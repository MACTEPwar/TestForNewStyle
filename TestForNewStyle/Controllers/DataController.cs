using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestForNewStyle.Data;
using TestForNewStyle.Models;

namespace TestForNewStyle.Controllers
{
    public class DataController : Controller
    {
        private DataCtx ctx;

        public DataController(DataCtx _ctx)
        {
            ctx = _ctx;
        }

        Random r = new Random();
        [Route("[Controller]/AddData")]
        public async Task<IActionResult> AddData()
        {
            for (int i = 0; i < 10; i++)
            {
                await ctx.Clients.AddAsync(new Client() { Name = $"Клиент {i}" });
                await ctx.Products.AddAsync(new Product() { Title = $"Товар {i}" });
            }
            await ctx.SaveChangesAsync();

            List<Client> clients = await ctx.Clients.ToListAsync();
            for (int i = 0; i < 10; i++)
            {
                await ctx.Expenses.AddAsync(new Expense() { ClientId = clients[r.Next(0, clients.Count)].Id, Date = DateTime.Now, ExpenseCreated = DateTime.Now, ExpenseStatus = ExpenseStatusCode.DALAYED, Sum = 200, TimeSpeadingExpense = DateTime.Now });
            }
            await ctx.SaveChangesAsync();

            List<Expense> expenses = await ctx.Expenses.ToListAsync();
            List<Product> products = await ctx.Products.ToListAsync();
            for (int i = 0; i< expenses.Count; i++)
            {
                for (int j= 0; j < r.Next(1, 4); j++)
                {
                    await ctx.Contents.AddAsync(new Content() { Code = $"1023{i}{j}", Count = i, Price = i * 100, ExpenseId = expenses[i].Id, ProductId =  products[r.Next(0,products.Count)].Id, Sum = i * i * 100});
                }
            }
            await ctx.SaveChangesAsync();

            expenses = await ctx.Expenses.Include(x => x.Contents).ToListAsync();
            foreach(Expense e in expenses)
            {
                int sum = 0;
                foreach(Content c in e.Contents)
                {
                    sum += c.Sum;
                }
                e.Sum = sum;
            }
            await ctx.SaveChangesAsync();

            return Ok("Данные в БД добавлены!");
        }

        [Route("[Controller]/Clients")]
        public IActionResult GetClients()
        {
            return Ok(ctx.Clients.ToList());
        }

        [Route("[Controller]/Products")]
        public IActionResult GetProducts()
        {
            return Ok(ctx.Products.ToList());
        }
        
        [HttpGet]
        public IActionResult Index()
        {
            var res = ctx.Expenses.Include(e => e.Contents).ThenInclude(x => x.Product).Include(x => x.Client).ToList().OrderByDescending(x => x.Id);
            return View(model: res);
        }

        [HttpGet]
        [Route("[Controller]/{id}")]
        public IActionResult GetById(int id)
        {
            var res = ctx.Expenses.Include(e => e.Contents).ThenInclude(x => x.Product).Include(x => x.Client).FirstOrDefault(e => e.Id == id);
            if (res == null) return BadRequest("Указанный id не найден.");
            else return Ok(res);
        }

        [Route("[Controller]/Create")]
        public IActionResult Create()
        {
            ViewBag.clients = ctx.Clients.ToList();
            ViewBag.products = ctx.Products.ToList();
            return View();
        }

        [Route("[Controller]/Update/{id}")]
        [HttpGet]
        public async Task<IActionResult> Update(int id)
        {
            var exp = await ctx.Expenses.Include(e => e.Contents).ThenInclude(x => x.Product).Include(x => x.Client).FirstOrDefaultAsync(e => e.Id == id);
            if (exp != null)
            {
                ViewBag.clients = ctx.Clients.ToList();
                ViewBag.products = ctx.Products.ToList();
                return View(exp);
            }
            return Content("id не найден");
        }

        [Route("[Controller]/Expense/Update/{id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateExpense(int id, [FromBody]Expense expense)
        {
            if (ModelState.IsValid)
            {
                if (expense.ExpenseStatus == ExpenseStatusCode.HOLD) return Content("Расход уже проведен. Проведенные расходы нельзя редактировать.");
                Expense e = await ctx.Expenses.Where(x => x.Id == id).FirstOrDefaultAsync();
                if (e != null)
                {
                    e.Client = expense.Client;
                    e.ClientId = expense.ClientId;
                    e.Contents = expense.Contents;
                    e.Date = expense.Date;
                    e.ExpenseCreated = expense.ExpenseCreated;
                    e.ExpenseStatus = expense.ExpenseStatus;
                    e.Sum = expense.Sum;
                    e.TimeSpeadingExpense = expense.TimeSpeadingExpense;
                    await ctx.SaveChangesAsync();
                    return Ok(expense.Id);
                }
                else return Content($"id {id} не найден.");
            }
            else return Content("Модель заполнена не верно.");
        }

        [HttpPost]
        [Route("[Controller]/Expense/Create")]
        public async Task<IActionResult> CreateContents([FromBody]Expense expense)
        {
            if (ModelState.IsValid)
            {
                await ctx.Expenses.AddAsync(expense);
                await ctx.SaveChangesAsync();
                return Ok(expense.Id);
            }
            else
            {
                return Content("Модель заполнена не верно.");
            }
        }

        [HttpPut]
        [Route("[Controller]/Content/Update/{id}")]
        public async Task<IActionResult> UpdateContents(int id, [FromBody]Content content)
        {
            if (ModelState.IsValid)
            {
                Content c = await ctx.Contents.Where(x => x.Id == id).FirstOrDefaultAsync();
                if (c != null)
                {
                    c.Price = content.Price;
                    c.Code = content.Code;
                    c.Count = content.Count;
                    c.ProductId = content.ProductId;
                    c.Sum = content.Sum;
                    ctx.SaveChanges();
                    return Ok(c);
                }
                else return Content($"id {id} не найден.");
            }
            else return Content("Модель заполнена не верно.");

        }

        [HttpPost]
        [Route("[Controller]/Contents/Create")]
        public async Task<IActionResult> CreateContents([FromBody]ListContents contents)
        {
            foreach (Content c in contents.contents)
            {
                await ctx.Contents.AddAsync(c);
            }
            ctx.SaveChanges();
            return Ok();
        }

        [HttpPost]
        [Route("[Controller]/Content/Create")]
        public IActionResult CreateContents([FromBody]Content content)
        {
            content.Product = null;
            if (ModelState.IsValid)
            {
                ctx.Contents.Add(content);
                ctx.SaveChanges();
                return Ok(content);
            }
            else
            {
                return Content("Модель заполнена не верно.");
            }
        }

        [HttpDelete]
        [Route("[Controller]/Content/Delete/{id}")]
        public IActionResult DeleteContents(int id)
        {
            var delCont = ctx.Contents.FirstOrDefault(x => x.Id == id);
            if (delCont != null)
            {
                ctx.Contents.Remove(delCont);
                ctx.SaveChanges();
                return Ok();
            }
            else return Content($"id {id} не найден.");
        }

        [HttpDelete]
        [Route("[Controller]/Expense/Delete/{id}")]
        public IActionResult DeleteExpense(int id)
        {
            Expense exp = ctx.Expenses.Include(x => x.Contents).FirstOrDefault(x => x.Id == id);
            if (exp.ExpenseStatus == ExpenseStatusCode.HOLD) return BadRequest("");
            foreach (var c in exp.Contents.ToList())
            {
                DeleteContents(c.Id);
            }
            ctx.Expenses.Remove(exp);
            ctx.SaveChanges();
            return Ok();
        }
    }
}