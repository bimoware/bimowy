import Image from "next/image";

export default function DeleteIcon({ onDelete }: { onDelete: VoidFunction }) {
	return <Image src="/svgs/trash.svg" onClick={onDelete} width={15} height={15} alt="Remove"/>
}