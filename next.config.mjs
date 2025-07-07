/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://qxkwqonrfnpnhusxsppn.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4a3dxb25yZm5wbmh1c3hzcHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MzU1MDEsImV4cCI6MjA2MzUxMTUwMX0.ExnycCVQGFNl9JX9-W-24ZUiwxQO64Amq4qimFWpFBs'
  }
}

export default nextConfig
