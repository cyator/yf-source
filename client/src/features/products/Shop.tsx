import React, { useEffect } from 'react';
import { TabContent, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { Container, Spinner } from 'reactstrap';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { productState, fetchAllProducts } from './productSlice';
import { tabState, setActiveTab } from './tabSlice';
import ProductTabPane from './ProductTabPane';

function Shop() {
	const { products, isLoading } = useAppSelector(productState);
	const { activeTab } = useAppSelector(tabState);

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchAllProducts());
	}, [dispatch]);

	const toggle = (tab: string) => {
		if (activeTab !== tab) {
			dispatch(setActiveTab(tab));
		}
	};

	return (
		<Container className="py-3">
			{isLoading ? (
				<div className="d-flex justify-content-center py-5">
					<Spinner />
				</div>
			) : (
				<>
					<Nav tabs>
						{Array.from(new Set(products.map(({ category }) => category))).map(
							(category, index) => (
								<NavItem key={index}>
									<NavLink
										className={classnames({ active: activeTab === category })}
										onClick={() => {
											toggle(category);
										}}
									>
										<span className="text-capitalize">{category}</span>
									</NavLink>
								</NavItem>
							)
						)}
					</Nav>
					<TabContent activeTab={activeTab}>
						<ProductTabPane products={products} />
					</TabContent>
				</>
			)}
		</Container>
	);
}

export default Shop;
