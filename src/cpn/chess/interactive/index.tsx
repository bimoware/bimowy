"use client"

import { Chess } from "chess.js"
import { useRef, useState } from "react"
import ChessBoard from ".."
import { ChessCtx, ChessRef, getCtx, move } from "../extra"
import { HookSetter } from "@/lib/extra"

export default function InteractiveChessBoard() {
    const chessRef = useRef(new Chess())
    const [ctx, setCtx] = useState(getCtx(chessRef))

    return <div className="w-full h-full flex">
        <ChessButtons {...{ ctx, chessRef, setCtx }} />
        <ChessBoard {...{ ctx, chessRef, setCtx }} />
    </div>
}

export function ChessButtons({ ctx, chessRef, setCtx }: { ctx: ChessCtx , chessRef: ChessRef, setCtx: HookSetter<ChessCtx> }) {
    return <div className="flex flex-wrap gap-1">
        {
            ctx.moves
                .map(m => <button key={m.san
                }
                    onClick={() => move(m,{ chessRef, setCtx })}
                    className="p-1 px-2 font-bold hover:scale-1O5 bg-white/5 rounded-md w-fit h-fit"
                >
                    {m.san}
                </button>)
        }
    </div>
}