<script setup>
import { ref } from "vue";
import { toStringByFormatting } from "../util/dateFormat";
const props = defineProps({
  parent: String,
  user: String,
});

const childCommentInput = ref("");

const childCommentSubmitEvent = () => {
  // axios

  obj.content = childCommentInput.value;
  obj.date = toStringByFormatting(new Date(Date.now()));
  obj.parent = props.parent;
  let obj = {};
};
</script>

<template>
  <v-textarea
    clearable
    :label="props.user"
    v-model="write"
    auto-grow
    rows="1"
    variant="underlined"
  ></v-textarea>
  <div>
    <button @click="childCommentSubmitEvent">답글 쓰기</button>
  </div>
</template>

<style scoped></style>
