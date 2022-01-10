import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { useAppSelector } from '../../app/hooks';
import { cartState } from './cartSlice';
import CartItems from './CartItems';
import CartTotals from './CartTotals';

function Cart() {
	const { cart } = useAppSelector(cartState);

	return (
		<Container className="py-3">
			<Row className="bg-secondary p-2 text-white">
				<Col xs="5" sm="6">
					<div>Products</div>
				</Col>
				<Col xs="5" sm="3">
					<div>Quantity</div>
				</Col>
				<Col className="d-flex justify-content-end" xs="2" sm="3">
					<div>Price</div>
				</Col>
			</Row>

			{cart.map((product) => (
				<CartItems key={product.product_id} product={product} />
			))}

			<CartTotals />
		</Container>
	);
}

export default Cart;
