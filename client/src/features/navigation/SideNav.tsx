import React, { useEffect } from 'react';
import classnames from 'classnames';
import {
	Col,
	Container,
	Row,
	TabContent,
	TabPane,
	ListGroup,
	ListGroupItem,
} from 'reactstrap';
import Profile from '../auth/Profile';
import Orders from '../cart/Orders';
import Favorites from '../favorites/Favorites';
import Addresses from '../address/Addresses';
import { logout } from '../auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { sideNavState, setActiveTab } from './sideNavSlice';

function SideNav({ history, location: { pathname } }: any) {
	const { activeTab } = useAppSelector(sideNavState);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setActiveTab(pathname));
	}, [dispatch, pathname]);

	const toggle = (tab: string) => {
		if (activeTab !== tab) {
			dispatch(setActiveTab(tab));
		}
	};

	return (
		<Container className="py-3">
			<Row>
				<Col xs="3" className="py-5">
					<ListGroup flush>
						<ListGroupItem
							action
							className={classnames({ active: activeTab === '/profile' })}
							tag="button"
							onClick={() => {
								toggle('/profile');
							}}
						>
							Profile
						</ListGroupItem>

						<ListGroupItem
							action
							tag="button"
							className={classnames({ active: activeTab === '/orders' })}
							onClick={() => {
								toggle('/orders');
							}}
						>
							Orders
						</ListGroupItem>

						<ListGroupItem
							action
							tag="button"
							className={classnames({ active: activeTab === '/favorites' })}
							onClick={() => {
								toggle('/favorites');
							}}
						>
							Favorites
						</ListGroupItem>

						<ListGroupItem
							action
							tag="button"
							className={classnames({ active: activeTab === '/addresses' })}
							onClick={() => {
								toggle('/addresses');
							}}
						>
							Addresses
						</ListGroupItem>
						<ListGroupItem
							tag="button"
							color="dark"
							className="text-capitalize font-weight-bold"
							onClick={() => {
								dispatch(logout(history));
							}}
						>
							Logout
						</ListGroupItem>
					</ListGroup>
				</Col>
				<Col xs="9">
					<TabContent activeTab={activeTab}>
						<TabPane tabId={'/profile'}>
							<Profile />
						</TabPane>
						<TabPane tabId={'/orders'}>
							<Orders />
						</TabPane>
						<TabPane tabId={'/favorites'}>
							<Favorites />
						</TabPane>
						<TabPane tabId={'/addresses'}>
							<Addresses />
						</TabPane>
					</TabContent>
				</Col>
			</Row>
		</Container>
	);
}

export default SideNav;
