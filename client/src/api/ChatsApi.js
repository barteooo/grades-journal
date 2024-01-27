import config from "../config";
import AuthService from "../services/AuthService";

class ChatsApi {
  static async getChat(currentUserId, userId) {
    const queryString = `?currentUserId=${currentUserId}&userId=${userId}`;

    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/chats${queryString}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false };
    }

    return { success: true, chat: data.chat };
  }
}

export default ChatsApi;
