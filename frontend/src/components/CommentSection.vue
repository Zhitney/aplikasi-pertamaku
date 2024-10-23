<script setup>
import { ref } from 'vue';
import DOMPurify from 'dompurify';

const comment = ref('');
const comments = ref('');

const submitComment = () => {
  const sanitizedComment = DOMPurify.sanitize(comment.value);
  comments.value += `<p>${sanitizedComment}</p>`;
  comment.value = '';
};
</script>

<template>
  <div>
    <h3>Comments</h3>
    <input v-model="comment" placeholder="Leave a comment" />
    <button @click="submitComment">Submit</button>
    <div v-html="comments"></div>
  </div>
</template>
