using System.ComponentModel.DataAnnotations;

namespace RecipeBook.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
