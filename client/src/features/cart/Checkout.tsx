import React, { useState, useEffect, useRef } from 'react';
import {
	Container,
	Row,
	Col,
	Card,
	CardHeader,
	CardBody,
	Collapse,
	Button,
} from 'reactstrap';
import OrderSummary from './OrderSummary';
import AddressForm from '../address/AddressForm';
import PaymentForm from './PaymentForm';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { addressState, fetchDefaultAddress } from '../address/addressSlice';

function Checkout({ location }: any) {
	const { default_address } = useAppSelector(addressState);

	const [addressIsOpen, setAddressIsOpen] = useState(true);
	const [paymentIsOpen, setPaymentIsOpen] = useState(false);
	const [isAddressComplete, setIsAddressComplete] = useState(false);

	const dispatch = useAppDispatch();

	const addressRef = useRef(null);

	useEffect(() => {
		dispatch(fetchDefaultAddress());
	}, [dispatch]);

	useEffect(() => {
		Object.keys(default_address).length > 0
			? setIsAddressComplete(true)
			: setIsAddressComplete(false);
	}, [default_address]);

	useEffect(() => {
		isAddressComplete ? setPaymentIsOpen(true) : setPaymentIsOpen(false);
	}, [isAddressComplete]);

	const toggleAddress = () => setAddressIsOpen(!addressIsOpen);
	const togglePayment = () => setPaymentIsOpen(!paymentIsOpen);

	const {
		first_name,
		last_name,
		mobile_phone_number,
		alternate_phone_number,
		delivery_address,
		county,
		town,
	} = default_address;

	return (
		<Container className="py-3">
			<Row>
				<Col xs={{ size: 12, order: 2 }} md={{ size: 7, order: 1 }}>
					<Card>
						<CardHeader className="d-flex justify-content-between align-items-center">
							<Button color="link" onClick={toggleAddress}>
								1. DELIVERY ADDRESS
							</Button>
							{isAddressComplete && (
								<span>
									<IoMdCheckmarkCircleOutline />
									completed
								</span>
							)}
						</CardHeader>
						<Collapse isOpen={addressIsOpen}>
							<CardBody innerRef={addressRef}>
								{isAddressComplete ? (
									<div>
										<div>First Name: {first_name}</div>
										<div>Last Name: {last_name}</div>
										<div>
											Mobile phone number: {`+254${mobile_phone_number}`}
										</div>
										{alternate_phone_number && (
											<div>
												Alternate phone number: {alternate_phone_number}
											</div>
										)}
										<div>Delivery address: {delivery_address}</div>
										<div>County: {county}</div>
										<div>Town: {town}</div>
										<div>
											<Button
												className="px-0"
												color="link"
												onClick={() => {
													setIsAddressComplete(false);
												}}
											>
												Change
											</Button>
										</div>
									</div>
								) : (
									<AddressForm
										onComplete={(value) => setIsAddressComplete(value)}
										currentAddress={default_address}
										iscreatingAddress={default_address ? false : true}
										close={() => setIsAddressComplete(true)}
									/>
								)}
							</CardBody>
						</Collapse>
					</Card>
					<Card>
						<CardHeader>
							<Button color="link" onClick={togglePayment}>
								2. PAYMENT METHOD
							</Button>
						</CardHeader>
						<Collapse isOpen={paymentIsOpen}>
							<CardBody>
								<h6>Choose payment method</h6>
								<PaymentForm />
							</CardBody>
						</Collapse>
					</Card>
				</Col>
				<Col xs={{ size: 12, order: 1 }} md={{ size: 5, order: 2 }}>
					<OrderSummary />
				</Col>
			</Row>
		</Container>
	);
}

export default Checkout;
