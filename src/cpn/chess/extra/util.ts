import { Move } from "chess.js";
import { ChessCtx, ChessRef } from ".";
import { HookSetter } from "@/lib/extra";

export function getCtx(chessRef: ChessRef): ChessCtx {
    return {
        chessRef,
        board: chessRef.current.board(),
        moves: chessRef.current.moves({ verbose: true }),
        history: chessRef.current.history({ verbose: true })
    }
}

export function updateCtx({ chessRef, setCtx }: { chessRef: ChessRef,setCtx: HookSetter<ChessCtx> }) {
    setCtx(getCtx(chessRef))
}

export function move(m: Move,{ctx, setCtx}: { ctx: ChessCtx, setCtx: HookSetter<ChessCtx>}) {
    ctx.chessRef.current.move(m)
    updateCtx({ chessRef: ctx.chessRef, setCtx })
}

// From x and y coordinates to chess notation
export function fromXYtoCoor(x:number,y:number){
    const col = String.fromCharCode('a'.charCodeAt(0) + x);
    const row = (8 - y).toString();
    return col + row;
}