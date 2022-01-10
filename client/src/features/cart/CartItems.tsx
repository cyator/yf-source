import React from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Button, Media, Input } from 'reactstrap';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import {
	removeFromCart,
	increaseQuantity,
	decreaseQuantity,
} from './cartSlice';
import { Product } from '../products/productSlice';

interface Props {
	product: Product;
}

function CartItems({
	product: { product_id, product_name, price, price_type, quantity, image },
}: Props) {
	const dispatch = useDispatch();
	return (
		<Row className="py-3" key={product_id}>
			<Col xs="4" sm="6">
				<div className="d-flex flex-wrap">
					<Media
						style={{ maxHeight: '80px' }}
						object
						src={`${process.env.REACT_APP_BASE_URL}api/images/${image}`}
						alt="Product"
						className="mr-2"
					/>
					<div>
						<p className="m-0 text-capitalize">{product_name}</p>
						<small>{`Price: KES.${price} ${price_type}`}</small>
						<br />

						<Button
							className="p-0"
							color="link"
							onClick={() => dispatch(removeFromCart(product_id))}
						>
							<small> Remove</small>
						</Button>
					</div>
				</div>
			</Col>
			<Col xs="6" sm="3" className="pr-0">
				<div className="d-flex flex-wrap">
					<Input
						className="w-50 mr-1 bg-white"
						type="text"
						inputMode="numeric"
						value={quantity}
						readOnly
					/>
					<div className="d-flex flex-column py-1">
						<MdKeyboardArrowUp
							onClick={() => dispatch(increaseQuantity(product_id))}
						/>
						<MdKeyboardArrowDown
							onClick={() => dispatch(decreaseQuantity(product_id))}
						/>
					</div>
				</div>
			</Col>
			<Col className="d-flex justify-content-end pl-0" xs="2" sm="3">
				<div>KES.{quantity * price}</div>
			</Col>
		</Row>
	);
}

export default CartItems;
