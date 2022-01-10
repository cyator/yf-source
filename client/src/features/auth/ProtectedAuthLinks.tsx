import React, { useEffect } from 'react';
import { NavLink as RouterNavLink, Link, useHistory } from 'react-router-dom';
import {
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Button,
	NavItem,
	NavLink,
} from 'reactstrap';
import { logout, authState, fetchUser } from './authSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

function ProtectedAuthLinks() {
	const { user } = useAppSelector(authState);
	const dispatch = useAppDispatch();
	const history = useHistory();

	useEffect(() => {
		dispatch(fetchUser());
	}, [dispatch]);

	return (
		<>
			<UncontrolledDropdown nav inNavbar className="d-none d-md-block pb-0">
				<DropdownToggle nav caret>
					{user?.username ? user?.username : 'Account'}
				</DropdownToggle>
				<DropdownMenu right>
					<DropdownItem tag={Link} to="/profile">
						Profile
					</DropdownItem>
					<DropdownItem tag={Link} to="/orders">
						Orders
					</DropdownItem>
					<DropdownItem tag={Link} to="/favorites">
						Favorites
					</DropdownItem>
					<DropdownItem tag={Link} to="/addresses">
						Addresses
					</DropdownItem>
					<DropdownItem divider />
					<DropdownItem tag={'div'}>
						<Button className="w-100" onClick={() => dispatch(logout(history))}>
							Log out
						</Button>
					</DropdownItem>
				</DropdownMenu>
			</UncontrolledDropdown>

			<div className="d-md-none">
				<NavItem>
					<NavLink tag={RouterNavLink} to="/profile">
						Profile
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink tag={RouterNavLink} to="/orders">
						Orders
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink tag={RouterNavLink} to="/favorites">
						Favorites
					</NavLink>
				</NavItem>
				<hr style={{ background: 'white' }} />
				<Button className="w-100" onClick={() => dispatch(logout(history))}>
					Log out
				</Button>
			</div>
		</>
	);
}

export default ProtectedAuthLinks;
