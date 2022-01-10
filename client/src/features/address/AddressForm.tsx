import React from 'react';
import {
	Form,
	FormGroup,
	Input,
	InputGroupAddon,
	InputGroupText,
	Label,
	ButtonGroup,
	InputGroup,
	FormFeedback,
} from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'reactstrap';
import InputFeld from './InputFeld';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Address, createAddress, updateAddress } from './addressSlice';
import { useAppDispatch } from '../../app/hooks';

const schema = yup.object().shape({
	first_name: yup.string().trim().min(2).max(30).required(),
	last_name: yup.string().trim().min(2).max(30).required(),
	mobile_phone_number: yup
		.string()
		.trim()
		.matches(/^[0-9]{9}$/gm, 'please enter a valid phone number')
		.required(),
	alternate_phone_number: yup.string().matches(/^[0-9]{9}$/gm, {
		message: 'please enter a valid phone number',
		excludeEmptyString: true,
	}),
	delivery_address: yup.string().trim().min(2).max(255).required(),
	county: yup.string().required(),
	town: yup.string().required(),
});

export interface FormValues {
	first_name: string;
	last_name: string;
	mobile_phone_number: string;
	alternate_phone_number: string;
	delivery_address: string;
	county: string;
	town: string;
}

interface Props {
	onComplete?: (value: boolean) => void;
	close?: () => void;
	currentAddress?: Address;
	iscreatingAddress?: boolean;
}

const towns: string[] = ['Eldoret East', 'Eldoret CBD'];

function AddressForm({
	onComplete,
	close,
	currentAddress,
	iscreatingAddress,
}: Props) {
	const { handleSubmit, control } = useForm<FormValues>({
		defaultValues: {
			first_name: currentAddress?.first_name,
			last_name: currentAddress?.last_name,
			mobile_phone_number: currentAddress?.mobile_phone_number,
			alternate_phone_number: currentAddress?.alternate_phone_number,
			delivery_address: currentAddress?.delivery_address,
			county: currentAddress?.county,
			town: currentAddress?.town,
		},
		resolver: yupResolver(schema),
	});
	const dispatch = useAppDispatch();

	const onSubmit = (data: FormValues) => {
		if (iscreatingAddress) {
			console.log('creating', data);
			dispatch(createAddress(data));
		} else {
			currentAddress?.address_id &&
				dispatch(
					updateAddress({ id: currentAddress.address_id, updates: data })
				);
		}
		onComplete && onComplete(true);
	};
	return (
		<div>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<FormGroup>
					<Label for="first_name">First name</Label>
					<InputFeld name="first_name" control={control} />
				</FormGroup>
				<FormGroup>
					<Label for="last_name">Last name</Label>
					<InputFeld name="last_name" control={control} />
				</FormGroup>
				<FormGroup>
					<Label for="mobile_phone_number">Mobile phone number </Label>
					<InputGroup>
						<InputGroupAddon addonType="prepend">
							<InputGroupText>+254</InputGroupText>
						</InputGroupAddon>
						<InputFeld name="mobile_phone_number" control={control} />
					</InputGroup>
				</FormGroup>
				<FormGroup>
					<Label for="alternate_phone_number ">
						Alternate phone number (optional)
					</Label>
					<InputGroup>
						<InputGroupAddon addonType="prepend">
							<InputGroupText>+254</InputGroupText>
						</InputGroupAddon>

						<InputFeld name="alternate_phone_number" control={control} />
					</InputGroup>
				</FormGroup>
				<FormGroup>
					<Label for="deliveryAddress">Delivery Address</Label>
					<InputFeld name="delivery_address" control={control} />
				</FormGroup>

				<FormGroup>
					<Label for="county">County</Label>
					<Controller
						name="county"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<>
								<Input {...field} type="select" invalid={error ? true : false}>
									{!field.value && <option value="">Select county</option>}
									<option value="Uasin Gishu">Uasin Gishu</option>
								</Input>
								<FormFeedback>{error?.message ?? ''}</FormFeedback>
							</>
						)}
					/>
				</FormGroup>
				<FormGroup>
					<Label for="town">Town</Label>
					<Controller
						name="town"
						control={control}
						render={({ field: { value, ...rest }, fieldState: { error } }) => (
							<>
								<Input
									{...rest}
									defaultValue={value}
									type="select"
									invalid={error ? true : false}
								>
									{!value && <option value="">Select town</option>}
									{towns.map((town, index) => (
										<option
											key={index}
											// selected={field.value === town ? true : false}
											value={town}
										>
											{town}
										</option>
									))}
								</Input>
								<FormFeedback>{error?.message ?? ''}</FormFeedback>
							</>
						)}
					/>
				</FormGroup>
				<ButtonGroup>
					<Button
						disabled={!currentAddress && !iscreatingAddress ? true : false}
						tag="a"
						outline
						onClick={() => close && close()}
					>
						Go Back
					</Button>
					<Button color="dark" type="submit">
						Submit
					</Button>
				</ButtonGroup>
			</Form>
		</div>
	);
}

export default AddressForm;
