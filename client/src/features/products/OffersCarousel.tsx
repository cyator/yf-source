import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ProductCard from './ProductCard';
import { productState } from './productSlice';
import { useAppSelector } from '../../app/hooks';

function OffersCarousel() {
	const { products } = useAppSelector(productState);

	const responsive = {
		lg: {
			breakpoint: { max: 4000, min: 768 },
			items: 2,
		},
		sm: {
			breakpoint: { max: 768, min: 0 },
			items: 1,
		},
	};

	return (
		<Carousel
			infinite
			showDots
			responsive={responsive}
			autoPlay
			containerClass="py-3"
		>
			{products
				.filter(({ category }) => category === 'offers')
				.map((product) => (
					<ProductCard key={product.product_id} product={product} />
				))}
		</Carousel>
	);
}

export default OffersCarousel;
