import "dotenv/config";
import url from "url";
import axios from "axios";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { parentPort } from "worker_threads";

const { API_SERV, JWT_SECRET } = process.env;

parentPort.on("message", async ({ error, token }) => {
	try {
		const decodedUserToken = jwt.verify(token, JWT_SECRET);
		const { userId } = decodedUserToken;
		const { config, response } = error;
		const requestBody = config?.data;
		const responseBody = response?.data;
		const errorData = {
			errLogId: nanoid(),
			user: userId,
			errorName: error.name,
			errorMessage: error.message,
			url: config?.url || "",
			query: config?.url ? url.parse(config?.url, true) : {},
			params: config?.params,
			method: config?.method?.toUpperCase() || "",
			statusCode: response?.status || 0,
			requestBody: requestBody ? JSON.parse(requestBody) : "Empty",
			responseBody: responseBody,
			stack: error.stack,
		};
		await axios.post(`${API_SERV}/api/err-log/new`, errorData);
	} catch (err) {
		parentPort.postMessage("Error logs have not been send.");
	}
});
