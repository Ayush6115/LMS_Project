using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace lms_be.Migrations
{
    public partial class AddScoreToQuizSubmission : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Score",
                table: "QuizSubmissions",
                type: "int",
                nullable: false,
                defaultValue: 0); // Add default value for existing rows
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Score",
                table: "QuizSubmissions");
        }
    }
}
