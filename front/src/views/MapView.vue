<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useUserInfoStore } from "../stores/useUserInfoStore.js";
import { useRouter, useRoute } from "vue-router";
import ContentTypeId from "../components/ContentTypeId.json";
import VKakaoMap from "../components/VKakaoMap.vue";
import { toStringByFormatting } from "../util/dateFormat.js";
import axios from "axios";

const rail = ref(true);
const drawer = ref(true);

const URL = {
  1: "http://192.168.0.2/vue",
  2: "http://localhost/vue",
  3: "http://192.168.31.75/vue",
};

const route = useRoute();
const router = useRouter();
const store = useUserInfoStore();
const userId = ref("");
const sidoList = ref([]);
const sWord = ref("");
const contentTypeList = ref([]);

const selectedContentType = ref({
  contentName: "",
  contentTypeId: 0,
});
const selectedSido = ref({
  sidoName: "",
  sidoCode: 0,
});
watch(
  () => selectedSido.value,
  ({ sidoName, sidoCode }) => {
    selectedGugun.value = {
      gugunName: "선택 해 주세요",
      gugunCode: 0,
    };
    if (sidoCode != 0) {
      gugunList.value = gugunData.value[sidoCode];
      axios.get(`${URL[3]}/attr/${sidoCode}/gugun`).then((res) => {
        gugunList.value = res.data.resultData;
      });
    }
  }
);
const isSelected = computed(() => {
  return selectedSido.value.sidoCode == 0;
});
const gugunData = ref({});
const gugunList = ref([]);
const selectedGugun = ref({
  gugunCode: 0,
  gugunName: "",
});

const searchQuery = ref({
  type: "",
  sidoCode: "",
  gugunCode: "",
  contentTypeId: "",
  word: "",
});

const searchResult = ref([]);

watch(searchResult, (newData) => {
  searchResult.value = newData;
});

const startDate = ref("");
const endDate = ref("");

watch(
  () => route.query,
  async ({ type, sidoCode, gugunCode, contentTypeId, word, startDate, endDate }) => {
    console.log("여기로 들어오나요?");
    if (type == 0) {
      let obj = {
        sidoCode: parseInt(sidoCode),
        gugunCode: parseInt(gugunCode),
        contentTypeId: parseInt(contentTypeId),
        searchWord: word,
      };
      const res = await axios.post(`${URL[3]}/attr/search`, JSON.stringify(obj), {
        headers: {
          "Content-type": "application/json",
        },
      });
      searchResult.value = res.data.resultData;
      selectedContentType.value = {
        contentName: "관광지",
        contentTypeId: 12,
      };
      selectedSido.value = {
        sidoCode: 0,
        sidoName: "",
      };
      selectedGugun.value = {
        gugunCode: 0,
        gugunName: "",
      };
      sWord.value = "";
    } else {
      let obj = {
        searchWord: word,
        startDate: toStringByFormatting(new Date(startDate)),
        endDate: toStringByFormatting(new Date(endDate)),
      };
      const res = await axios.post(`${URL[3]}/plan/search`, JSON.stringify(obj), {
        headers: {
          "Content-type": "application/json",
        },
      });
      searchResult.value = res.data.resultData;
    }
  }
);

onMounted(async () => {
  // dumy data
  const res = await store.getUserId();
  userId.value = res;
  console.log(userId.value);
  contentTypeList.value = ContentTypeId;
  selectedContentType.value = { contentName: "관광지", contentTypeId: 12 };
  axios.get(`${URL[3]}/attr/sido`).then((res) => {
    sidoList.value = res.data.resultData;
  });
  const { type, sidoCode, gugunCode, contentTypeId, word, startDate, endDate } = route.query;
  let obj = {};
  if (type == 0) {
    obj = {
      sidoCode,
      gugunCode,
      contentTypeId,
      searchWord: word,
    };
    await axios.get(`${URL[3]}/attr/search`, JSON.stringify(obj));
  } else {
  }
});

const toggle = ref(0);
const searchBoxToggle = ref(true);
const submitAttrEvent = () => {
  if (toggle.value == 0 && selectedSido.value.sidoCode == 0) {
    alert("시/도 선택은 검색 최소 조건입니다.");
    return false;
  }
  if (toggle.value == 0 && selectedContentType.value.contentTypeId == 0) {
    alert("옳바르지 않은 선택지 입니다.");
    return false;
  }
  router.push({
    name: "map",
    query: {
      type: toggle.value,
      sidoCode: selectedSido.value.sidoCode,
      gugunCode: selectedGugun.value.gugunCode,
      contentTypeId: selectedContentType.value.contentTypeId,
      word: sWord.value,
    },
  });
};

const searchBoxToggleEvent = () => {
  searchBoxToggle.value = !searchBoxToggle.value;
};

const submitPlannerEvent = () => {
  if (startDate.value == "" || endDate.value == "") {
    alert("시작 일과 끝 일은 필수 선택입니다.");
    return false;
  }
  if (new Date(startDate.value).getMilliseconds() > new Date(endDate.value).getMilliseconds()) {
    alert("시작일 또는 끝 일이 잘못 선택되었습니다.");
    return false;
  }
  router.push({
    name: "map",
    query: {
      type: toggle.value,
      startDate: startDate.value,
      endDate: endDate.value,
      word: sWord.value,
    },
  });
};
</script>

<template>
  <VKakaoMap></VKakaoMap>
  <v-layout>
    <!-- 왼쪽 사이드바 영역 시작 -->
    <v-navigation-drawer permanent :width="400" class="layout">
      <v-list-item title="원하는 여행지를 검색하세요"></v-list-item>
      <v-divider></v-divider>
      <div class="toggle-box">
        <v-btn-toggle v-model="toggle" divided>
          <v-btn>관광지 검색</v-btn>
          <v-btn>플래너 검색</v-btn>
        </v-btn-toggle>
      </div>
      <v-divider></v-divider>
      <div v-if="searchBoxToggle" class="search-layout">
        <template v-if="toggle == 0">
          <div class="select-layout">
            <v-select
              label="시/도"
              v-model="selectedSido"
              :items="sidoList"
              item-title="sidoName"
              item-value="sidoCode"
              variant="outlined"
              return-object
            ></v-select>
            <v-select
              clearable
              label="구/군"
              v-model="selectedGugun"
              :items="gugunList"
              item-title="gugunName"
              item-value="gugunCode"
              return-object
              variant="outlined"
              :disabled="isSelected"
            ></v-select>
            <v-select
              clearable
              label="종류"
              v-model="selectedContentType"
              :items="contentTypeList"
              item-title="contentName"
              item-value="contentTypeId"
              return-object
              variant="outlined"
            ></v-select>
          </div>
          <div class="util-box search-util-box">
            <v-text-field clearable label="검색어" variant="outlined" v-model="word"></v-text-field>
            <v-btn variant="outlined" @click="submitAttrEvent"> 검색 </v-btn>
          </div>
        </template>
        <template v-if="toggle == 1">
          <div class="select-layout">
            <div class="date-box">
              <label for="startDate">시작 : </label>
              <input id="startDate" type="date" v-model="startDate" />
              <br />
              <label for="endDate">끝 : </label>
              <input id="endDate" type="date" v-model="endDate" />
            </div>
          </div>
          <div class="util-box search-util-box">
            <v-text-field clearable label="검색어" variant="outlined" v-model="word"></v-text-field>
            <v-btn variant="outlined" @click="submitPlannerEvent"> 검색 </v-btn>
          </div>
        </template>
      </div>
      <div v-if="searchBoxToggle" class="searchBoxToggleBtn">
        <v-btn style="" variant="outlined" @click="searchBoxToggleEvent"> 접기 </v-btn>
      </div>
      <div v-if="!searchBoxToggle" class="searchBoxToggleBtn">
        <v-btn style="" variant="outlined" @click="searchBoxToggleEvent"> 열기 </v-btn>
      </div>
      <!-- "contentTypeId": 12,
            "title": "대구두류공원",
            "addr1": "대구광역시 달서구 공원순환로 36",
            "firstImage": "http://tong.visitkorea.or.kr/cms/resource/29/2370129_image2_1.jpg",
            "sidoCode": 0,
            "gugunCode": 0,
            "latitude": 35.85001055,
            "longitude": 128.5637105,
            "searchWord": null -->
      <div class="result-layout">
        <div class="data-layout">
          <template v-if="searchResult.length > 0">
            <v-virtual-scroll :height="500" :items="searchResult">
              <template v-slot:default="{ item }">
                <v-card :title="item.title">
                  <div>주소 : {{ item.addr1 }}</div>
                  <div><img :src="item.addr1" width="80" height="80" /></div>
                </v-card>
              </template>
            </v-virtual-scroll>
          </template>
          <template v-if="searchResult.length == 0">
            <div>검색된 결과가 없습니다.</div>
          </template>
        </div>
      </div>
    </v-navigation-drawer>
    <!-- 왼쪽 사이드바 영역 끝 -->

    <!-- 오른쪽 사이드바 영역 시작 -->
    <!-- 넓이 수정방법 = :width="" -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
      location="right"
    >
      <v-list-item nav>
        <template v-slot:append>
          <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home-city" title="Home" value="home"></v-list-item>
        <v-list-item prepend-icon="mdi-account" title="My Account" value="account"></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main style="height: 250px"> </v-main>
    <!-- 오른쪽 사이드바 영역 끝 -->
  </v-layout>
</template>

<style scoped>
.search-layout {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}
.select-layout {
  display: inherit;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  gap: 8px;
  width: 80%;
}
.result-layout {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}
.data-layout {
  display: inherit;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  gap: 8px;
  width: 80%;
}

.toggle-box {
  width: 100%;
  display: flex;
  justify-content: center;
}
.util-box {
  display: flex;

  gap: 10px;
}
.search-util-box {
  width: 80%;
  margin: 0 auto;
  flex-direction: column;
}
.searchBoxToggleBtn {
  margin-top: 15px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
