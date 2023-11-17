<script setup>
import { ref } from "vue";
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

const joinEvent = () => {
  if (confirm("회원가입에 성공하셨습니다. 로그인 하러 갈까요?")) {
    router.replace({ name: "login" });
  } else {
    router.go(-1);
  }
  //   axios
  //     .post("/user/join", userData, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((res) => {
  //       if (confirm("회원가입에 성공하셨습니다. 로그인 하러 갈까요?")) {
  //         router.go({ name: "login" });
  //       } else {
  //         router.go(-1);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
};
</script>

<template>
  <div>
    <h1>회원가입 페이지</h1>
    <div>
      <div>
        <input
          type="text"
          v-model="userData.userId"
          placeholder="아이디 입력"
          required
        />
      </div>
      <div>
        <input
          type="password"
          v-model="userData.userPwd"
          placeholder="비밀번호 입력"
          required
        />
      </div>
      <div>
        <input
          type="email"
          v-model="userData.email"
          placeholder="이메일 입력"
          required
        />
      </div>
      <div>
        <input
          type="text"
          v-model="userData.userName"
          placeholder="이름 입력"
          required
        />
      </div>
    </div>
    <div><button @click="joinEvent">제출</button></div>
  </div>
</template>

<style scoped></style>
