using HabitTracker.Api.Services;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

//Specifying that API end points will be in dedicated controller classes
builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("Missing ConnectionStrings:Default in appsettings.json");
var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
//Creates one instance of the below managers
builder.Services.AddSingleton(dataSourceBuilder.Build());
builder.Services.AddSingleton<HabitStore>();
//Register swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// The Vite dev server runs on :5173 by default — allow it to call this
// API from the browser. Add any other frontend origins here too.
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
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
//Connects incoming network routes directly to your Controller code files.
app.MapControllers();

app.Run();
