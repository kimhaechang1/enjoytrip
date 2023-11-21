<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserInfoStore } from "../stores/useUserInfoStore.js";
import { toStringByFormatting } from "../util/dateFormat.js";
import ChildCommentWrite from "./ChildCommentWrite.vue";
import Comment from "./Comment.vue";
import axios from "axios";
// dummy data import
import article from "./Article.json";

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

const presentUser = ref("ssafy4");
const isUtilOpen = ref(false);

const query = ref({});
const plannerDetail = ref({});
const writeComment = ref("");

const commentList = ref([]);

const serverSideCommentList = ref([]);

onMounted(async () => {
  const id = route.params.articleNo;
  // dummy data preprocess
  const {
    articleNo,
    category,
    content,
    date,
    hit,
    subject,
    userId,
    userName,
    plannerId,
    comment,
  } = article;
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
  newObj.category = "자유";
  console.log("category : " + category);
  data.value = newObj;
  serverSideCommentList.value = comment;
  makeCommentList();
  console.log(commentList.value);
  // try {
  //   const res = await axios.get(`${URL[2]}/board/${id}`);

  //   const {
  //     articleNo,
  //     category,
  //     content,
  //     date,
  //     hit,
  //     subject,
  //     userId,
  //     userName,
  //     plannerId,
  //   } = res.data;
  //   let newObj = {};

  //   newObj = {
  //     articleNo,
  //     content,
  //     date: toStringByFormatting(new Date(date)),
  //     hit,
  //     subject,
  //     userId,
  //     userName,
  //   };
  //   console.log("category : " + category);
  //   if (category == 0) {
  //     newObj.category = "공지사항";
  //   } else if (category == 1) {
  //     newObj.category = "자유";
  //   } else if (category == 2) {
  //     newObj.category = "후기";
  //     const res = await axios.get(`${URL[2]}/plan/${plannerId}`);
  //     if (res.data.resultData) {
  //       plannerDetail.value = res.data.resultData;
  //     }
  //   }
  //   data.value = newObj;
  //   console.log(newObj);
  //   console.log(data.value);
  // } catch (err) {
  //   console.log(err);
  //   if (err.response.status == 404) {
  //     alert("해당하는 페이지를 찾을 수 없습니다.");
  //     router.go(-1);
  //   }
  // }
  // const userId = await userStore.getUserId();
  // presentUser.value = userId;
  // console.log(data.value.category);
  // console.log(presentUser.value);
  // if (data.value.category === "공지사항") {
  //   if (presentUser.value === "admin") {
  //     isUtilOpen.value = true;
  //   }
  // } else {
  //   if (presentUser.value === data.value.userId) {
  //     isUtilOpen.value = true;
  //   }
  // }

  let newQuery = {};
  newQuery.pgno = route.query.pgno;
  newQuery.spp = route.query.spp;
  newQuery.key = route.query.key;
  newQuery.word = route.query.word;
  newQuery.cate = route.query.cate;
  query.value = newQuery;
});

const makeCommentList = () => {
  let newCommentList = {};
  let newResultCommentList = [];
  serverSideCommentList.value.map((comment) => {
    if (comment.parentId == null) {
      newCommentList[comment.commentId] = comment;
    } else {
      const { commentId, content, userId, parentId, child } =
        newCommentList[comment.parentId];
      let newChildList = [];
      if (child) {
        newChildList = [...child];
        newChildList.push(comment);
        newCommentList[comment.parentId] = {
          ...newCommentList[comment.parentId],
          child: newChildList,
        };
      } else {
        newChildList.push(comment);
        newCommentList[comment.parentId] = {
          ...newCommentList[comment.parentId],
          child: newChildList,
        };
      }
    }
  });
  console.log(newCommentList);
  for (const key in newCommentList) {
    let obj = { ...newCommentList[key] };
    newResultCommentList.push(obj);
  }
  commentList.value = newResultCommentList;
  console.log(commentList.value);
};

watch(serverSideCommentList, (newValue) => {
  console.log("newValue", newValue);
  serverSideCommentList.value = newValue;
  makeCommentList();
  console.log(commentList.value);
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
const updateEvent = () => {
  router.push({
    name: "board-update",
    params: {
      articleNo: data.value.articleNo,
    },
    query: {
      pgno: query.value.pgno,
      spp: query.value.spp,
      key: query.value.key,
      word: query.value.word,
      cate: query.value.cate,
    },
  });
};

const goMapEvent = () => {};

// template variable for test at comment

const getAllCommentList = () => {
  // api
};

const getAllChildCommentList = () => {
  // api
};

const addCommentEvent = () => {
  const lastCommentId =
    serverSideCommentList.value[serverSideCommentList.value.length - 1]
      .commentId;
  let newArray = [...serverSideCommentList.value];
  let newObj = {
    commentId: lastCommentId + 1,
    content: writeComment.value,
    userId: presentUser,
    parentId: null,
  };
  newArray.push(newObj);
  serverSideCommentList.value = newArray;
};

const updateCommentEvent = (newComment) => {
  console.log("newComment", newComment);
  let newArray = [];
  serverSideCommentList.value.map((comment) => {
    if (comment.commentId == newComment.commentId) {
      newArray.push({
        ...comment,
        content: newComment.content,
      });
    } else {
      newArray.push(comment);
    }
  });
  console.log("newArray", newArray);
  serverSideCommentList.value = newArray;
  console.log("serverSideCommentList", serverSideCommentList.value);
};

const deleteCommentEvent = (delComment) => {
  serverSideCommentList.value = serverSideCommentList.value.filter(
    (comment) => {
      return comment.commentId != delComment.commentId;
    }
  );
};

const addChildCommentEvent = (newComment) => {
  const lastCommentId =
    serverSideCommentList.value[serverSideCommentList.value.length - 1]
      .commentId;
  let newArray = [...serverSideCommentList.value];
  let newObj = {
    ...newComment,
    commentId: lastCommentId + 1,
  };
  newArray.push(newObj);
  serverSideCommentList.value = newArray;
};

const updateChildCommentEvent = (newComment) => {
  let newArray = [];
  serverSideCommentList.value.map((comment) => {
    if (comment.commentId == newComment.commentId) {
      newArray.push({
        ...comment,
        content: newComment.content,
      });
    } else {
      newArray.push(comment);
    }
  });
};

const deleteChildCommentEvent = (delComment) => {
  serverSideCommentList.value = serverSideCommentList.value.filter(
    (comment) => {
      return comment.commentId != delComment.commentId;
    }
  );
};
</script>

<template>
  <v-container class="layout">
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
                  <button class="update-btn" @click="updateEvent">수정</button>
                  <button class="delete-btn" @click="deleteEvent">삭제</button>
                </div>
              </div>
            </template>
          </div>
          <div class="view-body">
            <template v-if="data.category === '후기'">
              <div class="view-body-link">
                <div>제목 : {{ plannerDetail.plannerTitle }}</div>
                <div>
                  기간 :
                  {{ toStringByFormatting(new Date(plannerDetail.startDate)) }}
                  ~
                  {{ toStringByFormatting(new Date(plannerDetail.endDate)) }}
                </div>
                <div>
                  <button @click="goMapEvent">지도로 보기</button>
                  <font-awesome-icon icon="fa-regular fa-map" />
                </div>
              </div>
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
    <div class="comment-layout">
      <template v-if="presentUser">
        <v-card class="comment-write-layout">
          <div class="comment-inner-layout">
            <v-textarea
              :label="presentUser"
              v-model="writeComment"
              auto-grow
              rows="1"
              variant="underlined"
            ></v-textarea>
            <v-tooltip text="제출버튼">
              <template v-slot:activator="{ props }">
                <v-icon
                  class="submit-btn"
                  v-bind="props"
                  @click="addCommentEvent"
                  size="large"
                  color="blue-darken-2"
                  icon="mdi-message-text"
                ></v-icon>
              </template>
            </v-tooltip>
          </div>
        </v-card>
      </template>
    </div>
    <div>
      <div class="comment-view-layout">
        <Comment
          v-for="(item, index) in commentList"
          :key="item.commentId"
          :commentData="item"
          :loginUser="presentUser"
          :editable="item.userId == presentUser"
          @updateComment="updateCommentEvent"
          @deleteComment="deleteCommentEvent"
          @addChildComment="addChildCommentEvent"
          @updateChildComment="updateChildCommentEvent"
          @deleteChildComment="deleteChildCommentEvent"
        ></Comment>
      </div>

      <!-- <div>
        <template v-if="childCommentToggle">
          <ChildCommentWrite :parent=""></ChildCommentWrite>
        </template>
      </div> -->
    </div>
  </v-container>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  gap: 35px;
}
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
.view-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.view-body-content {
  min-height: 240px;
}
.view-body-link {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.view-body-link > div {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}
.view-body-link > div > button {
  border-radius: 5px;
}
.view-body-link > div > button:hover {
  background-color: aliceblue;
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
  margin-bottom: 50px;
}
.prev-btn {
  border-radius: 5px;
}
.prev-btn:hover {
  background-color: aliceblue;
}
.comment-layout {
  width: 100%;
}
.comment-write-layout {
  width: 100%;
}
.comment-inner-layout {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin: 0 auto;
  max-width: 80%;
  max-height: 80%;
}
.submit-btn {
  cursor: pointer;
}

.comment-view-layout {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
<style></style>
