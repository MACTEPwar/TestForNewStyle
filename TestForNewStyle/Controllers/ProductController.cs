using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TestForNewStyle.Data;
using TestForNewStyle.Models;

namespace TestForNewStyle.Controllers
{
    public class ProductController : Controller
    {
        private DataCtx _context;

        public ProductController(DataCtx ctx)
        {
            _context = ctx;
        }

        public IActionResult Index()
        {
            return View(_context.Products.ToList());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody]Product product)
        {
            if (ModelState.IsValid)
            {
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return Ok(product);
            }
            return BadRequest("Модель заполнена не верно.");            
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id,[FromBody]Product product)
        {
            if (ModelState.IsValid)
            {
                Product p = _context.Products.FirstOrDefault(x => x.Id == id);
                if (p != null)
                {
                    p.Title = product.Title;
                    await _context.SaveChangesAsync();
                    return Ok(p);
                }
                else
                {
                    return BadRequest($"Товар с id = {id} не найден.");
                }
            }
            else
            {
                return BadRequest("Модель заполнена не верно.");
            }
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            if (ModelState.IsValid)
            {
                Product p = _context.Products.FirstOrDefault(x => x.Id == id);
                if (p != null)
                {
                    _context.Products.Remove(p);
                    await _context.SaveChangesAsync();
                    return Ok();
                }
                else
                {
                    return BadRequest($"Товар с id = {id} не найден.");
                }
            }
            else
            {
                return BadRequest("Модель заполнена не верно.");
            }
        }
    }
}