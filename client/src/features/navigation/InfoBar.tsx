import React from 'react';
import { Navbar, NavbarText } from 'reactstrap';

function InfoBar() {
	return (
		<Navbar
			color="light"
			light
			className="d-none d-md-flex justify-content-end"
		>
			<div className="font-weight-bold">
				<NavbarText className="py-0">Call to order : 0700000000</NavbarText>
				<NavbarText className="py-0 px-2">
					Customer care : 0720000000
				</NavbarText>
			</div>
		</Navbar>
	);
}

export default InfoBar;
