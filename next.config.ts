import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				source: "/svgs/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable"
					}
				]
			}
		]
	}
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
