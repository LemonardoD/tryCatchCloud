import { AxiosError } from "axios";

export type SerializedReq = {
	method: string;
	url: string;
	body: object;
	query: string | null;
	params: object;
};

export interface WorkerAxiosErrorMessage {
	error: AxiosError<any, any>;
	token: string;
	userContext?: object;
}

export interface WorkerErrorMessage {
	error: unknown | Error;
	serializedReq: SerializedReq;
	token: string;
	userContext?: object;
}
