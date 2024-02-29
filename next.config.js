/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/webp'],
        domains: [
            "127.0.0.1",
            "localhost",
            "archi-eval.s3.eu-north-1.amazonaws.com",
            process.env.NEXT_PUBLIC_BACKEND_URL,
        ],
    },
}

module.exports = nextConfig
