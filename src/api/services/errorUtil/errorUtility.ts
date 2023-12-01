import url from "url";
import { Worker } from "worker_threads";
import { nanoid } from "nanoid";
import { AxiosError } from "axios";

export class ErrorUtility {
	projectName: string;
	constructor(projectName: string) {
		this.projectName = projectName;
	}
	async sendErrorFromHandler(
		error: Error,
		token: string,
		request: { url: string; method: string; path: string; body: object | null; query: Function | object },
		userContext?: object
	) {
		try {
			const processedError = this.errParsing(error, userContext);
			const processedReq = this.reqDataParsing(request);
			const mergerReqAndError = { ...processedError, ...processedReq };
			return await this.startWorker({ ...mergerReqAndError, ...{ user: token }, ...{ projectName: this.projectName } });
			// if (request) {
			// const processedReq = this.expressReqDataParsing(request as Request);
			// const mergerReqAndError = { ...processedError, ...processedReq };
			// return this.startWorker({ ...mergerReqAndError, ...{ user: token } });
			// }
			// const graphQlError = {
			// 	...processedError,
			// 	...{
			// 		method: "",
			// 		url: error.path,
			// 		requestBody: null,
			// 		query: null,
			// 	},
			// };
			// return this.startWorker({ ...graphQlError, ...{ user: token } });
		} catch (err) {
			console.error("Logs Have not been sended.");
		}
	}

	private async startWorker(error: any) {
		try {
			const worker = new Worker("C:/Users/MSI/VS_Projects/tryCatchCloud/src/api/services/errorUtil/workerSendError.ts", {
				workerData: { error },
			});
			worker.postMessage({ error });
			worker.on("message", result => {
				console.log("Result from worker:", result);
				worker.terminate();
			});

			worker.on("error", error => {
				console.error("Error in worker:", error);
				worker.terminate();
			});
		} catch (err) {
			console.error("Worker collapse.");
		}
	}

	private errParsing = (error: Error, context?: object) => {
		if (error.name === "AxiosError") {
			const { config, response } = error as AxiosError<any, any>;
			const requestBody = config?.data;
			const responseBody = response?.data;
			const axiosDetails = {
				url: config?.url ? config?.url : "{}",
				query: config?.url ? url.parse(config?.url, true) : {},
				params: config?.params ? config?.params : "{}",
				method: config?.method?.toUpperCase() || "",
				statusCode: response?.status || 0,
				requestBody: requestBody ? JSON.parse(requestBody) : "Empty",
				responseBody: responseBody,
			};
			return {
				errLogId: nanoid(),
				errorName: error.name,
				errorMessage: error.message,
				stack: error.stack,
				context,
				axiosDetails,
			};
		}
		return {
			errLogId: nanoid(),
			errorName: error.name,
			errorMessage: error.message,
			stack: error.stack,
			context,
		};
	};

	private reqDataParsing(req: { url: string; method: string; path: string; body: object | null; query: Function | object }) {
		if (typeof req.query === "function") {
			const getQuery = Object.keys(req.query()).length ? req.query() : null;
			const body = req.body ? (Object.keys(req.body).length ? req.body : null) : null;
			return {
				method: req.method.toUpperCase(),
				url: req.path,
				requestBody: body,
				query: getQuery,
			};
		}
		const body = req.body ? (Object.keys(req.body).length ? req.body : null) : null;
		return {
			method: req.method.toUpperCase(),
			url: req.path,
			requestBody: body,
			query: Object.keys(req.query).length ? req.query : null,
		};
	}
}
