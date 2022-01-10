import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import { useAppSelector } from '../../app/hooks';
import { authState } from './authSlice';
import { addressState } from '../address/addressSlice';
import PageTitle from '../misc/PageTitle';

function Profile() {
	const [isSubscribed] = useState(false);
	const { user } = useAppSelector(authState);
	const { default_address } = useAppSelector(addressState);

	return (
		<>
			<PageTitle name="Profile" />
			<Card>
				<CardHeader className="font-weight-bold">
					Account information
				</CardHeader>
				<CardBody>
					<div className="d-flex justify-content-between align-items-center">
						<div>Username: {user.username}</div>

						<Button className="px-0" color="link">
							Change
						</Button>
					</div>
					<div className="d-flex justify-content-between align-items-center">
						<div>Email: {user.email}</div>

						<Button className="px-0" color="link">
							Change
						</Button>
					</div>

					<div className="d-flex justify-content-between align-items-center">
						<div>Password: **********</div>

						<Button className="px-0" color="link">
							Change
						</Button>
					</div>
				</CardBody>
			</Card>
			<Card>
				<CardHeader className="font-weight-bold">
					Personal information
				</CardHeader>
				<CardBody>
					<div>First name: {default_address.first_name}</div>
					<div>Last name: {default_address.last_name}</div>
					<div>Phone number: {default_address.mobile_phone_number}</div>
				</CardBody>
			</Card>

			<Card>
				<CardHeader className="font-weight-bold">Newsletter</CardHeader>
				<CardBody>
					{
						<div className="d-flex justify-content-between align-items-center">
							<span>
								{isSubscribed === true
									? 'You are subscribed to our newsletter'
									: 'You are not subscribed to our newsletter'}
							</span>
							<Button color="primary">
								{isSubscribed === true ? 'Unsubscribe' : 'Subscribe'}
							</Button>
						</div>
					}
				</CardBody>
			</Card>
		</>
	);
}

export default Profile;
