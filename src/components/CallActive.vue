<template>
  <div class="call-on">
    <button>Mute</button>
    <button>End</button>
  </div>
</template>

<script>
export default {
  created() {
    // 0.Setup a config for the RTCClient
    // 1. Create a RTCClient
    // On localClient.leave() call .clearAllStreams()
    // We use the prepared config and call .join(), then .publish()
    //inject the stream into an element and hit stream.play()
  }
};
</script>

<style scoped></style>
