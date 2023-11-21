import { decode } from "hono/jwt";
import { JwtToken } from "../types/apiTypes";
import { HTTPException } from "hono/http-exception";

export const userIdFromJwt = (token?: string) => {
	if (!token) {
		throw new HTTPException(401, { message: "No Token granted." });
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
