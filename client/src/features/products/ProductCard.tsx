import React from 'react';
import { useDispatch } from 'react-redux';
import {
	Card,
	CardImg,
	Button,
	CardFooter,
	CardHeader,
	ButtonGroup,
} from 'reactstrap';
import { IoMdHeart } from 'react-icons/io';
import { addToCart } from '../cart/cartSlice';
import { Product } from './productSlice';
import { addToFavorites } from '../favorites/favoritesSlice';

interface Props {
	product: Product;
}

const ProductCard = ({ product }: Props) => {
	const dispatch = useDispatch();
	const { price, price_type, product_name, image } = product;

	return (
		<Card className="my-2">
			<CardHeader>
				<span className="text-capitalize font-weight-bold">{product_name}</span>
				<span className="font-weight-bold float-right">{`KES ${price}(${price_type})`}</span>
			</CardHeader>
			<CardImg
				top
				width="100%"
				src={`${process.env.REACT_APP_BASE_URL}api/images/${image}`}
				alt="product"
			/>

			<CardFooter className="p-0">
				<ButtonGroup className="w-100">
					<Button className="w-75" onClick={() => dispatch(addToCart(product))}>
						Add to cart
					</Button>
					<Button
						color="dark"
						className="w-25"
						onClick={() => dispatch(addToFavorites(product.product_id))}
					>
						<IoMdHeart />
					</Button>
				</ButtonGroup>
			</CardFooter>
		</Card>
	);
};

export default ProductCard;
