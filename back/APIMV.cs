using Microsoft.AspNetCore.Mvc;
using Npgsql;
using Dapper;
using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MyTestController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public MyTestController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("test-connection")]
        public async Task<IActionResult> TestConnection()
        {
            // Retrieve the connection string from your config
            string connectionString = _configuration.GetConnectionString("PostgreSqlConnection");
            
            try
            {
                // Create and open connection
                await using var connection = new NpgsqlConnection(connectionString);
                await connection.OpenAsync();

                // Example query (table "users" for demonstration)
                string sql = "SELECT id, username FROM users LIMIT 5";

                await using var command = new NpgsqlCommand(sql, connection);

                // Execute reader
                await using var reader = await command.ExecuteReaderAsync();
                
                var results = new List<object>();

                while (await reader.ReadAsync())
                {
                    // Access by column index or name
                    var item = new 
                    {
                        Id = reader["id"],
                        Username = reader["username"]
                    };
                    results.Add(item);
                }

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database connection failed: {ex.Message}");
            }
        }
    }
}


public class Score
{
    public int Id { get; set; }
    public string Pseudo { get; set; }
    public int Score { get; set; }
}