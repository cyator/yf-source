import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	Row,
	Col,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Button,
	Media,
} from 'reactstrap';
import { cartState, computeSubTotal, computeTotal } from './cartSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

function OrderSummary() {
	const { cart, subtotal, total } = useAppSelector(cartState);

	const dispatch = useAppDispatch();
	const deliveryFees = 1;

	useEffect(() => {
		dispatch(computeSubTotal());
	}, [dispatch]);

	useEffect(() => {
		dispatch(computeTotal(deliveryFees));
	}, [dispatch]);

	return (
		<div className="py-3 py-md-0">
			<Card>
				<CardHeader>Order Summary</CardHeader>
				<CardBody className="py-3">
					{cart.map(
						({
							product_id,
							product_name,
							price,
							price_type,
							quantity,
							image,
						}) => (
							<Row className="py-2" key={product_id}>
								<Col>
									<div className="d-flex">
										<Media
											style={{ maxHeight: '80px' }}
											object
											src={`${process.env.REACT_APP_BASE_URL}api/images/${image}`}
											alt="Product image"
											className="mr-2"
										/>
										<div>
											<p className="m-0 text-capitalize">{product_name}</p>
											<small>{`Price: KES.${price} ${price_type}`}</small>
											<br />
											<small>{`quantity: ${quantity}`}</small>
										</div>
									</div>
								</Col>
							</Row>
						)
					)}

					<hr />
					<Row>
						<Col>
							<div className="d-flex justify-content-md-between">
								<span>Subtotal:</span>
								<span>{`KES.${subtotal}`}</span>
							</div>
							<div className="d-flex justify-content-md-between">
								<span>Delivery Fees</span>
								<span>{`KES.${deliveryFees}`}</span>
							</div>
						</Col>
					</Row>
					<hr />
					<Row>
						<Col>
							<div className="d-flex justify-content-md-between font-weight-bold">
								<span>Total:</span>
								<span>{`KES.${total}`}</span>
							</div>
						</Col>
					</Row>
				</CardBody>
				<CardFooter>
					<Button tag={Link} to="/cart" className="w-100">
						Modify Cart
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}

export default OrderSummary;
