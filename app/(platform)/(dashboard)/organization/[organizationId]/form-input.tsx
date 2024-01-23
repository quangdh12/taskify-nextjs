'use client'

import { Input } from '@/components/ui/input'
import React from 'react'
import { useFormStatus } from 'react-dom'

interface FormInputProps {
	errors?: Record<string, any>
}

const FormInput = ({ errors }: FormInputProps) => {
	const { pending } = useFormStatus()

	return (
		<div className='flex flex-col space-y-2'>
			<Input
				id='title'
				name='title'
				required
				placeholder='Enter a board title'
				disabled={pending}
			/>

			{errors?.title ? (
				<div>
					{errors.title.map((error: string) => (
						<p
							key={error}
							className='text-rose-500'
						>
							{error}
						</p>
					))}
				</div>
			) : null}
		</div>
	)
}

export default FormInput
