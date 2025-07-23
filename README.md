# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# SSRS UI - Modern Web Interface for SQL Server Reporting Services

A modern React-based web interface for interacting with SQL Server Reporting Services (SSRS) through a RESTful API proxy. This application provides an improved user experience over the traditional SSRS web interface with modern UI components and enhanced usability.

## Features

- **🏗️ Modern Architecture**: Built with React 19, TypeScript, and Vite for fast development and optimal performance
- **📁 Intuitive Navigation**: Easy-to-use folder browser for SSRS report hierarchy
- **⚙️ Smart Parameter Handling**: Dynamic parameter forms with validation and type-aware inputs
- **📊 Multiple Export Formats**: Support for PDF, Excel, Word, CSV, XML, and Image formats
- **🔄 Real-time Status**: Connection status monitoring and user authentication display
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🛡️ Secure**: Windows Authentication pass-through via proxy API

## Prerequisites

- **SSRS Proxy API**: This UI requires the SSRS Proxy API to be running and accessible
- **Node.js**: Version 18.0 or later
- **npm**: Version 8.0 or later

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd SSRSUI
npm install
```

### 2. Configure API Endpoint

Update the proxy configuration in `vite.config.ts` to point to your SSRS Proxy API:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://your-ssrs-api-server:7134', // Update this URL
        changeOrigin: true,
        secure: true, // Set to true for production with valid SSL
      }
    }
  }
})
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Development

### Project Structure

```
src/
├── components/           # React components
│   ├── Layout/          # Main layout component
│   ├── Header/          # Header with connection status
│   ├── FolderBrowser/   # SSRS folder navigation
│   ├── ParameterForm/   # Report parameter inputs
│   └── ReportRenderer/  # Report download interface
├── hooks/               # Custom React hooks
│   └── useSSRS.ts      # SSRS API interaction hooks
├── services/            # API service layer
│   └── ssrsApi.ts      # SSRS API client
├── types/               # TypeScript type definitions
│   └── api.ts          # API response types
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Components

#### FolderBrowser
- Navigates SSRS folder hierarchy
- Displays folders and reports with metadata
- Supports breadcrumb navigation
- Shows creation/modification dates

#### ParameterForm
- Dynamically generates form inputs based on report parameters
- Supports all SSRS parameter types (String, Integer, Float, DateTime, Boolean)
- Handles multi-value parameters
- Provides parameter validation and defaults

#### ReportRenderer
- Allows selection of output format (PDF, Excel, Word, etc.)
- Shows current parameter values
- Provides one-click report download
- Displays helpful format information

### API Integration

The application uses a service layer (`ssrsApi.ts`) to interact with the SSRS Proxy API:

```typescript
// Example usage
import { ssrsApi } from './services/ssrsApi';

// Test connection
const status = await ssrsApi.testConnection();

// Browse folders
const folderData = await ssrsApi.browseFolder('/Sales');

// Get report parameters
const parameters = await ssrsApi.getReportParameters('/Sales/Monthly Report');

// Download report
await ssrsApi.downloadReport('/Sales/Monthly Report', { StartDate: '2024-01-01' }, 'PDF');
```

### Custom Hooks

The application includes several custom hooks for state management:

- `useSSRSConnection()` - Manages connection status
- `useSSRSBrowser()` - Handles folder navigation
- `useReportParameters()` - Manages report parameters
- `useReportRenderer()` - Handles report rendering
- `useUserInfo()` - Manages user authentication info

## Configuration

### Environment Variables

You can use environment variables to configure the application:

```bash
# .env.local
VITE_API_BASE_URL=https://your-ssrs-api-server:7134
```

### Proxy Configuration

For development, the Vite proxy is configured to forward API requests to your SSRS Proxy API. For production, you'll need to configure your web server to handle the proxy or update the API base URL.

## Building for Production

```bash
npm run build
```

This creates a `dist` folder with optimized static files that can be served by any web server.

### Deployment Options

#### Static Hosting (Recommended)
Deploy the `dist` folder to:
- Nginx
- Apache HTTP Server
- IIS
- AWS S3 + CloudFront
- Azure Static Web Apps
- Netlify
- Vercel

#### IIS Configuration
```xml
<!-- web.config for IIS -->
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Authentication

The application relies on Windows Authentication passed through the SSRS Proxy API. Ensure your browser is configured to send credentials to the API server.

### Chrome/Edge
```bash
# For development, you may need to disable web security
chrome.exe --disable-web-security --user-data-dir="C:/chrome-dev-session"
```

### Firefox
Navigate to `about:config` and set:
- `network.automatic-ntlm-auth.trusted-uris` to your API domain

## Troubleshooting

### Common Issues

#### API Connection Failed
- Verify the SSRS Proxy API is running
- Check the proxy configuration in `vite.config.ts`
- Ensure Windows Authentication is properly configured
- Check browser developer tools for CORS errors

#### Reports Not Loading
- Verify user permissions in SSRS
- Check that report paths are correct (case-sensitive)
- Ensure the SSRS service is running and accessible

#### Parameter Validation Errors
- Check parameter types and formats
- Verify required parameters are provided
- Ensure date formats are ISO 8601 compliant

### Debug Mode

Enable debug logging by opening browser developer tools:

```javascript
// In browser console
localStorage.setItem('debug', 'ssrs:*');
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Projects

- [SSRS Proxy API](../ssrs-proxy-api) - The backend API that this UI connects to

---

**Built with ❤️ for the SSRS community**

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
