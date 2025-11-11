import { type NextRequest, NextResponse } from "next/server";
import { ErrorResponse, SuccessResponse } from "@/app/api/helpers";
import { resourceHandler } from "@/lib/resources";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // await new PromiSse(r => setTimeout(r, 2000));
  const { id } = await params;
  if (!resourceHandler.isValidId(id)) {
    return new NextResponse("Not Found", { status: 404 });
  }
  const resource = await resourceHandler.fetch(id);

  const searchParams = req.nextUrl.searchParams;
  const inputIDs = resource.getAllInputIds();
  const inputValues: Record<string, any> = {};
  for (const name of inputIDs) {
    if (!searchParams.has(name))
      return ErrorResponse(`Query parameter "${name}" missing`);
    inputValues[name] = +searchParams.get(name)!;
  }
  const seed = searchParams.get("seed")!.split(",").map(Number);

  const correction = resource.correct(seed, inputValues);

  return SuccessResponse({ correction });
}
