import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { authState } from '../auth/authSlice';

//type props
const withRedirect = (WrappedComponent: any) => {
	function WithRedirect({ location }: any) {
		const { from } = location.state || { from: '/profile' };
		const { isAuthenticated } = useAppSelector(authState);
		const [shouldRedirect, setshouldRedirect] = useState(false);

		useEffect(() => {
			isAuthenticated && setshouldRedirect(true);
		}, [isAuthenticated]);

		return shouldRedirect ? <Redirect to={from} /> : <WrappedComponent />;
	}
	return WithRedirect;
};

export default withRedirect;
