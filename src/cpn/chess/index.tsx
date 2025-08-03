import { ChessCtx, fromXYtoCoor, updateCtx } from "./extra"
import Cell from "./cpn/Cell"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { Square } from "chess.js"
import { HookSetter } from "@/lib/extra"
import useSound from "use-sound"

export default function ChessBoard({ ctx, setCtx }: {
    ctx: ChessCtx, setCtx: HookSetter<ChessCtx>
}) {

    const [playVFX] = useSound('/media/chess_move.mp3')
    function onDragEnd(e: DragEndEvent) {
        if (!e.over) return
        if (e.active.id === e.over.id) return;
        const from: Square = e.active.id as Square
        const to: Square = e.over.id as Square
        const m = ctx.moves.find(m => m.from === from && m.to === to)
        console.log({ from, to, m })
        console.log(6)
        if (!m) return
        console.log(7)
        // Move the piece
        ctx.chessRef.current.move({ ...m, promotion: "q" })
        // Update the context
        updateCtx({ chessRef: ctx.chessRef, setCtx })
        playVFX()
    }
    return <DndContext {...{ onDragEnd }}>
        <div className="grid grid-rows-8 grid-cols-8 bg-white/5 aspect-square h-full rounded-xl select-none">
            {
                ctx.board
                    .map((lign, y) =>
                        lign.map((cell, x) => {
                            const id = fromXYtoCoor(x, y)
                            return <Cell key={id} {...{ id, ctx, cell, x, y }} />
                        })
                    )
            }
        </div>
    </DndContext>
}