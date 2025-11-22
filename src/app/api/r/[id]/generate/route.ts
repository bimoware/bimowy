import { type NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "@/app/api/helpers";
import { type OptionValues, resourceHandler } from "@/lib/resources";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!resourceHandler.isValidId(id)) return ErrorResponse("Not Found");

  const resource = await resourceHandler.fetch(id);

  const searchParams = req.nextUrl.searchParams;

  const optionValues: OptionValues = {};
  for (const id of Object.keys(resource.options)) {
    if (!searchParams.has(id)) return ErrorResponse(`No option "${id}"`);
    optionValues[id] = searchParams.get(id)?.split(",").map(Number);
  }
  const { ui, seed } = resource.generateExercise(optionValues);
  return NextResponse.json({ seed, ui });
}
