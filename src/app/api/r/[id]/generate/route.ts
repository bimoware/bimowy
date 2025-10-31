import { type NextRequest, NextResponse } from "next/server";
import { resourceHandler } from "@/lib/resources";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!resourceHandler.isValidId(id)) {
    return new NextResponse("Not Found", { status: 404 });
  }
  const resource = await resourceHandler.fetch(id);
  const { ui, seed } = resource.generateExercise();
  return NextResponse.json({ seed, ui });
}
