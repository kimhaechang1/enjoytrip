<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { useRouter } from "vue-router";
import { useUserInfoStore } from "../stores/useUserInfoStore.js";

const userInfo = ref({
  userId: "",
  userPwd: "",
});

const router = useRouter();
const store = useUserInfoStore();

const msg = ref("");

const URL = "http://localhost/vue/";

const clickEvent = () => {
  axios
    .post(URL + "user/login", JSON.stringify(userInfo.value), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      console.log(res.data);
      store.loginProcess(res.data["access-token"], res.data["refresh-token"]);
      console.log(store.isLogin);
      router.go(-1);
    })
    .catch((err) => {
      console.log(err);
      msg.value = err.response.data.message;
    });
};

const test = () => {
  axios
    .get(URL + `user/info/ssafy`, {
      headers: {
        Authorization:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyZWZyZXNoLXRva2VuIiwiaWF0IjoxNzAwMTQyODkyLCJleHAiOjE3MDI3MzQ4OTIsInVzZXJJZCI6InNzYWZ5In0.n2qkOtN-gfd3qvDdVtQxvgITgV_YBvwWyD27c9ySJEA",
      },
    })
    .then((res) => console.log(res));
};
</script>

<template>
  <div class="loginLayout">
    <h1>로그인 페이지입니다.</h1>
    <div v-if="msg" class="msgBos">
      <div>{{ msg }}</div>
    </div>

    <div>
      <div>
        <input
          type="text"
          v-model="userInfo.userId"
          placeholder="아이디 입력"
        />
      </div>
      <div>
        <input
          type="password"
          v-model="userInfo.userPwd"
          placeholder="패스워드 입력"
        />
      </div>
      <div>
        <button @click="clickEvent">로그인 하기</button>
        <button @click="test">테스트용</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.msgBox {
  text-align: center;
  color: orangered;
}
.loginLayout {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
