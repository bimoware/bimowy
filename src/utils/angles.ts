export const angles: {
	deg: number,
	type: 0 | 1 | 2,
	inTable: boolean,
	percentage: { value: string, abs?: number },
	rad: { value: string, abs?: number },
	sin: { value: string | [string, string], abs: number },
	cos: { value: string | [string, string], abs: number }
}[] = [
		{
			inTable: true,
			type: 0,
			deg: 0,
			percentage: { value: "0", abs: 0 },
			rad: { value: "0π" },
			sin: { value: ["\\sqrt{0}", "2"], abs: 0 },
			cos: { value: ["\\sqrt{4}", "2"], abs: 1 }
		},
		{
			inTable: true,
			type: 2,
			deg: 30,
			percentage: { value: "1/12", abs: 1 / 12 },
			rad: { value: "π/6", abs: Math.PI / 6 },
			sin: { value: ["\\sqrt{1}", "2"], abs: 0.5 },
			cos: { value: ["\\sqrt{3}", "2"], abs: Math.sqrt(3) / 2 }
		},
		{
			inTable: true,
			type: 1,
			deg: 45,
			rad: { value: "π/4", abs: Math.PI / 4 },
			percentage: { value: "1/8", abs: 1 / 8 },
			sin: { value: ["\\sqrt{2}", "2"], abs: Math.sqrt(2) / 2 },
			cos: { value: ["\\sqrt{2}", "2"], abs: Math.sqrt(2) / 2 }
		},
		{
			inTable: true,
			type: 2,
			deg: 60,
			percentage: { value: "1/6", abs: 1 / 6 },
			rad: { value: "π/3", abs: Math.PI / 3 },
			sin: { value: ["\\sqrt{3}", "2"], abs: Math.sqrt(3) / 2 },
			cos: { value: ["\\sqrt{1}", "2"], abs: 0.5 }
		},
		{
			inTable: true,
			type: 1,
			deg: 90,
			percentage: { value: "1/4", abs: 1 / 4 },
			rad: { value: "π/2", abs: Math.PI / 2 },
			sin: { value: ["\\sqrt{4}", "2"], abs: 1 },
			cos: { value: ["\\sqrt{0}", "2"], abs: 0 }
		},
		{
			inTable: true,
			type: 2,
			deg: 120,
			percentage: { value: "1/3", abs: 1 / 3 },
			rad: { value: "2π/3", abs: (2 / 3) * Math.PI },
			sin: { value: ["\\sqrt{3}", "2"], abs: Math.sqrt(3) / 2 },
			cos: { value: ["-\\sqrt{1}", "2"], abs: -0.5 }
		},
		{
			inTable: false,
			type: 1,
			deg: 135,
			percentage: { value: "3/8", abs: 3 / 8 },
			rad: { value: "3π/4", abs: (3 / 4) * Math.PI },
			sin: { value: ["\\sqrt{2}", "2"], abs: Math.sqrt(2) / 2 },
			cos: { value: ["-\\sqrt{2}", "2"], abs: -Math.sqrt(2) / 2 }
		},
		{
			inTable: true,
			type: 1,
			deg: 180,
			percentage: { value: "1/2", abs: 1 / 2 },
			rad: { value: "π", abs: Math.PI },
			sin: { value: ["\\sqrt{0}", "2"], abs: 0 },
			cos: { value: ["-\\sqrt{4}", "2"], abs: -1 }
		},
		{
			inTable: false,
			type: 2,
			deg: 240,
			percentage: { value: "2/3", abs: 2 / 3 },
			rad: { value: "4π/3", abs: (4 / 3) * Math.PI },
			sin: { value: ["-\\sqrt{3}", "2"], abs: -Math.sqrt(3) / 2 },
			cos: { value: ["-\\sqrt{1}", "2"], abs: -0.5 }
		},
		{
			inTable: true,
			type: 0,
			deg: 360,
			percentage: { value: "1", abs: 1 },
			rad: { value: "2π", abs: 2 * Math.PI },
			sin: { value: ["\\sqrt{0}", "2"], abs: 0 },
			cos: { value: ["\\sqrt{4}", "2"], abs: 1 }
		}
	]