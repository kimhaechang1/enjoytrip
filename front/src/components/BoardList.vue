<script setup>
import { ref, onMounted } from "vue";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
import { toStringByFormatting } from "../util/dateFormat.js";
import VPageNavigation from "./VPageNavigation.vue";
import axios from "axios";

const router = useRouter();
const datas = ref([]);

const itemsPerPage = ref(0);
const totalPage = ref(0);
const title = ref("");
const URL = {
  1: "http://localhost/vue",
  3: "http://192.168.31.75/vue",
};

const route = useRoute();

const key = ref("");
const word = ref("");
const cate = ref("");

const tabs = ref([
  { name: "자유", isOpen: true, cate: 1 },
  { name: "공지", isOpen: false, cate: 2 },
  { name: "후기", isOpen: false, cate: 0 },
]);

const query = ref({
  pgno: parseInt(route.query.pgno),
  spp: parseInt(route.query.spp),
  key: route.query.key,
  word: route.query.word,
  cate: route.query.cate,
});

const getBoardList = async () => {
  const { pgno, spp, key, word, cate } = query.value;
  let res;
  try {
    res = await axios.get(
      `${URL[3]}/board?pgno=${pgno}&spp=${spp}&key=${key}&word=${word}&cate=${cate}`,
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
  console.log(res.data);
  totalPage.value = res.data.totalPageCount;
  itemsPerPage.value = 10;
  return res.data.articles;
};

onMounted(async () => {
  datas.value = await getBoardList();
  itemsPerPage.value = datas.value.length;
  cate.value = parseInt(route.query.cate);
  if (cate.value == 0) {
    title.value = "공지사항 게시판";
  } else if (cate.value == 1) {
    title.value = "자유게시판";
  } else if (cate.value == 2) {
    title.value = "후기게시판";
  }
  const newTabs = new Array();
  tabs.value.map((tab) => {
    if (tab.cate === cate.value) {
      tab.isOpen = true;
    }
    newTabs.push(tab);
  });
  tabs.value = newTabs;
  console.log(datas.value);
});

onBeforeRouteUpdate(async () => {
  query.value.pgno = parseInt(route.query.pgno);

  query.value.spp = parseInt(route.query.spp);
  query.value.key = route.query.key;
  query.value.word = route.query.word;
  query.value.cate = route.query.cate;
  const newTabs = new Array();
  tabs.value.map((tab) => {
    if (tab.cate === cate.value) {
      tab.isOpen = true;
    }
    newTabs.push(tab);
  });
  tabs.value = newTabs;
  datas.value = await getBoardList();
  console.log(datas.value);
});
const pageChangeEvent = (val) => {
  router.push({
    name: "board-list",
    query: {
      pgno: val,
      spp: 10,
      key: query.value.key,
      word: query.value.word,
    },
  });
};

const searchEvent = () => {
  router.push({
    name: "board-list",
    query: {
      pgno: 1,
      spp: 10,
      key: key.value,
      word: word.value,
    },
  });
};

const tabEvent = (cate = 1) => {
  route.push({
    name: "board-list",
    query: {
      pgno: 1,
      spp: 10,
      key: "",
      word: "",
      cate,
    },
  });
};
</script>

<template>
  <div class="board-layout">
    <div class="board-list-header">
      <div class="board-list-title">{{ title }}</div>
      <div class="board-list-categroup">
        <template v-for="(item, index) in tabs" :key="index">
          <div
            class="tab"
            :class="item.isOpen ? 'selected-cate' : 'other-cate'"
            @click="tabEvent(item.cate)"
          >
            {{ item.name }}
          </div>
        </template>
      </div>
      <div class="search-layout">
        <select>
          <option value="">검색 기준</option>
          <option value="subject" defaultOption>제목</option>
          <option value="content">내용</option>
          <option value="user_id">글쓴이</option>
        </select>
        <input type="text" v-model="word" placeholder="검색어를 입력하세용" />
        <button class="board-search-btn" @click="searchEvent">제출</button>
      </div>
    </div>
    <div class="board-body">
      <div class="table-body">
        <template v-for="(item, index) in datas" :key="index">
          <div class="table-item">
            <div>{{ item.articleNo }}</div>
            <div>{{ item.userId }}</div>
            <div style="text-overflow: ellipsis">{{ item.subject }}</div>
            <div>{{ toStringByFormatting(new Date(item.date)) }}</div>
            <div>{{ item.hit }}</div>
          </div>
        </template>
      </div>
    </div>
    <VPageNavigation
      :current-page="parseInt(query.pgno)"
      :total-page="parseInt(totalPage)"
      @pageChange="pageChangeEvent"
    >
    </VPageNavigation>
  </div>
</template>

<style scoped>
.board-layout {
  margin-top: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 35px;
}
.board-list-header {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.board-list-title {
  text-align: center;
  font-size: 24pt;
}
.board-list-categroup {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.tab {
  text-align: center;
  font-size: 14pt;
  min-width: 80px;
}
.selected-cate {
  color: blue;
  border-bottom: 3px solid #dfdfdf;
}
.other-cate {
  color: black;
  cursor: pointer;
}
.board-search-btn {
  border: 1px solid #dfdfdf;
}

.board-body {
}
.table-body {
  display: flex;
  flex-direction: column;
  gap: 13px;
}
.table-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.table-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;
  border: 1px solid #dfdfdf;
  border-radius: 9px;
  cursor: pointer;
  font-weight: lighter;
}
.table-item:hover {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  /* box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px; */
}
.table-item:visited {
  color: #dfdfdf;
}

.search-layout {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 10px;
}
</style>
