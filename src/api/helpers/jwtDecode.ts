import { decode } from "hono/jwt";
import { JwtToken } from "../types/apiTypes";

export const jwtDecode = (token: string) => {
	const decodedToken: JwtToken = decode(token.replace("Bearer ", ""));
	const apiKey = decodedToken.payload.userId;
	return apiKey;
};

export const jwtDate = () => {
	let date = new Date();
	date.setFullYear(date.getFullYear() + 1);
	return date;
};
