import { DARK_TILE, LIGHT_TILE } from "../extra"
import Image from "next/image"
import { Chess } from "chess.js"

export default function Cell({ cell, x, y }: {
    cell: ReturnType<Chess["board"]>[number][number],
    x: number, y: number
}) {
    const id = `${x},${y}` // unique for DnD


    return <div
        key={id}
        className={`
            ${(y + x) % 2 == 0 ? LIGHT_TILE : DARK_TILE}
            flex items-center justify-center
            p-1.5`}>
        {
            cell && <Image
                src={`/svgs/chess/${cell.type + cell.color}.svg`}
                alt={cell.type + cell.color}
                width={50}
                height={50}
                className="aspect-square w-full
                cursor-grab
                duration-75 hover:scale-105 hover:-translate-y-0.5" />
        }
    </div>
}

