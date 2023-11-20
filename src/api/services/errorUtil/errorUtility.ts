import url from "url";
import { AxiosError } from "axios";
import { Worker } from "worker_threads";
import { Request } from "express";

class ErrorUtility {
	extractExpressSerializableReqData(req: Request) {
		const currentUrl = new URL(req.protocol + "://" + req.get("host") + req.originalUrl);
		const paramsArr: string[][] = [];
		currentUrl.searchParams.forEach((elValue, elKey) => {
			paramsArr.push([elKey, elValue]);
		});
		const params: object = Object.fromEntries(paramsArr);
		return {
			method: req.method,
			url: req.protocol + "://" + req.get("host") + req.originalUrl,
			body: req.body,
			query: req.url ? url.parse(req.url, true) : null,
			params: params,
		};
	}
	async sendErrorFromHandler(error: unknown | Error, req: unknown, token: string, userContext?: object) {
		try {
			const serializedReq = this.extractExpressSerializableReqData(req as Request);
			const worker = new Worker("C:/Users/MSI/VS_Projects/tryCatchCloud/src/api/services/errorUtil/workerSendError.ts", {
				workerData: { error, serializedReq, token, userContext },
			});

			worker.postMessage({ error, serializedReq, token, userContext });

			worker.on("message", result => {
				console.log("Result from worker:", result);
				worker.terminate();
			});

			worker.on("error", error => {
				console.error("Error in worker:", error);
				worker.terminate();
			});
		} catch (err) {
			console.error("Logs Have not been sended.");
		}
	}
	async formatAxiosError(error: AxiosError<any, any>, token: string, userContext: object) {
		try {
			const worker = new Worker("./workerAxiosError.js", {
				workerData: { error, token, userContext },
			});

			worker.postMessage({ error, token, userContext });

			worker.on("message", result => {
				console.log("Result from worker:", result);
				worker.terminate();
			});

			worker.on("error", error => {
				console.error("Error in worker:", error);
				worker.terminate();
			});
		} catch (err) {
			console.error("Logs Have not been sended.");
		}
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
