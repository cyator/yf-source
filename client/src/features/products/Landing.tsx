import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Media } from 'reactstrap';
import landing1 from '../../images/1.jpeg';

function Landing() {
	return (
		<div
			className="bg-dark py-5 container-fluid mb-lg-5 "
			style={{ height: '400px' }}
		>
			<div className="container">
				<Row>
					<Col lg="6" sm="12" className="d-flex align-items-center">
						<div>
							<h2 className="text-white font-weight-bold">
								Fresh From Our Farm
							</h2>
							<p className="text-white ">
								Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat
								reiciendis autem nam voluptas exercitationem optio ipsum quasi
								possimus numquam necessitatibus?
							</p>

							<Button outline color="light" tag={Link} to="/about">
								learn more...
							</Button>
							<Button tag={Link} to="/shop" className="mx-3">
								Shop
							</Button>
						</div>
					</Col>
					<Col lg="6" className="d-none d-lg-flex justify-content-lg-center">
						<Media
							style={{ maxHeight: '400px' }}
							object
							src={landing1}
							alt="landing"
						/>
					</Col>
				</Row>
			</div>
		</div>
	);
}

export default Landing;
