// Default Configs:
const ServiceUUID = '0000ffe0-0000-1000-8000-00805f9b34fb'
const CharacteristicUUID = '0000ffe1-0000-1000-8000-00805f9b34fb'

function handleReceivedData(event) {
  const dataChunk = new TextDecoder('utf-8').decode(event.target.value);
  return dataChunk;
}

export default {
  device: null,
  service: null,
  characteristic: null,
  _onCharacteristicChanged: null,

  connectToDevice(serviceUUID) {
    return new Promise(async (resolve, reject) => {
      serviceUUID = !!serviceUUID ? serviceUUID : ServiceUUID;

      try {
        // Connect to a Bluetoth device:
        this.device = await navigator.bluetooth.requestDevice({
          filters: [{ services: [serviceUUID] }]
        });

        const server = await this.device.gatt.connect();
        this.service = await server.getPrimaryService(ServiceUUID);
        resolve();
      } catch (error) {
        console.error('An error has occurred on the attempt to connect to device.', error);
        reject(error);
      }
    });
  },

  disconnectDevice() {
    if (this.device && this.device.gatt.connected)
      this.device.gatt.disconnect();

    if (this._onCharacteristicChanged) {
      this.characteristic.removeEventListener('characteristicvaluechanged', this._onCharacteristicChanged);
      this._onCharacteristicChanged = null;
    }

    this.device = null;
    this.service = null;
    this.characteristic = null;

  },

  onCharacteristic(characteristicUUID) {
    return new Promise(async (resolve, reject) => {
      characteristicUUID = !!characteristicUUID ? characteristicUUID : CharacteristicUUID;

      try {
        this.characteristic = await this.service.getCharacteristic(characteristicUUID);

        await this.characteristic.startNotifications();

        resolve();
      } catch (error) {
        console.error("An error has occurred ont he attempt to setup service's characteristic.", error);
        reject(error);
      }
    });
  },

  loadByChunks(loadHandler) {
    return new Promise((resolve, reject) => {
      try {
        var transmissionStarted = false;

        this._onCharacteristicChanged = (event) => {
          try {
            var dataChunk = handleReceivedData(event);

            if (dataChunk.includes('\x05') && !transmissionStarted) return;

            if (dataChunk.includes('\x05')) {
              console.log('BluetoothService: The transmission has ended.');

              this.characteristic.removeEventListener('characteristicvaluechanged', this._onCharacteristicChanged);
              this._onCharacteristicChanged = null;

              resolve();
            } else {
              transmissionStarted = true;
              loadHandler(dataChunk);
            }
          } catch (error) {
            console.error('An error has occurred when retrieving data chunk.', error);
            reject(error);
          }
        };

        this.characteristic.addEventListener('characteristicvaluechanged', this._onCharacteristicChanged);

      } catch (error) {
        console.error('An error has occurred on the attempt to listen to changes on characteristic.', error);
        reject(error);
      }
    });
  },

  loadAllChunks(chunkSeparator) {
    chunkSeparator = !!chunkSeparator ? chunkSeparator : '';

    return new Promise(async (resolve) => {
      let receivedData = ''; // stores received chunks concatenated
      var transmissionStarted = false;

      try {
        this._onCharacteristicChanged = (event) => {
          try {
            var dataChunk = handleReceivedData(event);

            if (dataChunk.includes('\x05') && !transmissionStarted) return;

            if (dataChunk.includes('\x05')) {
              console.log('BluetoothService: The transmission has ended.');

              this.characteristic.removeEventListener('characteristicvaluechanged', this._onCharacteristicChanged);
              this._onCharacteristicChanged = null;

              resolve(receivedData);
            } else {
              receivedData += `${(transmissionStarted ? chunkSeparator : '')}${dataChunk}`;
              transmissionStarted = true;
            }
          } catch (error) {
            console.error('An error has occurred when retrieving data chunk.', error);
            reject(error);
          }
        }

        this.characteristic.addEventListener('characteristicvaluechanged', this._onCharacteristicChanged);
      } catch (error) {
        console.error('An error has occurred on the attempt to listen to changes on characteristic.', error);
        reject(error);
      }

    });
  },
}