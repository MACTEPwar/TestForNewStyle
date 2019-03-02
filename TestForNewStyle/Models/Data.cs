using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestForNewStyle.Models
{
    public enum ExpenseStatusCode
    {
        DALAYED = 0,
        HOLD = 1,
        CANCELED = 2
    }

    [Table(name:"Client")]
    public class Client
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get;set;}
    }

    [Table(name:"Product")]
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
    }

    [Table(name: "Expense")]
    public class Expense
    {
        [Key]
        public int Id { get; set; }
        public DateTime Date { get; set; }
        [ForeignKey("Client")]
        public int ClientId { get; set; }
        public Client Client { get; set; }
        public int Sum { get; set; }
        public DateTime ExpenseCreated { get; set; }
        public ExpenseStatusCode ExpenseStatus { get; set; }
        
        public DateTime? TimeSpeadingExpense { get; set; }

        public ICollection<Content> Contents { get; set; }

    }

    [Table(name: "Content")]
    public class Content
    {
        public int Id { get; set; }
        public string Code { get; set; }
        //[ForeignKey("Expense")]
        public int ExpenseId { get; set; }
        //public Expense Expense { get; set; }
        [ForeignKey("Product")]
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public double Count { get; set; }
        public double Price { get; set; }
        public int Sum { get; set; }
    }

    public class ListContents
    {
        public List<Content> contents { get; set; }
    }
}
