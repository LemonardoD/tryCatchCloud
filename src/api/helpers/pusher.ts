import "dotenv/config";
import Pusher from "pusher";

const { PUSHER_API, PUSHER_KEY, PUSHER_SECRET } = <{ PUSHER_API: string; PUSHER_KEY: string; PUSHER_SECRET: string }>process.env;

export const pusher = new Pusher({
	appId: PUSHER_API,
	key: PUSHER_KEY,
	secret: PUSHER_SECRET,
	cluster: "eu",
	useTLS: true,
});
