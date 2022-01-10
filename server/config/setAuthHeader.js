const setAuthHeader = (req) => ({
	'Content-Type': 'application/json',
	Authorization: `Bearer ${req.access_token}`,
});

module.exports = setAuthHeader;
