import React from 'react';
import {
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	FormText,
	FormFeedback,
	Container,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import withRedirect from './withRedirect';
import { attemptLogin } from './authSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { useAppDispatch } from '../../app/hooks';

export type FormData = {
	email: string;
	password: string;
};

const schema = yup.object().shape({
	email: yup.string().email().required(),
	password: yup.string().trim().min(8).max(30).required(),
});

function Login() {
	const dispatch = useAppDispatch();
	const { control, handleSubmit } = useForm<FormData>({
		resolver: yupResolver(schema),
	});
	const onSubmit = handleSubmit((data) => {
		console.log('login credentials', data);
		dispatch(attemptLogin(data));
	});

	return (
		<Container className="py-5">
			<Form onSubmit={onSubmit}>
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
					<span className="px-1">Dont have an account?</span>
					<Link to="/register">Register</Link>
				</FormText>
				<Button type="submit">Log in</Button>
			</Form>
		</Container>
	);
}

export default withRedirect(Login);
