import { AxiosError } from "axios";
import { Worker } from "worker_threads";

class ErrorUtility {
	async sendErrorFromHandler(error: unknown | Error, req: any, token: string) {
		const worker = new Worker("./workerSendError.js", {
			workerData: { error, req, token },
		});

		worker.postMessage({ error, req, token });

		worker.on("message", result => {
			console.log("Result from worker:", result);
		});

		worker.on("error", error => {
			console.error("Error in worker:", error);
		});
	}
	async formatAxiosError(error: AxiosError<any, any>, token: string) {
		const worker = new Worker("./workerAxiosError.js", {
			workerData: { error, token },
		});

		worker.postMessage({ error, token });

		worker.on("message", result => {
			console.log("Result from worker:", result);
		});

		worker.on("error", error => {
			console.error("Error in worker:", error);
		});
	}
	// async sendErrorFromHandler(error: unknown | Error, req: any, token: string) {
	// 	try {
	// 		const decodedUserToken = jwt.verify(token, JWT_SECRET);
	// 		const { userId } = decodedUserToken as JwtEncoded;
	// 		if (error instanceof Error) {
	// 			const errorData: FormattedError = {
	// 				errLogId: nanoid(),
	// 				user: userId,
	// 				errorName: error.name,
	// 				errorMessage: error.message,
	// 				url: req.url,
	// 				query: url.parse(req.url, true),
	// 				params: req.params,
	// 				method: req.method,
	// 				stack: error.stack,
	// 			};
	// 			await axios.post(`${API_SERV}/api/err-log/new`, errorData);
	// 		}
	// 	} catch (err) {
	// 		console.error("Error logs have not been send.");
	// 	}
	// }

	// formatAxiosError = async (error: AxiosError<any, any>, token: string) => {
	// try {
	// 	const decodedUserToken = jwt.verify(token, JWT_SECRET);
	// 	const { userId } = decodedUserToken as JwtEncoded;
	// 	const { config, response } = error;
	// 	const requestBody = config?.data;
	// 	const responseBody = response?.data;
	// 	const errorData: FormattedAxiosError = {
	// 		errLogId: nanoid(),
	// 		user: userId,
	// 		errorName: error.name,
	// 		errorMessage: error.message,
	// 		url: config?.url || "",
	// 		query: config?.url ? url.parse(config?.url, true) : {},
	// 		params: config?.params,
	// 		method: config?.method?.toUpperCase() || "",
	// 		statusCode: response?.status || 0,
	// 		requestBody: requestBody ? JSON.parse(requestBody) : "Empty",
	// 		responseBody: responseBody,
	// 		stack: error.stack,
	// 	};
	// 	await axios.post(`${API_SERV}/api/err-log/new`, errorData);
	// } catch (err) {
	// 	console.error("Error logs have not been send.");
	// }
	// };
}

export default new ErrorUtility();
