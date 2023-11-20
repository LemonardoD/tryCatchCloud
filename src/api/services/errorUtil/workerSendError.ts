import axios from "axios";
import { nanoid } from "nanoid";
import { parentPort } from "worker_threads";
import { WorkerErrorMessage } from "./types/typesUtil";

if (parentPort) {
	parentPort.on("message", async (data: WorkerErrorMessage) => {
		try {
			const { error, serializedReq, token, userContext } = data;
			if (error instanceof Error) {
				const errorData = {
					errLogId: nanoid(),
					user: token,
					errorName: error.name,
					errorMessage: error.message,
					url: serializedReq.url,
					query: serializedReq.query,
					params: serializedReq.params,
					method: serializedReq.method,
					stack: error.stack,
					context: userContext,
				};
				await axios.post(`https://trycatchcloud.fly.dev/api/err-log/new`, errorData);
			}
		} catch (err) {
			parentPort!.postMessage("Error logs have not been send.");
		}
	});
}
