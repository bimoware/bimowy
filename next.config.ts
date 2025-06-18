import createNextIntlPlugin from "next-intl/plugin"

export default createNextIntlPlugin()({
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				port: "",
				pathname: "/u/**"
			}
		]
	}
})
