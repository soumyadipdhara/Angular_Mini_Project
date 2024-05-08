using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace RecipeBook.Models
{
    public class Recipe
    {
        [Key]
        public int RecipeId { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public int LikeCount { get; set; }
        public int DislikeCount { get; set; }
        public int ViewsCount { get; set; }
        public int Cookingtime { get; set; }
        public int Nutrition { get; set; }
        public int UserId { get; set; }
    }
}
