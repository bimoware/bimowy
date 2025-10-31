import { inspect } from "node:util";

const DEBUG_ENABLED = false

export const bimolog = (obj: any) => DEBUG_ENABLED && console.log(`${getTime()} -> ${inspect(obj)}`)

function getTime() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  const s = now.getSeconds().toString().padStart(2, "0");
  const ms = now.getMilliseconds().toString().padStart(3, "0");

  return `[${h}:${m}:${s}::${ms}]`;
}