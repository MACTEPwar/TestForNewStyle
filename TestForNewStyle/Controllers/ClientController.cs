using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TestForNewStyle.Data;
using TestForNewStyle.Models;

namespace TestForNewStyle.Controllers
{
    public class ClientController : Controller
    {

        private DataCtx _context;

        public ClientController(DataCtx ctx)
        {
            _context = ctx;
        }

        public IActionResult Index()
        {
            return View(_context.Clients.ToList());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody]Client client)
        {
            if (ModelState.IsValid)
            {
                _context.Clients.Add(client);
                await _context.SaveChangesAsync();
                return Ok(client);
            }
            else
            {
                return BadRequest("Модель заполнена не верно.");
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody]Client client)
        {
            if (ModelState.IsValid)
            {
                Client c = _context.Clients.FirstOrDefault(x => x.Id == id);
                if (c != null)
                {
                    c.Name = client.Name;
                    await _context.SaveChangesAsync();
                    return Ok(c);
                }
                else
                {
                    return BadRequest($"Клиент с id = {id} не найден.");
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
            Client c = _context.Clients.FirstOrDefault(x => x.Id == id);
            if (c != null)
            {
                _context.Clients.Remove(c);
                await _context.SaveChangesAsync();
                return Ok();
            }
            else
            {
                return BadRequest($"Клиент с id = {id} не найден.");
            }
        }
    }
}