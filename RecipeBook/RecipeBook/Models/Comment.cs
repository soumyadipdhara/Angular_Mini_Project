using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;

namespace RecipeBook.Models
{
    public class Comment
    {
        [Key]
        public int CommentId { get; set; }
        public string CommentDesc { get; set; }
        public int UserId { get; set; }
        public int RecipeId { get; set; }
    }
}
