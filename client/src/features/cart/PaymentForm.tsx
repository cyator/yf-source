import React, { useState } from 'react';
import {
	Form,
	FormGroup,
	Label,
	Input,
	Card,
	CardBody,
	Media,
} from 'reactstrap';

import mpesa from '../../images/mpesa.png';
import card from '../../images/card.png';
import paypal from '../../images/paypal.png';
import Mpesa from './Mpesa';
import Debit from './Debit';
import Paypal from './Paypal';

export type FormValues = {
	paymentMethod: 'mpesa' | 'card' | 'paypal';
	phone_number: string;
};

function PaymentForm() {
	const [paymentMethod, setPaymentMethod] = useState('mpesa');

	return (
		<>
			<Form>
				<FormGroup tag="fieldset">
					<FormGroup check>
						<Label check>
							<Input
								type="radio"
								name="payment"
								value="mpesa"
								checked={paymentMethod === 'mpesa'}
								onChange={(e) => setPaymentMethod(e.target.value)}
							/>
							<span>Mpesa</span>
							<Media
								style={{ maxWidth: '50px' }}
								object
								src={mpesa}
								alt="mpesa logo"
							/>
						</Label>
					</FormGroup>
					<FormGroup check>
						<Label check>
							<Input
								type="radio"
								name="payment"
								value="card"
								checked={paymentMethod === 'card'}
								onChange={(e) => setPaymentMethod(e.target.value)}
							/>
							<span>Debit/Credit Card</span>

							<Media
								style={{ maxWidth: '50px' }}
								object
								src={card}
								alt="mpesa logo"
							/>
						</Label>
					</FormGroup>
					<FormGroup check>
						<Label check>
							<Input
								type="radio"
								name="payment"
								value="paypal"
								checked={paymentMethod === 'paypal'}
								onChange={(e) => setPaymentMethod(e.target.value)}
							/>

							<span>Paypal</span>
							<Media
								style={{ maxWidth: '50px' }}
								object
								src={paypal}
								alt="mpesa logo"
							/>
						</Label>
					</FormGroup>
				</FormGroup>
			</Form>
			<Card>
				<CardBody className="py-3">
					{paymentMethod === 'mpesa' && <Mpesa />}
					{paymentMethod === 'card' && <Debit />}
					{paymentMethod === 'paypal' && <Paypal />}
				</CardBody>
				{/* <Button className="w-100">Pay</Button> */}
			</Card>
		</>
	);
}

export default PaymentForm;
