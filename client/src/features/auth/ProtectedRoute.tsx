import React, { useState, useEffect } from 'react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import { useAppSelector } from '../../app/hooks';
import { authState } from '../auth/authSlice';

const ProtectedRoute = ({ component: Component, ...rest }: any) => {
	const [shouldRedirect, setShouldRedirect] = useState(false);

	const { isAuthenticated } = useAppSelector(authState);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShouldRedirect(true);
		}, 500);
		return () => {
			clearTimeout(timer);
		};
	}, []);

	return (
		<Route
			{...rest}
			render={(props: RouteComponentProps) =>
				isAuthenticated ? (
					<Component {...props} />
				) : shouldRedirect ? (
					<Redirect
						to={{
							pathname: '/login',
							state: { from: props.location },
						}}
					/>
				) : (
					<div className="d-flex justify-content-center py-5">
						<Spinner />
					</div>
				)
			}
		/>
	);
};

export default ProtectedRoute;
