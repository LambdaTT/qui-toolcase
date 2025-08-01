import { Notify } from 'quasar'

// UTILS:
export default {
  uniqid: function () {
    var ts = String(new Date().getTime()), i = 0, out = '';
    for (i = 0; i < ts.length; i += 2) {
      out += Number(ts.substr(i, 2)).toString(36);
    }
    return ('d' + out);
  },

  validatePasswordStrengh: function (obj) {
    var strongRegularExp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var mediumRegularExp = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

    if (strongRegularExp.test(obj)) {
      return 'forte';
    } else if (mediumRegularExp.test(obj)) {
      return 'medio';
    } else {
      return 'fraco';
    }

  },

  cloneObj: function (obj) {
    return { ...obj }
  },

  sleep: function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  objToSerialString: function (object, skipKeys, joint) {
    if (!(object instanceof Object)) console.error("Invalid object data.");
    if (!object || this.objectSize(object) == 0) return '';

    skipKeys = skipKeys ?? [];

    return Object.keys(object).map(function (key) {
      if (skipKeys.indexOf(key) > -1)
        return '';

      return `${key}=${object[key]}`;
    }).join(joint ?? '&');
  },

  readFile: function (file, callback, readAsText) {
    var reader = new FileReader();
    reader.onload = function (evt) {
      callback({
        "src": evt.target.result,
        "file": file
      });
    };

    if (readAsText) reader.readAsText(file);
    else reader.readAsDataURL(file);
  },

  validateCPF: function (cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    // Elimina CPFs invalidos conhecidos
    if (cpf.length != 11 ||
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999")
      return false;
    // Valida 1o digito
    var add = 0;
    for (var i = 0; i < 9; i++)
      add += parseInt(cpf.charAt(i)) * (10 - i);
    var rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
      return false;
    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i++)
      add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
      return false;
    return true;
  },

  validateCNPJ: function (cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
      return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999")
      return false;

    // Valida DVs
    var tamanho = cnpj.length - 2;
    var numeros = cnpj.substring(0, tamanho);
    var digitos = cnpj.substring(tamanho);
    var soma = 0;
    var pos = tamanho - 7;
    for (var i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
      return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
      return false;

    return true;
  },

  notify: function (options) {
    Notify.create(options);
  },

  notifyError: function (error) {
    if (error.response && error.response.data && (error.response.data.accessible)) {
      Notify.create({
        message: error.response.data.message,
        type: 'negative',
        position: 'top-right'
      })
    } else {
      Notify.create({
        message: "Houve um problema para executar esta ação. Tente novamente mais tarde.",
        type: 'negative',
        position: 'top-right'
      })
    }
  },

  getURLParam: function (param, std) {
    var rgex = new RegExp(param + '=([^&]+)');
    var res = rgex.exec(location.href);
    return res ? res[1] : std || null;
  },

  dateFormat: function (date, format) {
    var dateFormat = {
      'y': date.getFullYear(),
      'm': date.getMonth() + 1,
      'd': date.getDate(),
      'h': date.getHours(),
      'i': date.getMinutes(),
      's': date.getSeconds()
    };
    if (dateFormat.m < 10)
      dateFormat.m = "0" + dateFormat.m;
    if (dateFormat.d < 10)
      dateFormat.d = "0" + dateFormat.d;
    if (dateFormat.h < 10)
      dateFormat.h = "0" + dateFormat.h;
    if (dateFormat.i < 10)
      dateFormat.i = "0" + dateFormat.i;
    if (dateFormat.s < 10)
      dateFormat.s = "0" + dateFormat.s;
    var result = format.replace('y', dateFormat.y);
    result = result.replace('m', dateFormat.m);
    result = result.replace('d', dateFormat.d);
    result = result.replace('h', dateFormat.h);
    result = result.replace('i', dateFormat.i);
    result = result.replace('s', dateFormat.s);
    return result;
  },

  secondsToTime: function (secs) {
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  },

  objectSize: function (obj) {
    return !obj ? 0 : Object.keys(obj).length;
  },

  fileFromURL: async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileName = url.split("/").at(-1);
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  },

  currentDatetime: () => {
    var UTC_now = new Date();

    return new Date(UTC_now.toLocaleString('en', { timeZone: 'America/Sao_Paulo' }));
  },

  validateForm(input, inputError, customRules) {
    var isInvalid = false;
    for (let k in input) {
      let field = input[k];
      if ((field === null || typeof field == 'undefined' || field === '') && k in inputError) {
        console.error(`The field "${k}" is invalid. Value: ${field}`);
        inputError[k] = true;
        isInvalid = true;
      }
    }

    if (!!customRules && typeof customRules == 'function') {
      isInvalid = customRules(input, inputError);
    }

    if (isInvalid) {
      this.notify({
        message: "Preencha o formulário corretamente",
        type: "negative",
        position: 'top-right'
      });
      return false;
    }

    return true;
  },

  randomHexColor() {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
  },

  dateDiffDays(date1, date2) {
    let Difference_In_Time = date2.getTime() - date1.getTime();

    return Math.round(Difference_In_Time / (1000 * 3600 * 24));
  },

  brazilianStates() {
    return [
      { label: 'Acre(AC)', value: 'AC' },
      { label: 'Alagoas(AL)', value: 'AL' },
      { label: 'Amapá(AP)', value: 'AP' },
      { label: 'Amazonas(AM)', value: 'AM' },
      { label: 'Bahia(BA)', value: 'BA' },
      { label: 'Ceará(CE)', value: 'CE' },
      { label: 'Distrito Federal(DF)', value: 'DF' },
      { label: 'Espírito Santo(ES)', value: 'ES' },
      { label: 'Goías(GO)', value: 'GO' },
      { label: 'Maranhão(MA)', value: 'MA' },
      { label: 'Mato Grosso(MT)', value: 'MT' },
      { label: 'Mato Grosso do Sul(MS)', value: 'MS' },
      { label: 'Minas Gerais(MG)', value: 'MG' },
      { label: 'Pará(PA)', value: 'PA' },
      { label: 'Paraíba(PB)', value: 'PB' },
      { label: 'Paraná(PR)', value: 'PR' },
      { label: 'Pernambuco(PE)', value: 'PE' },
      { label: 'Piauí(PI)', value: 'PI' },
      { label: 'Rio de Janeiro(RJ)', value: 'RJ' },
      { label: 'Rio Grande do Norte(RN)', value: 'RN' },
      { label: 'Rio Grande do Sul(RS)', value: 'RS' },
      { label: 'Rondônia(RO)', value: 'RO' },
      { label: 'Santa Catarina(SC)', value: 'SC' },
      { label: 'São Paulo(SP)', value: 'SP' },
      { label: 'Sergipe(SE)', value: 'SE' },
      { label: 'Tocantins(TO)', value: 'TO' },
    ];
  },

  async getAddressByZipCode(zipcode, notifyNotFound) {
    notifyNotFound = notifyNotFound ?? true

    if (!zipcode || zipcode.length < 9) return null;
    zipcode = zipcode.replace(/-/g, "");
    if (!/^[0-9]{8}$/.test(zipcode)) {
      this.notify({
        message: "O CEP informado é inválido",
        type: 'negative',
        position: 'top-right'
      });
      return false;
    }

    var response = await fetch(`https://viacep.com.br/ws/${encodeURIComponent(zipcode)}/json/`);
    var result = await response.json();
    if ("erro" in result) {
      if (notifyNotFound)
        this.notify({
          message: "CEP não encontrado.",
          type: 'negative',
          position: 'top-right'
        });

      return false;
    } else {
      return result;
    }
  },

  debounce(fn, delay) {
    let timer;

    return function (...args) {
      // Retorna uma nova Promise que resolve o resultado da função passada
      return new Promise((resolve, reject) => {
        // Limpa o timer anterior se a função for chamada antes do delay
        if (timer) clearTimeout(timer);

        // Define um novo timeout
        timer = setTimeout(async () => {
          try {
            // Resolve a Promise com o resultado da função
            const result = await fn(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    };
  },

  async waitFor(condition) {
    if (condition !== true)
      await this.waitFor(condition);

    return true;
  },

  /**
   * Retorna um array de objetos, onde cada objeto contém o nome do mês (label) e o número do mês (value).
   * @param {boolean} [stringfy=false] - Define se o valor do mês será retornado como uma string de dois dígitos.
   *                                   - Se `true`, o número do mês será uma string no formato "01", "02", ..., "12".
   *                                   - Por padrão, o número do mês será retornado como um número inteiro.
   * @returns {Array<{label: string, value: string | number}>}  - Um array de objetos representando os meses do ano. Cada objeto possui:
   *                                                            - `label`: o nome do mês (ex: "Janeiro").
   *                                                            - `value`: o número do mês como string ou número.
   */
  months(stringfy = false) {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    return months.map((month, index) => {
      const value = index + 1; // Número do mês
      return {
        label: month,
        value: stringfy ? value.toString().padStart(2, "0") : value
      };
    });
  },

  empty(value) {
    return (
      value === undefined ||
      value === null ||
      value === false ||
      value === 0 ||
      value === '' ||
      value === '0' ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
    );
  }
}
