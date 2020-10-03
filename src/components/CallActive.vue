<template>
  <div class="call-on">
    <button>Mute</button>
    <button>End</button>
    <audio id="audio"></audio>
  </div>
</template>

<script>
import AgoraRTC from 'agora-rtc-sdk';

export default {
  data() {
    return {
      RTCClient: null,
      localStream: null,
      stream: null,
      config: null
    };
  },
  mounted() {
    // 1. Create a RTCClient
    this.RTCClient = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });
    // Config for the call
    this.config = {
      token: this.$store.state.config.token,
      channel: this.$store.state.config.channelName,
      uid: this.$store.state.user.id,
      host: true
    };

    console.log(this.config.channel);

    this.RTCClient.init(this.$store.state.config.appID, () => {
      console.log(
        'RTCClient initiated, attempting to join the private channel'
      );

      this.streamListeners();

      this.RTCClient.join(
        null,
        this.config.channel,
        this.config.uid,
        uid => {
          console.log('private channel joined: ' + uid);

          /* Start stream if you're the caller */

          // Create stream
          this.localStream = AgoraRTC.createStream({
            streamID: this.config.uid,
            audio: true,
            video: false,
            screen: false
          });

          this.localStream.init(
            () => {
              console.log('Local Stream initiated!');

              this.RTCClient.publish(this.localStream, err => {
                console.log('Stream publishing went terribly wrong');
              });
            },
            error => {
              console.log('Error creating local stream');
            }
          );
        },
        error => {
          console.log('Error joining the private channel: ' + error);
        }
      );
    });

    // On localClient.leave() call .clearAllStreams()
    // We use the prepared config and call .join(), then .publish()
    //inject the stream into an element and hit stream.play()
  },
  methods: {
    streamListeners() {
      this.RTCClient.on('stream-added', event => {
        const remoteStream = event.stream;
        const id = remoteStream.getId();
        if (id !== this.RTCClient.uid) {
          this.RTCClient.subscribe(remoteStream, error => {
            console.log('Remote subscription failed, terribly');
          });
        }
        console.log('New Stream Detected!: ' + id);
      });

      this.RTCClient.on('stream-subscribed', function(event) {
        const remoteStream = event.stream;
        const id = remoteStream.getId();
        // Add a view for the remote stream.

        // Play the remote stream.
        remoteStream.play('audio');
        console.log('stream-subscribed remote-uid: ', id);
      });
    }
  }
};
</script>

<style scoped></style>
