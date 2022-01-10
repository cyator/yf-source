import React from 'react';
import { Row, Col } from 'reactstrap';

import { IoLogoFacebook, IoLogoInstagram } from 'react-icons/io';
import { Link } from 'react-router-dom';

function Footer() {
	return (
		<footer className="container-fluid bg-dark py-3">
			<div className="container text-white text-center ">
				<Row>
					<Col sm="12" md="4" className="p-2">
						<h5 className="font-weight-bold">Socials</h5>
						<div>
							<a href="https://www.instagram.com/">
								<IoLogoInstagram size="1.5em" />
							</a>
						</div>
						<div>
							<a href="https://facebook.com/">
								<IoLogoFacebook size="1.5em" />
							</a>
						</div>
					</Col>
					<Col sm="12" md="4" className="p-2">
						<h5 className="font-weight-bold">Company</h5>
						<div>
							<Link to="/about">About us</Link>
						</div>
						<div>
							<Link to="/privacy-policy">Privacy policy</Link>
						</div>
						<div>
							<Link to="/terms-and-conditions">Terms and conditions</Link>
						</div>
					</Col>
					<Col sm="12" md="4" className="p-2">
						<div>
							<h5 className="font-weight-bold">Contact Us</h5>
							<div>Call to order : 0700000000</div>
							<div>Customer care : 0720000000</div>
							<div>Email : yotefresh@info.co.ke</div>
						</div>
					</Col>
				</Row>
				<hr style={{ background: 'white' }} />
				<div className="text-center text-white">
					&copy; 2020 Copyright yotefresh
				</div>
			</div>
		</footer>
	);
}

export default Footer;
