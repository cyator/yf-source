import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useAppSelector } from '../../app/hooks';
import { productState } from './productSlice';

function ProductsCarousel() {
	const { products } = useAppSelector(productState);
	const responsive = {
		xl: {
			breakpoint: { max: 4000, min: 992 },
			items: 3,
			partialVisibilityGutter: 50,
		},
		lg: {
			breakpoint: { max: 992, min: 768 },
			items: 2,
			partialVisibilityGutter: 50,
		},
		md: {
			breakpoint: { max: 768, min: 576 },
			items: 1,
			partialVisibilityGutter: 200,
		},
		sm: {
			breakpoint: { max: 576, min: 0 },
			items: 1,
			partialVisibilityGutter: 40,
		},
	};

	return (
		<div>
			{Array.from(
				new Set(
					products
						.filter(({ category }) => category !== 'offers')
						.map(({ category }) => category)
				)
			).map((category, index) => (
				<div key={index}>
					<div className="d-flex justify-content-between">
						<h6 className="font-weight-bold text-capitalize">{category}</h6>
						<span>
							<Link to={{ pathname: '/shop', state: { from: category } }}>
								see all
							</Link>
						</span>
					</div>
					<Carousel
						removeArrowOnDeviceType={['md', 'sm']}
						infinite
						partialVisible={true}
						responsive={responsive}
					>
						{products
							.filter((product) => product.category === category)
							.map((product) => (
								<ProductCard key={product.product_id} product={product} />
							))}
					</Carousel>
				</div>
			))}
		</div>
	);
}

export default ProductsCarousel;
