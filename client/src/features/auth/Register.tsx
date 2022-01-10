import React from 'react';
import { Link } from 'react-router-dom';
import {
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	FormText,
	FormFeedback,
} from 'reactstrap';

import withRedirect from './withRedirect';
import { register } from './authSlice';
// import PageTitle from '../partials/PageTitle';
import Container from 'reactstrap/lib/Container';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { useAppDispatch } from '../../app/hooks';

export type FormData = {
	username: string;
	email: string;
	password: string;
};

const schema = yup.object().shape({
	username: yup.string().trim().min(2).max(30).required(),
	email: yup.string().email().required(),
	password: yup.string().trim().min(8).max(30).required(),
});

function Register() {
	const dispatch = useAppDispatch();
	const { control, handleSubmit } = useForm<FormData>({
		resolver: yupResolver(schema),
	});
	const onSubmit = handleSubmit((data) => {
		console.log('attempt register', data);
		dispatch(register(data));
	});

	return (
		<Container className="py-5">
			<Form onSubmit={onSubmit}>
				<FormGroup>
					<Controller
						name="username"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<>
								<Label for="username">Username</Label>
								<Input
									{...field}
									type="text"
									placeholder="username"
									invalid={error ? true : false}
								/>
								<FormFeedback>{error?.message ?? ''}</FormFeedback>
							</>
						)}
					/>
				</FormGroup>
				<FormGroup>
					<Controller
						name="email"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<>
								<Label for="email">Email</Label>
								<Input
									{...field}
									type="email"
									placeholder="email"
									invalid={error ? true : false}
								/>
								<FormFeedback>{error?.message ?? ''}</FormFeedback>
							</>
						)}
					/>
				</FormGroup>
				<FormGroup>
					<Controller
						name="password"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<>
								<Label for="password">Password</Label>
								<Input
									{...field}
									type="password"
									placeholder="password"
									invalid={error ? true : false}
								/>
								<FormFeedback>{error?.message ?? ''}</FormFeedback>
							</>
						)}
					/>
				</FormGroup>
				<FormText className="float-right">
					<span className="px-1">already registered?</span>
					<Link to="/login">Log in</Link>
				</FormText>
				<Button type="submit">Register</Button>
			</Form>
		</Container>
	);
}

export default withRedirect(Register);
