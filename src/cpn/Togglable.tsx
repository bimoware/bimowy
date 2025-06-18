export default function Togglable({ checked, onChange }: {
	checked: boolean
	onChange: () => void
}) {
	return (
		<label className=" h-fit inline-flex items-center cursor-pointer">
			<input type="checkbox" className="sr-only peer"
				{...{ checked, onChange }} />
			<div
				className="
          relative w-11 h-6 rounded-full
          bg-neutral-800
          peer-checked:bg-blue-600
          after:content-[''] after:absolute after:top-[2px] after:start-[2px]
          after:w-5 after:h-5 after:bg-white after:rounded-full after:border after:border-gray-300
          after:duration-150
          peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
          peer-checked:after:border-white
        "
			></div>
		</label>
	);
}
