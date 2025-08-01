# SSRS UI

A modern React-based web interface for SQL Server Reporting Services (SSRS) built with TypeScript and Vite. This application provides an intuitive user interface for browsing, viewing, and managing SSRS reports.

## Prerequisites

This application requires the [SSRS Proxy API](https://github.com/zxkeyy/SSRSProxyApi) backend service to function properly. The API provides RESTful endpoints for communicating with SSRS and handles authentication, report rendering, and folder navigation.

## Features

- Browse SSRS folder hierarchy and reports
- View reports in multiple formats (PDF, Excel, Word, CSV, etc.)
- Report parameter management
- User authentication and session handling
- Responsive design with mobile support
- Favorite reports functionality
- Connection status monitoring
- Settings and configuration management

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: CSS with responsive design

## Getting Started

### Development

1. Clone this repository:
   ```bash
   git clone https://github.com/zxkeyy/SSRSUI.git
   cd SSRSUI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the displayed URL (typically `http://localhost:5173`)

### Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. The built files will be generated in the `dist` folder.

## Deployment with ASP.NET Core

This React application can be served directly from your ASP.NET Core backend by copying the build output to the `wwwroot` folder:

1. Build the React application as described above
2. Copy the contents of the `dist` folder to your ASP.NET Core project's `wwwroot` directory
3. Configure your ASP.NET Core application to serve static files and handle client-side routing (Already configured in SSRSProxyApi)

Example configuration in your ASP.NET Core `Program.cs`:

```csharp
app.UseStaticFiles();
app.UseRouting();

// Fallback for client-side routing
app.MapFallbackToFile("index.html");
```

This approach eliminates the need for a separate web server and allows your SSRS API to serve both the API endpoints and the web interface.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview the production build locally

## Configuration

The application connects to the SSRS Proxy API backend. Make sure to configure the API endpoints in your environment to match your backend service deployment.


## License

This project is licensed under the MIT License.

