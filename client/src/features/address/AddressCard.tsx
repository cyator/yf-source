import React from 'react';
import { MdDelete } from 'react-icons/md';
import { Card, CardBody, CardFooter, Row, Col, Button } from 'reactstrap';
import {
	Address,
	deleteAddress,
	updateDefaultAddress,
	addressState,
} from './addressSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

interface Props {
	address: Address;
	changeAddress: (shouldChange: boolean) => void;
}

function AddressCard({ address, changeAddress }: Props) {
	const { default_address } = useAppSelector(addressState);
	const {
		address_id,
		first_name,
		last_name,
		mobile_phone_number,
		alternate_phone_number,
		delivery_address,
		county,
		town,
	} = address;
	const dispatch = useAppDispatch();
	return (
		<Card>
			<CardBody>
				<Row>
					<Col xs="11">
						<div>
							<b>First Name: </b>
							{first_name}
						</div>
						<div>
							<b>Last Name:</b> {last_name}
						</div>
						<div>
							<b>Mobile phone number:</b> {`254${mobile_phone_number}`}
						</div>
						{alternate_phone_number && (
							<div>
								<b>Alternate phone number:</b> {`254${alternate_phone_number}`}
							</div>
						)}
						<div>
							<b>Delivery address:</b> {delivery_address}
						</div>
						<div>
							<b>County:</b> {county}
						</div>
						<div>
							<b>Town: </b>
							{town}
						</div>
					</Col>
					<Col xs="1">
						{!(default_address.address_id === address_id) && (
							<Button
								onClick={() =>
									address_id && dispatch(deleteAddress(address_id))
								}
								className="px-2"
								color="link"
							>
								<MdDelete size={24} />
							</Button>
						)}
					</Col>
				</Row>
			</CardBody>
			<CardFooter className="d-flex justify-content-between">
				<div>
					<Button
						onClick={() => changeAddress(true)}
						className="px-0"
						color="link"
					>
						Change
					</Button>
				</div>
				{default_address.address_id === address_id ? (
					<div>Default Address</div>
				) : (
					<Button
						onClick={() =>
							address_id && dispatch(updateDefaultAddress(address_id))
						}
						className="px-0"
						color="link"
					>
						Make default address
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}

export default AddressCard;
