export type JwtToken = {
	header: { alg: string; typ: string };
	payload: {
		userId: string;
		expires: string;
	};
};
export type GithubData = { id: number; login: string; name: string | null; company: string | null; email: string | null };

export type NewError = {
	errLogId: string;
	projectName: string;
	user: string;
	errorName: string;
	errorMessage: string;
	method: string;
	url: string;
};
