import { http } from '../services.js'

const getGeolocation = () => new Promise((resolve, reject) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  } else {
    reject(new Error("Geolocalização não é suportada pelo navegador."));
  }
});

export default {
  async trackGeolocation(url) {
    try {
      const position = await getGeolocation();

      const data = {
        vl_latitude: position.latitude,
        vl_longitude: position.longitude,
      };

      await http.post(url, data)
    } catch (error) {
      console.error('Erro ao coletar ou enviar geolocalização:', error);
    }
  }
};