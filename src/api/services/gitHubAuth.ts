import axios from "axios";
import "dotenv/config";
import { GithubData } from "../types/apiTypes";

const { GITHUB_ID, GITHUB_SECRET } = <{ GITHUB_ID: string; GITHUB_SECRET: string }>process.env;

export const githubAuth = async (requestToken?: string) => {
	if (!requestToken) {
		throw new Error("No Token granted.");
	}
	try {
		const gitHubResp = await axios({
			method: "post",
			url: `https://github.com/login/oauth/access_token?client_id=${GITHUB_ID}&client_secret=${GITHUB_SECRET}&code=${requestToken}`,
			headers: {
				accept: "application/json",
			},
		});
		const { access_token } = gitHubResp.data;

		const gitHubUserInfo = await axios({
			method: "get",
			url: `https://api.github.com/user`,
			headers: {
				Authorization: "token " + access_token,
			},
		});
		const usInfo: GithubData = gitHubUserInfo.data;
		return usInfo;
	} catch (err) {
		throw new Error("Can not Get user info by this Token.");
	}
};
