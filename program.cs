using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);


builder.WebHost.UseUrls("http://localhost:5502");

var app = builder.Build();

// Enable serving static files and default pages from the 'wwwroot' folder
app.UseDefaultFiles(); // Serves index.html by default if available
app.UseStaticFiles();  // Serves static files like app.js, index.html, and CSS

app.Run();
