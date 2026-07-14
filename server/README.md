# Standalone API Server Setup Guide

This folder contains template configuration files for setting up a standalone backend server (e.g. Express, NestJS, Fastify) that links with the Next.js frontend starter kit.

## Running a Standalone Backend

1. **Install dependencies**:
   ```bash
   npm install express cookie-parser dotenv
   npm install --save-dev @types/express typescript
   ```

2. **Initialize server**:
   Set up your server mapping the templates:
   - Use `config.ts` to configure port settings and SMTP/Twilio integrations.
   - Use `middleware.ts` for session and CORS controls.

3. **Configure API proxy**:
   To route `/api/*` from Next.js to your standalone server (e.g. port 4000) in local development, update your `next.config.ts`:
   ```ts
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     async rewrites() {
       return [
         {
           source: "/api/:path*",
           destination: "http://localhost:4000/api/:path*", // Redirect API calls to local Express server
         },
       ];
     },
   };

   export default nextConfig;
   ```
