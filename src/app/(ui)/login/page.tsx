import { generateMetadataUtil } from "@/utils/sidebar"
import LogBox from "./cpn/LogBox"


export async function generateMetadata() {
	return await generateMetadataUtil('login')
}

export default function LoginPage() {
	return <LogBox />
}


