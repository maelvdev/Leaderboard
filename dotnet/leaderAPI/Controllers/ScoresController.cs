using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Data;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("controller")]
    public class ScoresController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public ScoresController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpGet]
        public async Task<IActionResult> GetScores()
        {
            var scores = new List<object>();
            await _connection.OpenAsync();
            using (var cmd = new NpgsqlCommand("SELECT * FROM scores ORDER BY score DESC LIMIT 5", _connection))
            using (var reader = await cmd.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    scores.Add(new
                    {
                        Pseudo = reader["pseudo"],
                        Score = reader["score"]
                    });
                }
            }
            await _connection.CloseAsync();
            return Ok(scores);
        }

        [HttpPost]
        public async Task<IActionResult> AddScore([FromBody] dynamic body)
        {
            var pseudo = (string)body.pseudo;
            var score = (int)body.score;
            await _connection.OpenAsync();
            using (var cmd = new NpgsqlCommand("INSERT INTO scores (pseudo, score) VALUES (@p, @s)", _connection))
            {
                cmd.Parameters.AddWithValue("p", pseudo);
                cmd.Parameters.AddWithValue("s", score);
                await cmd.ExecuteNonQueryAsync();
            }
            await _connection.CloseAsync();
            return Created("", new { message = "Score ajouté !" });
        }
    }
}
