export default function LineSplit({ label }: { label: string }) {
	return <div className="flex w-full items-center gap-3">
		<Line />
		{label}
		<Line />
	</div>
}

function Line() {
	return <div className="bg-white/10 rounded-full h-1 w-full"></div>
}