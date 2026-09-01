using HabitTracker.Api.Services;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("Missing ConnectionStrings:Default in appsettings.json");
var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
builder.Services.AddSingleton(dataSourceBuilder.Build());
builder.Services.AddSingleton<HabitStore>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Allow the dev server (:5173) and the containerized frontend (:3000,
// see docker-compose.yml) by default; overridable via config/env
// (Cors__AllowedOrigins__0=..., etc.) without a code change.
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:5173", "http://localhost:3000" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // browse to /swagger to poke the API directly
}

app.UseCors("Frontend");
app.MapControllers();

app.Run();
