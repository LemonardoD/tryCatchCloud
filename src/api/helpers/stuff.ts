export const jwtDate = () => {
	let date = new Date();
	date.setFullYear(date.getFullYear() + 1);
	return date;
};
