import { decode } from "hono/jwt";
import { JwtToken } from "../types/apiTypes";

export const userIdFromJwt = (token?: string) => {
	if (!token) {
		throw new Error("No Token was provided.");
	}
	const decodedToken: JwtToken = decode(token.replace("Bearer ", ""));
	const { userId } = decodedToken.payload;
	return userId;
};

export const jwtDate = () => {
	let date = new Date();
	date.setFullYear(date.getFullYear() + 1);
	return date;
};
