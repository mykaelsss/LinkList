/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'ivvdzmsbftdopbbghybj.supabase.co'
            },
        ]
    }
}

module.exports = nextConfig
