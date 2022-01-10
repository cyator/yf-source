import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import AddressCard from './AddressCard';
import {
	fetchAllAddresses,
	addressState,
	clearError,
	Address,
	fetchDefaultAddress,
} from './addressSlice';
import { toast } from 'react-toastify';
import AddressForm from './AddressForm';
import { CardBody, Card, Button } from 'reactstrap';
import PageTitle from '../misc/PageTitle';

function Addresses() {
	const [showAddressForm, setShowAddressForm] = useState(false);
	const [iscreatingAddress, setIscreatingAddress] = useState(false);
	const [currentAddress, setCurrentAddress] = useState<Address | undefined>();
	const { addresses, error } = useAppSelector(addressState);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (error?.status) {
			console.log(error);
			toast.error(`status: ${error.status} message: ${error.message}`);
			dispatch(clearError());
		}
	}, [error, dispatch]);

	const addDeliveryAddress = () => {
		setIscreatingAddress(true);
		setShowAddressForm(true);
	};
	useEffect(() => {
		dispatch(fetchAllAddresses());
		dispatch(fetchDefaultAddress());
	}, [dispatch]);

	const closeAddressForm = () => {
		setCurrentAddress(undefined);
		setShowAddressForm(false);
	};

	return (
		<>
			<PageTitle name="Addresses" badge={addresses.length} />

			<Card>
				<CardBody>
					{showAddressForm ? (
						<AddressForm
							close={closeAddressForm}
							currentAddress={currentAddress}
							onComplete={(value) => value && closeAddressForm()}
							iscreatingAddress={iscreatingAddress}
						/>
					) : (
						<>
							{addresses
								.map((address) => (
									<AddressCard
										address={address}
										key={address.address_id}
										changeAddress={(shouldChange: boolean) => {
											setShowAddressForm(shouldChange);
											setCurrentAddress(address);
										}}
									/>
								))
								.reverse()}
						</>
					)}
					<div className="py-3">
						{!showAddressForm && (
							<Button
								onClick={addDeliveryAddress}
								className="w-100"
								color="primary"
								outline
							>
								Add delivery address
							</Button>
						)}
					</div>
				</CardBody>
			</Card>
		</>
	);
}

export default Addresses;
