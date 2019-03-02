using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestForNewStyle.Models
{
    public class Repository
    {
        public static void Insert<TEntity>(TEntity entity, DbContext context) where TEntity : class
        {
            // Настройки контекста
            //context.Database.Log = (s => System.Diagnostics.Debug.WriteLine(s));

            context.Entry(entity).State = EntityState.Added;
            context.SaveChanges();
        }

        /// <summary>
        /// Запись нескольких полей в БД
        /// </summary>
        public static void Inserts<TEntity>(IEnumerable<TEntity> entities, DbContext context) where TEntity : class
        {
            // Отключаем отслеживание и проверку изменений для оптимизации вставки множества полей
            //context.Configuration.AutoDetectChangesEnabled = false;
            //context.Configuration.ValidateOnSaveEnabled = false;

            //context.Database.Log = (s => System.Diagnostics.Debug.WriteLine(s));


            foreach (TEntity entity in entities)
                context.Entry(entity).State = EntityState.Added;
            context.SaveChanges();

            //context.Configuration.AutoDetectChangesEnabled = true;
            //context.Configuration.ValidateOnSaveEnabled = true;
        }
    }
}
