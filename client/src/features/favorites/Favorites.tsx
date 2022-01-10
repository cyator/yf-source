import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Row, Col, Media, CardBody } from 'reactstrap';
import {
	fetchAllFavorites,
	favoritesState,
	removeFromFavorites,
} from './favoritesSlice';
import { addToCart } from '../cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PageTitle from '../misc/PageTitle';

function Favorites() {
	const { favorites } = useAppSelector(favoritesState);
	const dispatch = useAppDispatch();
	const history = useHistory();

	useEffect(() => {
		dispatch(fetchAllFavorites());
	}, [dispatch]);

	return (
		<>
			<Row>
				<Col>
					<span>
						<PageTitle name="Favorites" badge={favorites.length} />
					</span>
				</Col>
				{favorites.length > 0 && false && (
					<Col>
						<Button
							outline
							color="primary"
							className="float-right"
							onClick={() => console.log('clearing favorites')}
						>
							Clear Favorites
						</Button>
					</Col>
				)}
			</Row>
			{favorites.length > 0 ? (
				<Card>
					<CardBody className="pt-0">
						{favorites.map(
							({
								favorite_id,
								product_id,
								product_name,
								price,
								price_type,
								category,
								stock,
								image,
							}) => (
								<Card key={favorite_id} className="my-3">
									<Row className="py-2">
										<Col>
											<div className="d-flex">
												<Media
													style={{ maxHeight: '80px' }}
													object
													src={`${process.env.REACT_APP_BASE_URL}api/images/${image}`}
													alt="Product"
													className="mr-2"
												/>
												<div>
													<p className="m-0 text-capitalize">{product_name}</p>
													<br />
													<small>{`Price: KES.${price} ${price_type}`}</small>
												</div>
											</div>
										</Col>
										<Col>
											<Button
												color="link"
												onClick={() =>
													dispatch(removeFromFavorites(favorite_id))
												}
											>
												Remove
											</Button>
										</Col>
										<Col className="py-1">
											<Button
												color="primary"
												onClick={() => {
													dispatch(
														addToCart({
															product_id,
															product_name,
															price,
															price_type,
															category,
															stock,
															image,
															quantity: 1,
														})
													);
													history.push('/cart');
												}}
											>
												Buy now
											</Button>
										</Col>
									</Row>
								</Card>
							)
						)}
					</CardBody>
				</Card>
			) : (
				<div>Your favorites appear here</div>
			)}
		</>
	);
}

export default Favorites;
