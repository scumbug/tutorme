const dayjs = require('dayjs');
const areIntervalsOverlapping = require('date-fns/areIntervalsOverlapping');
var parseISO = require('date-fns/parseISO');

const clashCheck2 = (start1, end1, start2, end2) => {
	const check = dayjs(start1).isBefore(end2) && dayjs(end1).isAfter(start2);
	return check;
};

const clashCheck3 = (start1, end1, start2, end2) => {
	//const check = dayjs(start1).isBefore(end2) && dayjs(end1).isAfter(start2);
	return areIntervalsOverlapping(
		{ start: parseISO(start1), end: parseISO(end1) },
		{ start: parseISO(start2), end: parseISO(end2) }
	);
};

console.log(
	clashCheck3(
		'2021-01-13 01:00:00',
		'2021-01-13 07:00:00',
		'2021-01-13 04:00:00',
		'2021-01-13 06:00:00'
	)
);
