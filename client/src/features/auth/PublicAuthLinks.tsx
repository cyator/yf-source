import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { NavItem, NavLink } from 'reactstrap';

function PublicAuthLinks() {
	return (
		<>
			<NavItem>
				<NavLink tag={RouterNavLink} to='/register'>
					Register
				</NavLink>
			</NavItem>
			<NavItem>
				<NavLink tag={RouterNavLink} to='/login'>
					Login
				</NavLink>
			</NavItem>
		</>
	);
}

export default PublicAuthLinks;
