import { generateMetadataUtil } from "@/utils/sidebar";
import Plane from "@cpn/Plane";

export async function generateMetadata() {
  return await generateMetadataUtil('test')
}

export default async function TestPage() {
  return <div className="p-1
  w-1/3
  aspect-square
  bg-white/5
  rounded-2xl
  flex flex-col items-center">
    <Plane elems={[
      {
        type: "point",
        id: "A",
        x: 2,
        y: 4
      }
    ]} />
  </div>
}