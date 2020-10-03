import AgoraRTM from 'agora-rtm-sdk';

const appID = process.env.VUE_APP_AGORA_APP_ID;

export default class RTMClient {
  localInvitation(calleeId, channel) {
    if (this._invitation !== null) {
      this._invitation.removeAllListeners();
      this._invitation = null;
    }

    //Create a local invitation
    this._invitation = this._client.createLocalInvitation(calleeId);

    //Local monitoring and inviting peers
    this._invitation.on('LocalInvitationReceivedByPeer', () => {
      log('Peers receive calls');
      this.status = 'calling';
      this.eventBus.emit('LocalInvitationReceivedByPeer');
    });

    //Cancel call invitation
    this._invitation.on('LocalInvitationCanceled', () => {
      log('Cancel call invitation');
      this.eventBus.emit('LocalInvitationCanceled');
    });

    //Called accepted call invitation
    this._invitation.on('LocalInvitationAccepted', () => {
      log('Peers accept invitations to call');
      this.status = 'meeting';
      this.eventBus.emit('LocalInvitationAccepted');
    });

    //Called down
    this._invitation.on('LocalInvitationRefused', () => {
      log('Peers refuse to call invitations');
      this.status = 'onLine';
      this.eventBus.emit('LocalInvitationRefused');
    });

    //Local call failed
    this._invitation.on('LocalInvitationFailure', () => {
      log('Call process failed');
      this.status = 'onLine';
      this.eventBus.emit('LocalInvitationFailure');
    });

    this._invitation.content = channel;

    //Send call invitation locally
    this._invitation.send();
  }
}
