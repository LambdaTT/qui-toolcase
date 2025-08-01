import axios from 'axios';
import { utils, eventbroadcaster } from '../services.js'

var headers = {};
var isExternal = false;
export default {
  external() {
    isExternal = true;
    return this;
  },

  setHeader(name, value) {
    headers[name] = value;
    return this;
  },

  get: function (url, params) {
    url = `${isExternal ? '' : process.env.API}${url}`;

    var _params = '';
    if (utils.objectSize(params) > 0) {
      _params = utils.objToSerialString(params);
      url = `${url}${url.includes('?') ? '&' : '?'}${_params}`;
    }

    var reqConf = {
      headers: { ...headers }
    };

    headers = {};

    if (!isExternal) {
      var xsrfToken = localStorage.getItem('xsrf_token');
      if (xsrfToken != null) reqConf.headers['Xsrf-Token'] = xsrfToken;

      var sessionKey = localStorage.getItem('iam_session_key');
      if (sessionKey != null) reqConf.headers['Iam-Session-Key'] = sessionKey;
    }

    isExternal = false;
    var reqPromise = axios.get(url, reqConf);

    // Evt Trigger
    eventbroadcaster.$broadcast('http-request-sent', reqPromise);

    return reqPromise;
  },

  post: function (url, data) {
    url = `${isExternal ? '' : process.env.API}${url}`;

    var reqConf = {
      headers: { ...headers }
    };

    headers = {};

    if (!isExternal) {
      var xsrfToken = localStorage.getItem('xsrf_token');
      if (xsrfToken != null) reqConf.headers['Xsrf-Token'] = xsrfToken;

      var sessionKey = localStorage.getItem('iam_session_key');
      if (sessionKey != null) reqConf.headers['Iam-Session-Key'] = sessionKey;
    }

    isExternal = false;
    var reqPromise = axios.post(url, data, reqConf);

    // Evt Trigger
    eventbroadcaster.$broadcast('http-request-sent', reqPromise);

    return reqPromise
  },

  put: function (url, data) {
    url = `${isExternal ? '' : process.env.API}${url}`;

    var reqConf = {
      headers: { ...headers }
    };

    headers = {};

    if (!isExternal) {
      var xsrfToken = localStorage.getItem('xsrf_token');
      if (xsrfToken != null) reqConf.headers['Xsrf-Token'] = xsrfToken;

      var sessionKey = localStorage.getItem('iam_session_key');
      if (sessionKey != null) reqConf.headers['Iam-Session-Key'] = sessionKey;
    }

    isExternal = false;
    var reqPromise = axios.put(url, data, reqConf);

    // Evt Trigger
    eventbroadcaster.$broadcast('http-request-sent', reqPromise);

    return reqPromise
  },

  delete: function (url, params) {
    url = `${isExternal ? '' : process.env.API}${url}`;

    var _params = '';
    if (utils.objectSize(params) > 0) {
      _params = utils.objToSerialString(params);
      url = `${url}${url.includes('?') ? '&' : '?'}${_params}`;
    }

    var reqConf = {
      headers: { ...headers }
    };

    headers = {};

    if (!isExternal) {
      var xsrfToken = localStorage.getItem('xsrf_token');
      if (xsrfToken != null) reqConf.headers['Xsrf-Token'] = xsrfToken;

      var sessionKey = localStorage.getItem('iam_session_key');
      if (sessionKey != null) reqConf.headers['Iam-Session-Key'] = sessionKey;
    }

    isExternal = false;
    var reqPromise = axios.delete(url, reqConf);

    // Evt Trigger
    eventbroadcaster.$broadcast('http-request-sent', reqPromise);

    return reqPromise;
  },

  download: function ({ url, params, method, filename }) {
    url = `${isExternal ? '' : process.env.API}${url}`;

    method = !!method ? method.toLowerCase() : 'get';
    if (utils.objectSize(params) > 0)
      url = `${url}${url.includes('?') ? '&' : '?'}${utils.objToSerialString(params)}`;

    var reqConf = {
      responseType: 'arrayBuffer',
      responseEncoding: 'utf8',
      headers: { ...headers }
    };

    headers = {};

    if (!isExternal) {
      var xsrfToken = localStorage.getItem('xsrf_token');
      if (xsrfToken != null) reqConf.headers['Xsrf-Token'] = xsrfToken;

      var sessionKey = localStorage.getItem('iam_session_key');
      if (sessionKey != null) reqConf.headers['Iam-Session-Key'] = sessionKey;
    }

    isExternal = false;
    var reqPromise = axios[method](url, reqConf)
      .then((response) => {
        let fname;
        if (!!filename) {
          fname = filename;
        } else if (!!response.headers['content-filename']) {
          fname = decodeURI(response.headers['content-filename']).replaceAll('+', ' ');
        } else fname = 'downloaded_file';

        let blob = new Blob([response.data], { type: response.headers['content-type'] })
        var _url = window.URL.createObjectURL(blob);

        let anchorElement = document.createElement('a');
        anchorElement.style.display = 'none';
        anchorElement.href = _url;
        anchorElement.download = fname;
        anchorElement.click();

        window.URL.revokeObjectURL(_url);
        anchorElement.remove();
      });

    // Evt Trigger
    eventbroadcaster.$broadcast('http-request-sent', reqPromise);

    return reqPromise;
  },

  upload: function (url, params, method) {
    if (!(data instanceof FormData)) throw 'You can only upload data in the form a FormData object';

    method = !!method ? method.toLowerCase() : 'post';
    url = `${isExternal ? '' : process.env.API}${url}`;

    if (utils.objectSize(params) > 0)
      url = `${url}${url.includes('?') ? '&' : '?'}${utils.objToSerialString(params)}`;

    var reqConf = {
      headers: { 'Content-Type': 'multipart/form-data', ...headers }
    };

    headers = {};

    if (!isExternal) {
      // Add Xsrf-Token and Iam-Session-Key to headers
      var xsrfToken = localStorage.getItem('xsrf_token');
      if (xsrfToken != null) reqConf.headers['Xsrf-Token'] = xsrfToken;

      var sessionKey = localStorage.getItem('iam_session_key');
      if (sessionKey != null) reqConf.headers['Iam-Session-Key'] = sessionKey;
    }

    isExternal = false;
    var reqPromise = axios[method](url, reqConf);

    // Evt Trigger
    eventbroadcaster.$broadcast('http-request-sent', reqPromise);

    return reqPromise;
  }
}