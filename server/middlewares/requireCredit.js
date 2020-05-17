module.exports = (req, res, next) => {
	if (!hasEnoughCredit(req)) {
		res.status(403).send({ error: 'Not enough credits!'});
	}

	next();
};

function hasEnoughCredit(req) {
	const minimumCredit = 1;
	return req.user.credits >= minimumCredit;
}

