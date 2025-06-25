import { generateMetadataUtil } from "@/utils/sidebar";

export async function generateMetadata() {
  return await generateMetadataUtil('test')
}

export default async function TestPage() {
  return <></>
}