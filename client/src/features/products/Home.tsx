import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spinner, Container } from 'reactstrap';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchAllProducts, productState } from './productSlice';
// import { fetchAllOffers, offerState } from './offerSlice';
import Landing from './Landing';
import OffersCarousel from './OffersCarousel';
import ProductsCarousel from './ProductsCarousel';
import Newsletter from '../newsletter/Newsletter';

function Home() {
	const { isLoading: productIsLoading } = useAppSelector(productState);
	// const { isLoading: offerIsLoading } = useAppSelector(offerState);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchAllProducts());
	}, [dispatch]);
	// useEffect(() => {
	// 	dispatch(fetchAllOffers());
	// }, [dispatch]);

	return (
		<div>
			<Landing />
			<Container>
				{productIsLoading ? (
					<div className="d-flex justify-content-center py-5">
						<Spinner />
					</div>
				) : (
					<>
						<div className="py-5">
							<div className="d-flex justify-content-between">
								<h5 className="font-weight-bold">Special Offers</h5>
								<span>
									<Link to="/shop">see all</Link>
								</span>
							</div>

							<OffersCarousel />
						</div>
						<div className="py-5">
							<h5 className="font-weight-bold">Our Products</h5>
							<ProductsCarousel />
						</div>
					</>
				)}

				<div className="py-5">
					<Newsletter />
				</div>
			</Container>
		</div>
	);
}

export default Home;
