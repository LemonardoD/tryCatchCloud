import url from "url";
import axios from "axios";
import { nanoid } from "nanoid";
import { parentPort } from "worker_threads";
import { WorkerAxiosErrorMessage } from "./types/typesUtil";

if (parentPort) {
	parentPort.on("message", async (data: WorkerAxiosErrorMessage) => {
		try {
			const { error, token, userContext } = data;
			const { config, response } = error;
			const requestBody = config?.data;
			const responseBody = response?.data;
			const errorData = {
				errLogId: nanoid(),
				user: token,
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
				context: userContext,
			};
			await axios.post(`https://trycatchcloud.fly.dev/api/err-log/new`, errorData);
		} catch (err) {
			parentPort!.postMessage("Error logs have not been send.");
		}
	});
}
