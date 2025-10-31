import { NextResponse } from "next/server";

export function ErrorResponse(res: string | object) {
  return NextResponse.json({ ok: false, ...formatMessage(res) })
}
export function SuccessResponse(res: string | object) {
  return NextResponse.json({ ok: true, ...formatMessage(res) })

}
function formatMessage(res: string | object) {
  return typeof (res) === "string"
    ? { message: res }
    : res
}