import React from 'react';
import { TabPane, Row, Col } from 'reactstrap';
import ProductCard from './ProductCard';
import { Product } from './productSlice';

interface Props {
	products: Product[];
}

function ProductTabPane({ products }: Props) {
	return (
		<>
			{Array.from(new Set(products.map(({ category }) => category))).map(
				(category, index) => (
					<TabPane key={index} tabId={category}>
						<Row>
							{products
								.filter((product) => product.category === category)
								.map((product) => (
									<Col key={product.product_id} sm="12" md="6" lg="4" xl="3">
										<ProductCard product={product} />
									</Col>
								))}
						</Row>
					</TabPane>
				)
			)}
		</>
	);
}

export default ProductTabPane;
