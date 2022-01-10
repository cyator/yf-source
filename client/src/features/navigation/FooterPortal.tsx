import React from 'react';
import ReactDOM from 'react-dom';
import Footer from './Footer';

function FooterPortal() {
	return ReactDOM.createPortal(
		<Footer />,
		document.getElementById('footer-root')!
	);
}

export default FooterPortal;
