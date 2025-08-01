import { utils, localData } from '../services.js'

export default {
  add(notification) {
    if (!('type' in notification) || !('message' in notification))
      console.error('A notificatio must have a message and a type specified.');

    localData.insert('persistentNotifications', notification);
  },

  showAll() {
    localData.init('persistentNotifications');

    var notifications = localData.find('persistentNotifications');

    for (let i = 0; i < notifications.length; i++) {
      let n = notifications[i];

      utils.notify({
        message: n.message,
        type: n.type,
        position: 'top-right'
      });

    }
    localData.delete('persistentNotifications');
  }
}