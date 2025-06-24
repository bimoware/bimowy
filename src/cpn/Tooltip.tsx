"use client";
import { AnimatePresence, motion } from 'motion/react';
import { useState, useRef, useLayoutEffect, ReactNode } from 'react';

export default function TooltipContainer({ children, tooltip, hidden }: {
	children: ReactNode
	tooltip: string
	hidden?: boolean
}) {
	const [visible, setVisible] = useState(false);
	const [styles, setStyles] = useState({ left: 0, top: 0 });
	const wrapperRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (!visible || !wrapperRef.current) return;
		const wrap = wrapperRef.current.getBoundingClientRect();
		// position to the right, vertically centered
		const left = wrap.right + 20; // gap from element
		const top = wrap.top + wrap.height / 2;
		setStyles({ left, top });
	}, [visible]);

	return (
		<div
			ref={wrapperRef}
			onMouseEnter={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}
			className='inline-block relative'
		>
			{children}
			<AnimatePresence>
				{
					visible && tooltip && (
						<motion.div
							transition={{ duration: 0.1 }}
							initial={{
								opacity: 0,
								scale: 0.8,
								translateX: "-1em"
							}}
							animate={{
								opacity: hidden ? 0.3 : 1,
								scale: 1,
								translateX: "0em"
							}}
							exit={{
								opacity: 0,
								scale: 0.8,
								translateX: "-1em"
							}}
							className={`
								fixed
								bg-black/20 dark:bg-neutral-900
								shadow-[0px_0px_10px_-20px_#0a0a0a]/10
								px-2.5 py-1.5 rounded-xl
								pointer-events-none whitespace-nowrap z-50
								-translate-y-1/2
								!ml-2
								${hidden && "!opacity-50"}`
							}
							style={{
								left: styles.left,
								top: styles.top
							}}
						>
							{tooltip}
							<div
								className={`
								absolute
								-left-2 top-1/2
								-translate-y-1/2
								translate-x-0.5
								w-1.5 h-3
								overflow-hidden`}
							>
								<svg width="6" height="12" viewBox="0 0 6 12" xmlns="http://www.w3.org/2000/svg">
									<path d="M6,0 Q-6,6 6,12" className='fill-black/20' />
								</svg>
							</div>
						</motion.div>
					)}
			</AnimatePresence>
		</div>
	);
}
