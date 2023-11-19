import "dotenv/config";
import url from "url";
import axios from "axios";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { parentPort } from "worker_threads";

const { API_SERV, JWT_SECRET } = process.env;

parentPort.on("message", async ({ error, req, token }) => {
	try {
		const decodedUserToken = jwt.verify(token, JWT_SECRET);
		const { userId } = decodedUserToken;
		if (error instanceof Error) {
			const errorData = {
				errLogId: nanoid(),
				user: userId,
				errorName: error.name,
				errorMessage: error.message,
				url: req.url,
				query: req.url ? url.parse(req.url, true) : "empty",
				params: req.params,
				method: req.method,
				stack: error.stack,
			};
			await axios.post(`${API_SERV}/api/err-log/new`, errorData);
		}
	} catch (err) {
		parentPort.postMessage("Error logs have not been send.");
	}
});
