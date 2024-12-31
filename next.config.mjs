/** @type {import('next').NextConfig} */
const nextConfig = {};

export async function headers() {
  return [
    {
      source: "/secure-resource/(.*)", // Apply only to secure resources
      headers: [
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
      ],
    },
  ];
}

export default nextConfig;
