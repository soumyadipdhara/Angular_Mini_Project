using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace RecipeBook.Models
{
    public class Collection
    {
        [Key]
        public int CollectionId { get; set; }
        public int RecipeId { get; set; }
        public int UserId { get; set; }
    }
}
