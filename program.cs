using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Set the application to listen on port 5501
builder.WebHost.UseUrls("http://localhost:5501");

var app = builder.Build();

// Enable serving static files and default pages from the 'wwwroot' folder
app.UseDefaultFiles(); // Serves index.html by default if available
app.UseStaticFiles();  // Serves static files like app.js, index.html, and CSS

app.Run();
