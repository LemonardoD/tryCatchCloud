import axios from "axios";
import { parentPort } from "worker_threads";

export interface WorkerErrorMessage {
	user: string;
	errLogId: string;
	errorName: string;
	errorMessage: string;
	url: string;
	params: string | object;
	query: object | string;
	method: string;
	statusCode?: number;
	requestBody: object;
	responseBody: string;
	stack?: string;
	context: object;
}

if (parentPort) {
	parentPort.on("message", async (data: { error: WorkerErrorMessage }) => {
		try {
			const { error } = data;
			await axios.post(`https://trycatchcloud.fly.dev/api/err-log/new`, error);
			parentPort?.postMessage("Send.");
		} catch (err) {
			console.log("file: workerSendError.ts:28 ~ err:", err);
			parentPort?.postMessage("Error logs have not been send.");
		}
	});
}
