<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
const router = useRouter();
const route = useRoute();

const userData = ref({
  userId: "",
  userPwd: "",
  email: "",
  userName: "",
});

const msg = ref("");

const URL = { 1: "http://192.168.0.2/vue", 2: "http://localhost/vue" };

const isIdDupli = ref(false);

const joinEvent = () => {
  // if (confirm("회원가입에 성공하셨습니다. 로그인 하러 갈까요?")) {
  //   router.replace({ name: "login" });
  // } else {
  //   router.go(-1);
  // }
  axios
    .post(`${URL[1]}/user/join`, JSON.stringify(userData.value), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      if (confirm("회원가입에 성공하셨습니다. 로그인 하러 갈까요?")) {
        console.log("successs");
        router.replace("login");
      } else {
        router.go(-1);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

watch(
  () => userData.value.userId,
  async (id) => {
    console.log(id.length);
    if (id.length >= 4) {
      const res = await axios.get(`${URL[1]}/user/idChk/${id}`);
      if (res.data["checkResult"]) {
        console.log(res.data["checkResult"]);
        isIdDupli.value = res.data["checkResult"];
        msg.value = "사용가능한 아이디입니다!";
      } else {
        isIdDupli.value = res.data.checkReulst;
        msg.value = "중복된 아이디가 존재합니다!";
      }
    } else {
      msg.value = "아이디는 최소 4자 이상입니다";
      isIdDupli.value = false;
    }
  }
  // backend 완료시
);
</script>

<template>
  <v-app id="inspire">
    <v-main class="blue-grey lighten-4">
      <!-- Login Component -->
      <v-container style="max-width: 450px">
        <v-card title="회원가입" variant="outlined">
          <v-col class="">
            <v-col>
              <v-text-field
                v-model="userData.userId"
                label="아이디"
                required
                hide-details
              ></v-text-field>
              <div>{{ msg }}</div>
            </v-col>

            <v-col>
              <v-text-field
                v-model="userData.userPwd"
                label="비밀번호"
                hide-details
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="userData.email"
                label="이메일 주소"
                type="email"
                hide-details
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                class="md-6"
                v-model="userData.userName"
                label="이름"
                hide-details
                required
              ></v-text-field>
            </v-col>
          </v-col>
          <v-card-actions>
            <v-btn @click="joinEvent">회원가입 하기</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped></style>
