const getTimestamp = () => {
	const date = new Date();
	const appendZero = (n) => (n < 10 ? '0' + n : n);

	let YYYY = date.getFullYear();
	let MM = appendZero(date.getMonth() + 1);
	let DD = appendZero(date.getDate());
	let HH = appendZero(date.getHours());
	let mm = appendZero(date.getMinutes());
	let ss = appendZero(date.getSeconds());
	return `${YYYY}${MM}${DD}${HH}${mm}${ss}`;
};
module.exports = getTimestamp();
