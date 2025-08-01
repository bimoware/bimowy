import { ChessCtx } from "./extra"
import Cell from "./cpn/Cell"

export default function ChessBoard({ ctx}: {
    ctx: ChessCtx
}) {
    return <div className="grid grid-rows-8 grid-cols-8 bg-white/5 aspect-square h-full rounded-xl select-none">
            {
                ctx.board
                    .map((lign, y) =>
                        lign.map((cell, x) => <Cell key={''+y+x} {...{ ctx, cell, x, y }} />)
                    )
            }
        </div>
}