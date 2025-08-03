"use client"

import { Chess } from "chess.js"
import { useRef, useState } from "react"
import ChessBoard from ".."
import { getCtx } from "../extra"

export default function InteractiveChessBoard() {
    const chessRef = useRef(new Chess())
    const [ctx, setCtx] = useState(getCtx(chessRef))

    return <div className="w-full h-full flex items-center justify-center">
        <ChessBoard {...{ ctx, setCtx }} />
    </div>
}
