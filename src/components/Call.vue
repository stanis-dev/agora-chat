<template>
  <div>
    <p>Call Component</p>
    <div class="call-in">
      <button>Accept</button>
      <button>Decline</button>
    </div>
    <div class="call-on">
      <button>Mute</button>
      <button>End</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['call']
};
</script>

<style scoped></style>
