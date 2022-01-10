import React from 'react';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	// Progress,
} from 'reactstrap';
import { queryPayment, stkState } from './stkSlice';
import { modalState } from './modalSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useHistory } from 'react-router';

const PaymentModal = () => {
	const { simResponse } = useAppSelector(stkState);
	const { modal } = useAppSelector(modalState);
	const history = useHistory();
	const dispatch = useAppDispatch();

	return (
		<div>
			<Modal isOpen={modal}>
				<ModalHeader>Payment</ModalHeader>
				<ModalBody>
					A payment prompt will appear on your screen. Click on done after
					paying to confirm your payment
					{/* <Progress animated striped color="info" value={5} max={10}>
						confirming payment 50%
					</Progress> */}
				</ModalBody>
				<ModalFooter>
					{/* <Button color="secondary" onClick={() => console.log('cancelling')}>
						use paybill
					</Button> */}
					<Button
						color="primary"
						onClick={() =>
							dispatch(
								queryPayment({
									CheckoutRequestID: simResponse.CheckoutRequestID,
									history,
								})
							)
						}
					>
						Done
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};

export default PaymentModal;
