<template>
  <div class="map-container" :id="`map-container-${uniqid}`">
    <!-- Empty -->
    <div v-show="mapState == 'empty'" class="q-pa-xl absolute bg-white column flex-center text-grey-8" id="map-empty">
      <q-icon size="xl" name="fas fa-map"></q-icon>
      <div>Mapa Vazio.</div>
    </div>

    <!-- Loading -->
    <div class="q-pa-xl absolute bg-white text-center text-grey-8 row items-center" v-show="mapState == 'loading'" id="map-loading">
      <div class="col-12">
        <q-spinner-gears size="lg" />
        <div class="text-caption">
          Carregando...
        </div>
      </div>
    </div>

    <!-- Offline -->
    <div v-show="mapState == 'offline'" class="q-pa-xl absolute bg-white text-center text-grey-8">
      <div>
        <q-icon size="lg" name="wifi_off"></q-icon>
      </div>
      <div class="text-h6">
        Você Está Offline
      </div>
      <div class="text-caption">Não é possível carregar o mapa sem conexão.</div>
      <small>Para visualizar o mapa, reconecte a rede</small>
    </div>

    <!-- Ready -->
    <div class="map" :id="`map-${uniqid}`" v-show="mapState == 'ready'"></div>
  </div>
</template>
<script>
export default {
  name: 'ui-gadgets-map',

  props: {
    AddressObj: Object,
    AddressStr: String
  },

  data() {
    return {
      uniqid: null,
      mapState: 'empty',
      updMapDebounce: null,
    }
  },

  watch: {
    AddressObj: {
      handler(val) {
        this.handleAddressObj(val)
      },
      deep: true
    },

    AddressStr(val) {
      this.handleAddressStr(val);
    }
  },

  methods: {
    buildFullAddress(address) {
      if (!address || address.ds_addressstreet == null) return null;

      var fullAddress = address.ds_addressstreet +
        ", " + address.ds_addressnumber +
        (address.ds_addresscomplement ? ", " + address.ds_addresscomplement : '') +
        ", " + address.ds_addressneighborhood +
        ", " + address.ds_addresscity +
        "/" + address.do_addressuf +
        " - CEP: " + address.ds_addresszipcode;

      return fullAddress;
    },

    async getGeoCode(address, callback) {
      var geocoder = new google.maps.Geocoder();

      await geocoder.geocode({
        'address': address
      }, function (results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
          let latitude = results[0].geometry.location.lat();
          let longitude = results[0].geometry.location.lng();

          if (callback)
            callback(latitude, longitude);
        }
      });
    },

    updMapAddress(buildAddress) {
      buildAddress = buildAddress != null ? buildAddress : true;

      this.mapState = 'loading';

      if (this.updMapDebounce)
        clearTimeout(this.updMapDebounce);

      this.updMapDebounce = setTimeout(() => {
        var fullAddress = buildAddress ? this.buildFullAddress(this.AddressObj) : this.AddressStr;

        if (fullAddress == null) return;

        this.getGeoCode(fullAddress, (latitude, longitude) => {
          this.initMap(latitude, longitude);
        });
      }, 300);
    },

    // Initialize and add the map
    initMap(lat, lng) {
      // The location
      var location = {
        lat: lat,
        lng: lng
      };
      // The map, centered at location
      const map = new google.maps.Map(document.getElementById(`map-${this.uniqid}`), {
        zoom: 14,
        center: location,
      });

      this.map = map;

      // The marker, positioned at location
      const marker = new google.maps.Marker({
        position: location,
        map: map,
      });

      this.mapState = 'ready';
      this.$emit('map-loaded');
    },

    handleAddressStr(val) {
      if (!this.AddressStr) this.mapState = 'empty';
      else this.updMapAddress(false);
    },

    handleAddressObj(val) {
      if (!!val && !!val.ds_addressstreet && !!val.ds_addressnumber && !!val.ds_addressneighborhood && !!val.ds_addresscity && !!val.do_addressuf) {
        this.updMapAddress(true);
      } else this.mapState = 'empty';
    }
  },

  mounted() {
    // Generate an uniqid
    var ts = String(new Date().getTime()), i = 0, out = '';
    for (i = 0; i < ts.length; i += 2) {
      out += Number(ts.substr(i, 2)).toString(36);
    }
    this.uniqid = ('d' + out);

    if (navigator.onLine == false) {
      this.mapState = 'offline';
      return;
    }

    if (!!this.AddressObj)
      this.handleAddressObj(this.AddressObj);
    else if (!!this.AddressStr) this.handleAddressStr();

  },
}
</script>
<style scoped>
.map-container {
  position: relative;
  height: 300px;
}

.map {
  height: 300px;
}

.map-container>.absolute {
  width: 100%;
  height: 300px;
}
</style>