import { ref } from 'vue';

var storage = ref({});
var transactions = {};
var autocommit = true;

var _filterFunction = (params) => {
  return (obj) => {
    if (params != null)
      for (let k in params) {
        let paramData = params[k].split('|');
        let paramValue = paramData.splice(paramData.length - 1, 1)[0];
        let comparisonOperator = paramData.length > 0 ? paramData[0] : '=';
        if (paramValue.includes('><')) {
          comparisonOperator = '><';
          paramValue = paramValue.split('><');
        }

        switch (comparisonOperator) {
          // Equals To:
          case '=':
            if (obj[k] != paramValue) return false;
            break;
          //Not Equals To:
          case '!=':
            if (obj[k] == paramValue) return false;
            break;
          //Greater Than:
          case '>':
            if (obj[k] <= paramValue) return false;
            break;
          //Less Than:
          case '<':
            if (obj[k] >= paramValue) return false;
            break;
          //Greater or Equals To:
          case '>=':
            if (obj[k] < paramValue) return false;
            break;
          //Less or Equals To:
          case '<=':
            if (obj[k] > paramValue) return false;
            break;
          //Between:
          case '><':
            if (obj[k] < paramValue[0] || obj[k] > paramValue[1]) return false;
            break;
          //Like:
          case 'like':
            if (String(obj[k]).includes(paramValue) == false) return false;
            break;
          //Not Like:
          case 'notLike':
            if (String(obj[k]).includes(paramValue) == true) return false;
            break;
          //In:
          case 'in':
            paramValue = JSON.parse(paramValue);
            if (paramValue.includes(obj[k]) == false) return false;
            break;
          //Not In:
          case 'notIn':
            paramValue = JSON.parse(paramValue);
            if (paramValue.includes(obj[k]) == true) return false;
            break;
        }

      }
    return true;
  }

};

export default {
  init(datasetName) {
    if (localStorage.getItem(datasetName) == null) {
      localStorage.setItem(datasetName, '[]');
      storage.value[datasetName] = '[]';
    }
  },

  kill(datasetName) {
    if (localStorage.getItem(datasetName) != null) {
      localStorage.removeItem(datasetName);
      delete storage.value[datasetName];
    }
  },

  find(datasetName, params, filterFunction) {
    if (!filterFunction) filterFunction = _filterFunction;

    if (!(datasetName in storage.value)) {
      var dataset = localStorage.getItem(datasetName);
      if (dataset == null) throw `There's no dataset named ${datasetName}.`;
      storage.value[datasetName] = dataset;
    }

    return JSON.parse(storage.value[datasetName]).filter(filterFunction(params));
  },

  first(datasetName, params, filterFunction) {
    var results = this.find(datasetName, params, filterFunction);
    if (results.length < 1) return null;
    else return results[0];
  },

  fetch(callback, datasetName, params, filterFunction) {
    var results = this.find(datasetName, params, filterFunction);

    for (let i = 0; i < results.length; i++) {
      callback(results[i]);
    }

    return results;
  },

  insert(datasetName, data) {
    var dataset = transactions[datasetName] ?? localStorage.getItem(datasetName);
    if (dataset == null) dataset = [];
    else dataset = JSON.parse(dataset);

    if (data instanceof Array) {
      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
        dataset.push(obj);
      }
    } else {
      let obj = data;
      dataset.push(obj);
    }

    transactions[datasetName] = JSON.stringify(dataset);
    if (autocommit) this.commit();

    return data;
  },

  update(datasetName, params, data, filterFunction) {
    var dataset = transactions[datasetName] ?? localStorage.getItem(datasetName);
    if (dataset == null) throw `There's no dataset named ${datasetName}.`;
    dataset = JSON.parse(dataset);

    if (!filterFunction) filterFunction = _filterFunction(params);

    var affectedRows = 0;
    for (let i = 0; i < dataset.length; i++) {
      if (filterFunction(dataset[i])) {
        for (let k in data) {
          if (k in dataset[i]) {
            dataset[i][k] = data[k];
            affectedRows++;
          }
        }
      }
    }

    transactions[datasetName] = JSON.stringify(dataset);
    if (autocommit) this.commit();

    return affectedRows;
  },

  delete(datasetName, params, filterFunction) {
    var dataset = transactions[datasetName] ?? localStorage.getItem(datasetName);
    if (dataset == null) throw `There's no dataset named ${datasetName}.`;
    dataset = JSON.parse(dataset);

    if (!filterFunction) filterFunction = _filterFunction(params);

    var affectedRows = 0;
    for (let i = 0; i < dataset.length; i++) {
      if (filterFunction(dataset[i])) {
        dataset.splice(i, 1);
        i--;
        affectedRows++;
      }
    }

    transactions[datasetName] = JSON.stringify(dataset);
    if (autocommit) this.commit();

    return affectedRows;
  },

  setAutoCommit(mode) {
    autocommit = Boolean(mode);
  },

  commit() {
    for (let k in transactions) {
      let dataset = transactions[k];

      localStorage.setItem(k, dataset);
      storage.value[k] = dataset;
    }

    this.resetTransactions();
  },

  resetTransactions() {
    transactions = {};
    autocommit = true;
  }
}
