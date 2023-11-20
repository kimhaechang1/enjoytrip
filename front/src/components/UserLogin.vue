<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { useRouter } from "vue-router";
import { useUserInfoStore } from "../stores/useUserInfoStore.js";
import { menuStore } from "../stores/menuStore";
import { localAxios } from "../util/localAxios.js";

const userInfo = ref({
  userId: "",
  userPwd: "",
});

const router = useRouter();
const store = useUserInfoStore();
const mStore = menuStore();
const fetcher = localAxios;
const msg = ref("");
const URL = "http://192.168.0.2/vue";
const clickEvent = () => {
  // fetcher
  //   .post("/user/login", JSON.stringify(userInfo.value), {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //   .then((res) => {
  //     store.loginProcess(res.data["access-token"]);
  //     mStore.changeMenuState(false);
  //     //router.go(-1);
  //   });
  axios
    .post(URL + "/user/login", JSON.stringify(userInfo.value), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      store.loginProcess(res.data["access-token"]);
      mStore.changeMenuState(false);
      router.go(-1);
    })
    .catch((err) => {
      console.log(err);
      msg.value = err.response.data.message;
    });
};

const test = () => {
  store.isLoginCheck();
};
</script>

<template>
  <v-app id="inspire">
    <v-main class="blue-grey lighten-4">
      <!-- Login Component -->
      <v-container style="max-width: 450px">
        <v-card title="로그인" :text="msg" variant="outlined">
          <v-col class="">
            <v-col>
              <v-text-field
                v-model="userInfo.userId"
                label="아이디"
                required
                hide-details
              ></v-text-field>
            </v-col>

            <v-col>
              <v-text-field
                v-model="userInfo.userPwd"
                label="비밀번호"
                type="password"
                hide-details
                required
              ></v-text-field>
            </v-col>
          </v-col>
          <v-card-actions>
            <v-btn @click="clickEvent">로그인하기</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
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
