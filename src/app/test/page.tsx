"use client";
import { useState } from "react"

export default function TestPage() {
  const [toggled, setToggled] = useState(false)
  return <div
  aria-checked={toggled}
  className={`m-10 h-10 w-20
  shadow-[inset_0_20px_10px_rgba(0,0,0,0.5)]
  rounded-full flex items-center p-1 relative
  justify-start aria-checked:justify-end
  transition-all`}
    onClick={() => setToggled(prev => !prev)}>
    <div className="h-full aspect-square bg-white rounded-full transition-all"></div>
  </div>
}
