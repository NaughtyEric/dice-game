<template>
  <audio
      ref="audio"
      loop
      preload="auto"
  >
    <source src="@/assets/second_dealing_loop.mp3" type="audio/mpeg" />
  </audio>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";

const audio = ref<HTMLAudioElement | null>(null);

/* ===== 内部：自动解锁播放 ===== */
function unlock() {
  if (!audio.value) return;

  audio.value.volume = 0.25;
  const p = audio.value.play();
  if (p) p.catch(() => {});

  removeListeners();
}

function removeListeners() {
  window.removeEventListener("click", unlock);
  window.removeEventListener("touchstart", unlock);
  window.removeEventListener("keydown", unlock);
}

onMounted(() => {
  window.addEventListener("click", unlock, { once: true });
  window.addEventListener("touchstart", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
});

onUnmounted(removeListeners);

/* ===== 对外暴露的能力 ===== */
function setVolume(v: number) {
  if (!audio.value) return;
  audio.value.volume = Math.min(1, Math.max(0, v));
}

function getVolume() {
  return audio.value?.volume ?? 0;
}

defineExpose({
  setVolume,
  getVolume,
});
</script>
