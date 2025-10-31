import { resourceHandler } from "@/lib/resources";
import { SuccessResponse } from "../helpers";

export async function GET() {
  const res = await resourceHandler.fetch('power')
  return SuccessResponse({ res: res.generateRandomSeed() })
}