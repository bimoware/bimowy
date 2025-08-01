import { Chess } from "chess.js"
import { RefObject } from "react"

export type ChessCtx = {
    board: ReturnType<Chess["board"]>,
    moves: ReturnType<Chess["moves"]>,
    history: ReturnType<Chess["history"]>
}
export type ChessRef = RefObject<Chess>