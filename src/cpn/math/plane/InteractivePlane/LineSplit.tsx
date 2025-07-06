import ResetIcon from "@cpn/icons/ResetIcon"

export default function LineSplit({ label, onReset, resetable }: { resetable?: boolean, label: string, onReset: VoidFunction }) {
	return <div className="flex w-full items-center gap-3">
		<Line />
		<div className="flex gap-2 items-center">{label}
			<div className="h-4 aspect-square">
				<ResetIcon {...{ resetable, onReset }} />
			</div>
		</div>
		<Line />
	</div>
}

function Line() {
	return <div className="bg-white/10 rounded-full h-0.5 w-full"></div>
}