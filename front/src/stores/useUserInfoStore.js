import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const useUserInfoStore = defineStore("userInfo", () => {
  const URL = { 1: "http://192.168.0.2/vue", 2: "http://localhost/vue" };
  const isLoginCheck = async () => {
    const token = localStorage.accessToken;
    console.log(token);
    if (!token) {
      return false;
    }
    let res = true;
    const userId = decodedToken(token);
    console.log(userId);
    res = await _accessTokenCheck(userId);
    return res;
  };

  const decodedToken = (token) => {
    const decoded = jwtDecode(token);
    return decoded.userId;
  };

  const _accessTokenCheck = async (userId) => {
    if (!localStorage.accessToken) return false;
    let accessToken = localStorage.accessToken;
    try {
      const res = await axios.get(`${URL[1]}/user/info/${userId}`, {
        headers: {
          Authorization: accessToken,
        },
      });
    } catch (err) {
      if (err.response.status === 401) {
        return false;
      }
    }
    return true;
  };

  const loginProcess = (token) => {
    localStorage.setItem("accessToken", token);
  };

  return {
    loginProcess,
    decodedToken,
    isLoginCheck,
  };
});