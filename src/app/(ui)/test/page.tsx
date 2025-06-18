import { generateMetadataUtil } from "@util/sidebar";
import Test from "./cpn/Test";

export async function generateMetadata() {
  return await generateMetadataUtil('test')
}

export default async function TestPage() {
  return <Test />
}