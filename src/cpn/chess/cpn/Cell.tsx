import { DARK_TILE, LIGHT_TILE } from "../extra"
import Image from "next/image"
import { Chess } from "chess.js"
import { useDraggable, useDroppable } from "@dnd-kit/core";

export default function Cell({ cell, x, y,id }: {
    cell: ReturnType<Chess["board"]>[number][number],
    x: number, y: number, id:string
}) {
    const { attributes, listeners, setNodeRef: itemRef, transform } = useDraggable({ id });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;


    const { isOver, setNodeRef: zoneRef } = useDroppable({ id });

    return <div
        ref={zoneRef}
        key={id}
        className={`
            ${(y + x) % 2 == 0 ? LIGHT_TILE : DARK_TILE}
            flex items-center justify-center
            p-1
            ${isOver && "outline-8 -outline-offset-2 outline-yellow-500/10"}`}>
        {
            cell && <Image
                {...attributes} {...listeners} {...{ style }} ref={itemRef}
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

