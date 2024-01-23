import {
	TooltipTrigger,
	Tooltip,
	TooltipContent,
	TooltipProvider,
} from '@/components/ui/tooltip'

interface HintProps {
	children: React.ReactNode
	description: string
	side?: 'left' | 'right' | 'top' | 'bottom'
	sideOffset?: number
}

export const Hint = ({
	children,
	description,
	side = 'bottom',
	sideOffset,
}: HintProps) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={0}>
				<TooltipTrigger>{children}</TooltipTrigger>
				<TooltipContent
					side={side}
					sideOffset={sideOffset}
					className='text-xs max-w-[220px] break-words'
				>
					{description}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
