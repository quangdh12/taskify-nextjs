'use client'

import { useFormState } from 'react-dom'
import FormButton from './form-button'
import FormInput from './form-input'
import { useAction } from '@/hooks/use-action'
import { createBoard } from '@/actions/create-board'

const Form = () => {
	const { execute, fieldErrors } = useAction(createBoard, {
		onSuccess: (data) => {
			console.log('🚀 ~ file: form.tsx:15 ~ Form ~ data:', data)
		},
		onError: (error) => {
			console.log('🚀 ~ file: form.tsx:18 ~ Form ~ error:', error)
		},
	})

	const onSubmit = (formData: FormData) => {
		const title = formData.get('title') as string

		execute({ title })
	}

	const initialState = { message: null, errors: {} }
	const [state, dispatch] = useFormState(create, initialState)

	return (
		<form action={dispatch}>
			<FormInput errors={state?.errors} />
			<FormButton />
		</form>
	)
}

export default Form
