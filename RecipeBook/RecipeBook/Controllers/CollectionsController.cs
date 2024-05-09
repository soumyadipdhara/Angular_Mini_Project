using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeBook.Data;
using RecipeBook.Models;

namespace RecipeBook.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CollectionsController : ControllerBase
    {
        private readonly RecipeBookDbContext _context;

        public CollectionsController(RecipeBookDbContext context)
        {
            _context = context;
        }

        // GET: api/Collections
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Collection>>> GetCollections()
        {
            return await _context.Collections.ToListAsync();
        }

        // GET: api/Collections/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Collection>> GetCollection(int id)
        {
            var collection = await _context.Collections.FindAsync(id);

            if (collection == null)
            {
                return NotFound();
            }

            return collection;
        }

        // PUT: api/Collections/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCollection(int id, Collection collection)
        {
            if (id != collection.CollectionId)
            {
                return BadRequest();
            }

            _context.Entry(collection).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CollectionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Collections
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Collection>> PostCollection(Collection collection)
        {
            _context.Collections.Add(collection);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCollection", new { id = collection.CollectionId }, collection);
        }

        // DELETE: api/Collections/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCollection(int id)
        {
            var collection = await _context.Collections.FindAsync(id);
            if (collection == null)
            {
                return NotFound();
            }

            _context.Collections.Remove(collection);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // GET: api/Collections/Exists
        [HttpGet("Exists")]
        public async Task<ActionResult<bool>> CheckRecipeExistsForUser(int recipeId, int userId)
        {
            var existingRecipe = await _context.Collections
                .FirstOrDefaultAsync(c => c.RecipeId == recipeId && c.UserId == userId);

            if (existingRecipe != null)
            {
                return true; // Recipe exists for the user
            }
            else
            {
                return false; // Recipe does not exist for the user
            }
        }

        // GET: api/Collections/ByUser/{userId}
        [HttpGet("ByUser/{userId}")]
        public async Task<ActionResult<IEnumerable<Collection>>> GetCollectionsByUser(int userId)
        {
            var collections = await _context.Collections
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (collections == null || collections.Count == 0)
            {
                return NotFound("No collections found for the specified user.");
            }

            return collections;
        }


        private bool CollectionExists(int id)
        {
            return _context.Collections.Any(e => e.CollectionId == id);
        }
    }
}
