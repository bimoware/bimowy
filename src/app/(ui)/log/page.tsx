import { generateMetadataUtil } from "@cpn/sidebars/main"
import LogBox from "./cpn/LogBox"


export async function generateMetadata() {
	return await generateMetadataUtil('log')
}

export default function LoginPage() {
	return <LogBox />
}


