import { decode } from "hono/jwt";
import { JwtToken } from "../types/apiTypes";
import { HTTPException } from "hono/http-exception";

export const jwtDecode = (token: string) => {
	try {
		const decodedToken: JwtToken = decode(token.replace("Bearer ", ""));
		if (new Date() > new Date(decodedToken.payload.expires)) {
			throw new HTTPException(403, { message: "JWT expires." });
		}
		return decodedToken.payload.userId;
	} catch (err: unknown | Error) {
		if (err instanceof Error) {
			throw new HTTPException(403, { message: err.message });
		}
	}
};

export const jwtDate = () => {
	let date = new Date();
	date.setMonth(date.getMonth() + 1);
	return date;
};
