import { Notify } from 'quasar'

var wakeLock = null;

export default {
  async requestWakeLock() {
    if (!('wakeLock' in navigator)) {
      console.warn("This device does not support Wake Lock API");

      Notify.create({
        message: "Seu dispositivo não suporta o bloqueio da tela aberta. Favor ficar atento para nãop deixar a tela apagar.",
        type: 'warning',
        color: 'orange-10',
        icon: 'warning',
        position: 'top-right'
      })
      return;
    }

    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Screen Wake Lock active');
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  },

  releaseWakeLock() {
    if (wakeLock !== null) {
      wakeLock.release()
        .then(() => {
          wakeLock = null;
          console.log('Screen Wake Lock released manually');
        })
        .catch((err) => console.error(`${err.name}, ${err.message}`));
    }
  }
}