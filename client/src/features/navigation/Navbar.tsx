import React, { useState } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	Badge,
} from 'reactstrap';
import { IoMdCart } from 'react-icons/io';
import { useAppSelector } from '../../app/hooks';
import { authState } from '../auth/authSlice';
import { cartState } from '../cart/cartSlice';
//auth links
import ProtectedAuthLinks from '../auth/ProtectedAuthLinks';
import PublicAuthLinks from '../auth/PublicAuthLinks';

function NavBar() {
	const { isAuthenticated } = useAppSelector(authState);
	const { cart } = useAppSelector(cartState);

	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => setIsOpen(!isOpen);

	return (
		<Navbar color="dark" dark expand="md" sticky="top">
			<NavbarToggler onClick={toggle} />

			<NavbarBrand className="mx-2" tag={RouterNavLink} to="/">
				<span className="font-weight-bold">Yote</span>
				<span className="text-monospace">Fresh</span>
			</NavbarBrand>

			<Nav navbar className="d-flex order-md-1 ml-auto">
				<NavItem>
					<NavLink className="p-2" tag={RouterNavLink} to="/cart">
						<span>
							<IoMdCart size="24px" />
							<Badge className="px-1">{cart.length}</Badge>
						</span>
					</NavLink>
				</NavItem>
			</Nav>

			<Collapse isOpen={isOpen} navbar>
				<Nav navbar className="ml-auto">
					{isAuthenticated ? <ProtectedAuthLinks /> : <PublicAuthLinks />}
					<NavItem className="order-first">
						<NavLink tag={RouterNavLink} to="/shop">
							Shop
						</NavLink>
					</NavItem>
				</Nav>
			</Collapse>
		</Navbar>
	);
}

export default NavBar;
