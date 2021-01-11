const dayjs = require('dayjs');

const clashCheck2 = (start1, end1, start2, end2) => {
	const check = dayjs(start1).isBefore(end2) && dayjs(end1).isAfter(start2);
	return check;
};

console.log(
	clashCheck2(
		'2021-01-13 03:00:00',
		'2021-01-13 04:00:00',
		'2021-01-13 04:00:00',
		'2021-01-13 06:00:00'
	)
);
