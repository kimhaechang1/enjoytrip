<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { useUserInfoStore } from "../stores/useUserInfoStore";
import axios from "axios";
const route = useRoute();
const router = useRouter();
const store = useUserInfoStore();
const go = (name) => {
  router.push({ name });
};
const isLogin = ref(false);
const userId = ref("");
watch(
  () => store.isLogin,
  (login) => {
    isLogin.value = login;
    if (isLogin.value) {
      userId.value = store.decodeToken(localStorage.getItem("refreshToken"));
    }
  }
);
const URL = "http://localhost/vue";
const logoutEvent = () => {
  axios
    .get(URL + `/user/logout/${userId.value}`)
    .then((res) => {
      if (res.status === 200) {
        store.logoutProcess();
        router.go(0, { replace: true });
      }
    })
    .catch((err) => console.log(err));
};
</script>

<template>
  <v-toolbar>
    <v-toolbar-title>EnjoyTrip</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items v-if="!isLogin">
      <v-btn flat @click="go('login')">로그인</v-btn>
      <v-btn flat @click="go('join')">회원가입</v-btn>
    </v-toolbar-items>
    <v-toolbar-items v-if="isLogin">
      <v-btn flat>{{ userId }}</v-btn>
      <v-btn flat @click="logoutEvent">로그아웃</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>
<style scoped></style>
