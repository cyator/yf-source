import React from 'react';
import { FormFeedback, Input } from 'reactstrap';
import { useController, UseControllerProps } from 'react-hook-form';
import { FormValues } from './AddressForm';

function InputFeld({ name, control }: UseControllerProps<FormValues>) {
	const {
		field,
		fieldState: { error },
	} = useController({ name, control });
	return (
		<>
			<Input
				type={
					name === 'mobile_phone_number' || name === 'alternate_phone_number'
						? 'tel'
						: name === 'delivery_address'
						? 'textarea'
						: 'text'
				}
				placeholder={
					name === 'mobile_phone_number' || name === 'alternate_phone_number'
						? 'e.g 705495536 or 105495536'
						: ''
				}
				{...field}
				invalid={error ? true : false}
			/>
			<FormFeedback>{error?.message ?? ''}</FormFeedback>
		</>
	);
}

export default InputFeld;
