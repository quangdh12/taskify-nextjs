'use server'

import { db } from '@/lib/db'
import { z } from 'zod'

export type State = {
	errors?: {
		title: string[]
	}
	message?: string | null
}

const CreateBoard = z.object({
	title: z.string().min(3, {
		message: 'Minimum length of 3 letters is required',
	}),
})

export async function create(prevState: State, formData: FormData) {
	const validatedFields = CreateBoard.safeParse({
		title: formData.get('title'),
	})

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing fields',
		}
	}

	const { title } = validatedFields.data

	try {
		await db.board.create({
			data: {
				title: title,
			},
		})
	} catch (error) {
		return {
			message: 'Database error',
		}
	}
}
