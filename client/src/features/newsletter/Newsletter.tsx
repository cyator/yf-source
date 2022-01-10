import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
	Form,
	FormGroup,
	FormText,
	Input,
	Button,
	FormFeedback,
} from 'reactstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
	email: yup.string().email().required(),
});

export interface FormValues {
	email: string;
}

function Newsletter() {
	const { handleSubmit, control } = useForm<FormValues>({
		resolver: yupResolver(schema),
	});

	const onSubmit = (data: FormValues) => {
		console.log(data);
	};
	return (
		<div>
			<h5 className="font-weight-bold">Subscribe to our newsletter</h5>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<FormGroup>
					<FormText>Dont miss out on our latest offers!</FormText>
				</FormGroup>

				<FormGroup>
					<Controller
						name="email"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<>
								<Input
									type="text"
									id="email"
									placeholder="Enter email address"
									invalid={error ? true : false}
									{...field}
								/>
								<FormFeedback>{error?.message ?? ''}</FormFeedback>
							</>
						)}
					/>
				</FormGroup>

				<Button>Subscribe</Button>
			</Form>
		</div>
	);
}

export default Newsletter;
