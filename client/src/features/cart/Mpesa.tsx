import React from 'react';
import {
	Form,
	FormGroup,
	Label,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Input,
	Button,
	FormFeedback,
} from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { cartState } from './cartSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { simulatePayment } from './stkSlice';

const schema = yup.object().shape({
	phone_number: yup
		.string()
		.trim()
		.matches(/^[0-9]{9}$/gm, 'please enter a valid phone number')
		.required(),
});

export interface FormValues {
	phone_number: string;
}

function Mpesa() {
	const { total } = useAppSelector(cartState);
	const { handleSubmit, control } = useForm<FormValues>({
		resolver: yupResolver(schema),
	});
	const dispatch = useAppDispatch();
	const onSubmit = (data: FormValues) => {
		dispatch(
			simulatePayment({ phone_number: data.phone_number, amount: total })
		);
	};

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<FormGroup>
				<Label for="mobile_phone_number">Mobile phone number </Label>
				<InputGroup>
					<InputGroupAddon addonType="prepend">
						<InputGroupText>+254</InputGroupText>
					</InputGroupAddon>
					<Controller
						name="phone_number"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<>
								<Input
									type="tel"
									invalid={error ? true : false}
									{...field}
									placeholder={'e.g 705495536 or 105495536'}
								/>
								<FormFeedback>{error?.message ?? ''}</FormFeedback>
							</>
						)}
					/>
				</InputGroup>
			</FormGroup>
			<Button type="submit" className="w-100 bg-success">
				Pay KES.{total}
			</Button>
		</Form>
	);
}

export default Mpesa;
