<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserInfoStore } from "../stores/useUserInfoStore.js";
import { toStringByFormatting } from "../util/dateFormat.js";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const userStore = useUserInfoStore();
const URL = {
  1: "http://localhost/vue",
  2: "http://192.168.0.2/vue",
  3: "http://192.168.31.75/vue",
};
const data = ref({
  articleNo: "",
  category: "",
  subject: "",
  content: "",
  date: "",
  hit: 0,
  userId: "",
  userName: "",
  link: "",
});

const presentUser = ref("");
const isUtilOpen = ref(false);

const query = ref({});

onMounted(async () => {
  const id = route.params.articleNo;
  try {
    const res = await axios.get(`${URL[2]}/board/${id}`);
    const {
      articleNo,
      category,
      content,
      date,
      hit,
      subject,
      userId,
      userName,
    } = res.data;
    let newObj = {};

    newObj = {
      articleNo,
      content,
      date: toStringByFormatting(new Date(date)),
      hit,
      subject,
      userId,
      userName,
    };
    console.log("category : " + category);
    if (category == 0) {
      newObj.category = "공지사항";
    } else if (category == 1) {
      newObj.category = "자유";
    } else if (category == 2) {
      newObj.category = "후기";
      newObj.link = res.data.hasOwnProperty("link") ? res.data.link : "";
    }
    data.value = newObj;

    console.log(data.value);
  } catch (err) {
    console.log(err);
    if (err.response.status == 404) {
      alert("해당하는 페이지를 찾을 수 없습니다.");
      router.go(-1);
    }
  }
  const userId = await userStore.getUserId();
  presentUser.value = userId;
  console.log(data.value.category);
  console.log(presentUser.value);
  if (data.value.category === "공지사항") {
    if (presentUser.value === "admin") {
      isUtilOpen.value = true;
    }
  } else {
    if (presentUser.value === data.value.userId) {
      isUtilOpen.value = true;
    }
  }

  let newQuery = {};
  newQuery.pgno = route.query.pgno;
  newQuery.spp = route.query.spp;
  newQuery.key = route.query.key;
  newQuery.word = route.query.word;
  newQuery.cate = route.query.cate;
  query.value = newQuery;
});

const goBackEvent = () => {
  router.push({
    name: "board-list",
    query: {
      pgno: query.value.pgno,
      spp: query.value.spp,
      key: query.value.key,
      word: query.value.word,
      cate: query.value.cate,
    },
  });
};
const deleteEvent = async () => {
  try {
    const res = await axios.delete(`${URL[2]}/board/${data.value.articleNo}`);
    if (res.status == 200) {
      alert("성공적으로 삭제되었습니다.");
    }
  } catch (err) {
    if (err.response.status == 500) {
      alert("이미 삭제 되었습니다.");
    }
  }
  router.push({
    name: "board-list",
    query: {
      pgno: query.value.pgno,
      spp: query.value.spp,
      key: query.value.key,
      word: query.value.word,
      cate: query.value.cate,
    },
  });
};
</script>

<template>
  <v-container>
    <v-card>
      <div class="view-layout">
        <div>
          <div class="view-header">
            <div class="view-subject">
              {{ data.subject }}
            </div>
            <div class="view-header-title">
              <div class="category">{{ data.category }}</div>
              <div class="view-header-hit">
                <div class="hit">조회수</div>
                <div class="hit-content">
                  {{ data.hit }}
                </div>
              </div>
            </div>
            <template v-if="isUtilOpen">
              <div class="view-header-util">
                <div></div>
                <div class="view-header-util-box">
                  <button class="update-btn">수정</button>
                  <button class="delete-btn" @click="deleteEvent">삭제</button>
                </div>
              </div>
            </template>
          </div>
          <div class="view-body">
            <template v-if="data.category === '후기'">
              <div class="view-body-link" @click="">후기 보러가기</div>
            </template>
            <div class="view-body-content">
              <div class="content">
                {{ data.content }}
              </div>
            </div>
            <div class="view-bottom-util-box">
              <div></div>
              <button class="prev-btn" @click="goBackEvent">뒤로가기</button>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<style scoped>
.view-subject {
  font-size: 15pt;
}
.view-layout {
  display: flex;
  justify-content: center;
  align-items: center;
}
.view-layout > div {
  margin-top: 40px;
  width: 80%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.view-header {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.view-header-title {
  display: inherit;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
}
.view-header-hit {
  display: inherit;
  flex-direction: row;
}
.view-header-util {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: end;
}
.view-header-util-box {
  display: inherit;
  flex-direction: row;
  gap: 8px;
}
.view-body-content {
  min-height: 240px;
}
.update-btn {
  border-radius: 5px;
}
.update-btn:hover {
  background-color: aliceblue;
}
.delete-btn {
  border-radius: 5px;
}
.delete-btn:hover {
  background-color: aliceblue;
}
.view-header-hit {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
.view-bottom-util-box {
  display: flex;
  flex-direction: row;
  align-items: end;
  justify-content: end;
}
.prev-btn {
  border-radius: 5px;
}
.prev-btn:hover {
  background-color: aliceblue;
}
</style>
