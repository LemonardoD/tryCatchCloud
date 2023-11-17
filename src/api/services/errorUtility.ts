import axios from "axios";
import "dotenv/config";
import jwt from "jsonwebtoken";

const { API_SERV, JWT_SECRET } = <{ API_SERV: string; JWT_SECRET: string }>process.env;

type JwtEncoded = {
	userId: string;
	expires: string;
};

class ErrorUtility {
	async sendErrorFromHandler(error: unknown | Error, req: any, token: string) {
		try {
			const decodedUserToken = jwt.verify(token, JWT_SECRET);
			const { userId } = decodedUserToken as JwtEncoded;
			if (error instanceof Error) {
				const errorData = {
					user: userId,
					errorName: error.name,
					message: error.message,
					file: error.stack ? error.stack.replaceAll("\n    ", "").split("at ")[1] : null,
					reqUrl: req.originalUrl,
				};
				await axios.post(`${API_SERV}/api/err-log/new`, errorData);
			}
		} catch (err) {
			console.error("Error logs have not been send.");
		}
	}
}

export default new ErrorUtility();
