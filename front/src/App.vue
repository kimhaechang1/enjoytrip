<script setup>
import SideBar from "./components/SideBar.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Header from "./components/Header.vue";

const route = useRoute();

const sideBarToggle = ref(false);
const headerToggle = ref(true);
const sideCompToggle = ref(false);
const sideBarActive = ref({});
const contentLayout = ref({});

const switchToggle = () => {
  sideBarToggle.value = !sideBarToggle.value;
  if (sideBarToggle.value) {
    delete sideBarActive.value.sideBarSlideIn;
    delete contentLayout.value.fulllayout;
    contentLayout.value.contentlayout = true;
    sideBarActive.value.sideBarSlideOut = true;
  } else {
    delete sideBarActive.value.sideBarSlideOut;
    delete contentLayout.value.contentLayout;
    contentLayout.value.fulllayout = true;
    sideBarActive.value.sideBarSlideIn = true;
  }
};

watch(
  () => route.name,
  (name, oldName) => {
    if (name === "search") {
      sideCompToggle.value = true;
      headerToggle.value = false;
    } else {
      sideCompToggle.value = false;
      headerToggle.value = true;
    }
  }
);
</script>

<template>
  <Header v-if="headerToggle"></Header>
  <div v-if="sideCompToggle" class="layout">
    <div v-if="sideBarToggle" class="sidelayout" :class="sideBarActive">
      <SideBar></SideBar>
    </div>
    <button @click="switchToggle">{{ sideBarToggle ? "<<" : ">>" }}</button>
    <div :class="contentLayout">
      <router-view></router-view>
    </div>
  </div>
  <div v-if="headerToggle" class="mainLayout">
    <router-view></router-view>
  </div>
</template>

<style scoped>
.layout {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
}
.mainLayout {
  height: 100%;
  width: 100%;
}
.sidelayout {
  border: 1px solid #dfdfdf;
  height: 100%;
  width: 0%;
  transition: all ease 0.5s 0s;
}
.sideBarSlideOut {
  width: 30%;
}
.sideBarSlideIn {
  width: 0%;
}

.fulllayout {
  width: 100%;
}
.contentlayout {
  width: 70%;
}
</style>
<style>
html {
  height: 100%;
}
body {
  padding: 0;
  margin: 0;
  height: 100%;
}
#app {
  height: 100%;
}
</style>
<style>
.pointer {
  cursor: pointer;
}
</style>
