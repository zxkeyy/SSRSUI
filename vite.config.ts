import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7134',
        changeOrigin: true,
        secure: false, // Allow self-signed certificates
        ws: true, // Enable websocket proxying
        rewrite: (path) => path, // Keep the path as-is
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            console.log('Proxy error:', err);
            if (res && !res.headersSent) {
              res.writeHead(500, {
                'Content-Type': 'text/plain',
              });
              res.end('Proxy error: ' + err.message);
            }
          });
          
          proxy.on('proxyReq', (proxyReq, req) => {
            // Forward all headers including authentication
            if (req.headers.authorization) {
              proxyReq.setHeader('Authorization', req.headers.authorization);
            }
            // Forward Windows Authentication headers
            if (req.headers['www-authenticate']) {
              proxyReq.setHeader('WWW-Authenticate', req.headers['www-authenticate']);
            }
            // Forward other authentication-related headers
            if (req.headers['ntlm-token']) {
              proxyReq.setHeader('NTLM-Token', req.headers['ntlm-token']);
            }
            if (req.headers['negotiate']) {
              proxyReq.setHeader('Negotiate', req.headers['negotiate']);
            }
            
            console.log('Proxying request with headers:', req.method, req.url, '-> https://localhost:7134' + req.url);
            console.log('Auth headers:', {
              authorization: req.headers.authorization ? 'Present' : 'Missing',
              'www-authenticate': req.headers['www-authenticate'] ? 'Present' : 'Missing'
            });
          });
          
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received response:', proxyRes.statusCode, req.url);
            
            // Forward authentication challenges back to browser
            if (proxyRes.headers['www-authenticate']) {
              res.setHeader('WWW-Authenticate', proxyRes.headers['www-authenticate']);
              console.log('Forwarding WWW-Authenticate header:', proxyRes.headers['www-authenticate']);
            }
            
            // Forward other auth-related headers
            if (proxyRes.headers['authentication-info']) {
              res.setHeader('Authentication-Info', proxyRes.headers['authentication-info']);
            }
            
            // For 400 errors, let's see what the response body contains
            if (proxyRes.statusCode === 400) {
              console.log('400 Bad Request - Response headers:', proxyRes.headers);
              let body = '';
              proxyRes.on('data', (chunk) => {
                body += chunk;
              });
              proxyRes.on('end', () => {
                if (body) {
                  console.log('400 Bad Request - Response body:', body);
                }
              });
            }
            
            // Log response headers for debugging auth issues
            if (proxyRes.statusCode === 401) {
              console.log('Auth error response headers:', proxyRes.headers);
            }
          });
        },
      }
    }
  }
})
