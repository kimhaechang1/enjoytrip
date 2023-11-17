import { defineStore } from "pinia";
import { ref } from "vue";
import { jwtDecode } from "jwt-decode";

export const useUserInfoStore = defineStore("userInfo", () => {
  const accessToken = ref("");
  const isLogin = ref(false);

  const _saveTokenAndId = (refreshToken) => {
    const userId = decodeToken(refreshToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const decodeToken = (refreshToken) => {
    let decodedToken = jwtDecode(refreshToken);
    return decodedToken.userId;
  };

  const _setAccessToken = (token) => {
    accessToken.value = token;
  };

  const convertLoginStatus = (isSignin) => {
    isLogin.value = isSignin;
  };

  const _deleteToken = () => {
    accessToken.value = "";
    localStorage.removeItem("refreshToken");
  };

  const loginProcess = (accessToken, refreshToken) => {
    _setAccessToken(accessToken);
    _saveTokenAndId(refreshToken);
    convertLoginStatus(true);
  };

  const logoutProcess = () => {
    _deleteToken();
    convertLoginStatus(false);
  };

  return { isLogin, accessToken, loginProcess, decodeToken, logoutProcess };
});
