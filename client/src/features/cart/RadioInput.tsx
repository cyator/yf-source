import React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { FormGroup, Label, Input, Media, FormFeedback } from 'reactstrap';
import { FormValues } from './PaymentForm';

type Props = UseControllerProps<FormValues> & { image: string };

function RadioInput(props: Props) {
	const {
		field,
		fieldState: { error },
	} = useController(props);
	return (
		<FormGroup check>
			<Label check>
				<Input
					{...field}
					type="radio"
					invalid={error ? true : false}
					// name="payment"
					// value="card"
					// checked={paymentMethod === 'card'}
					// onChange={(e) => setPaymentMethod(e.target.value)}
				/>
				<span>Debit/Credit Card</span>

				<Media
					style={{ maxWidth: '50px' }}
					object
					src={props.image}
					alt="mpesa logo"
				/>
			</Label>
			<FormFeedback>{error?.message ?? ''}</FormFeedback>
		</FormGroup>
	);
}

export default RadioInput;
