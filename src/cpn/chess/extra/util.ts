import { Move } from "chess.js";
import { ChessCtx, ChessRef } from ".";
import { HookSetter } from "@/lib/extra";

export function getCtx(chessRef: ChessRef): ChessCtx {
    return {
        board: chessRef.current.board(),
        moves: chessRef.current.moves({ verbose: true }),
        history: chessRef.current.history({ verbose: true })
    }
}

export function updateCtx({ chessRef, setCtx }: { chessRef: ChessRef,setCtx: HookSetter<ChessCtx> }) {
    setCtx(getCtx(chessRef))
}

export function move(m: Move,{chessRef, setCtx}: { chessRef: ChessRef, setCtx: HookSetter<ChessCtx>}) {
    chessRef.current.move(m)
    updateCtx({ chessRef, setCtx })
}