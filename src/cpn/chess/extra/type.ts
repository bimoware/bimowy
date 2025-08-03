import { Chess } from "chess.js"
import { RefObject } from "react"

export type ChessRef = RefObject<Chess>
export type ChessCtx = {
    chessRef: ChessRef
    board: ReturnType<Chess["board"]>,
    moves: ReturnType<Chess["moves"]>,
    history: ReturnType<Chess["history"]>
}