import { pathDefaultProps, svgDefaultProps } from "."

type CompareSymbol = "<" | "<=" //| ">" | ">=" | "="

export function CompareIcon({ symbol }: {
	symbol: CompareSymbol
}) {
	return <svg {...svgDefaultProps} viewBox="0 0 10 10">
		{
			{
				"<": <polyline points="8,7.5 3,5 8,2.5" {...pathDefaultProps} />,
				"<=": <>
					<polyline {...pathDefaultProps} strokeWidth={pathDefaultProps.strokeWidth / 2}
						points="8,7.5 3,5 8,2.5" />
					<polyline {...pathDefaultProps} strokeWidth={pathDefaultProps.strokeWidth / 2}
						points="6.5,9 3,7.2" />
				</>
			}[symbol]
		}
	</svg>
}