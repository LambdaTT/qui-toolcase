export default {
  events: {},

  // Method to listen for an event
  $on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  },

  // Method to emit an event
  $broadcast(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  },

  // Method to remove an event listener
  $off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
};