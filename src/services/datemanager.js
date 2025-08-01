// datemanager.js

function datemanager(dateString) {
  // Pre-process the input: infer its PHP-style format and convert unsupported ones
  // into an ISO-compatible string (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss).
  function preprocessDateString(str) {
    const patterns = [
      // ISO-like formats that are already supported:
      { regex: /^(\d{4})-(\d{2})-(\d{2})$/, format: "Y-m-d", iso: (m) => `${m[1]}-${m[2]}-${m[3]}` },
      { regex: /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/, format: "Y-m-d H:i:s", iso: (m) => `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}` },
      
      // Slash-separated formats:
      { regex: /^(\d{4})\/(\d{2})\/(\d{2})$/, format: "Y/m/d", iso: (m) => `${m[1]}-${m[2]}-${m[3]}` },
      { regex: /^(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/, format: "Y/m/d H:i:s", iso: (m) => `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}` },
      { regex: /^(\d{2})\/(\d{2})\/(\d{4})$/, format: "d/m/Y", iso: (m) => `${m[3]}-${m[2]}-${m[1]}` },
      { regex: /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/, format: "d/m/Y H:i:s", iso: (m) => `${m[3]}-${m[2]}-${m[1]}T${m[4]}:${m[5]}:${m[6]}` },
      
      // Dash-separated formats:
      { regex: /^(\d{2})-(\d{2})-(\d{4})$/, format: "d-m-Y", iso: (m) => `${m[3]}-${m[2]}-${m[1]}` },
      { regex: /^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/, format: "d-m-Y H:i:s", iso: (m) => `${m[3]}-${m[2]}-${m[1]}T${m[4]}:${m[5]}:${m[6]}` },
      
      // Dot-separated formats:
      { regex: /^(\d{2})\.(\d{2})\.(\d{4})$/, format: "d.m.Y", iso: (m) => `${m[3]}-${m[2]}-${m[1]}` },
      { regex: /^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/, format: "d.m.Y H:i:s", iso: (m) => `${m[3]}-${m[2]}-${m[1]}T${m[4]}:${m[5]}:${m[6]}` },
      
      // Two-digit year versions:
      { regex: /^(\d{2})\/(\d{2})\/(\d{2})$/, format: "d/m/y", iso: (m) => {
          let yr = parseInt(m[3], 10);
          yr = yr >= 70 ? "19" + m[3] : "20" + m[3];
          return `${yr}-${m[2]}-${m[1]}`;
        }
      },
      { regex: /^(\d{2})-(\d{2})-(\d{2})$/, format: "d-m-y", iso: (m) => {
          let yr = parseInt(m[3], 10);
          yr = yr >= 70 ? "19" + m[3] : "20" + m[3];
          return `${yr}-${m[2]}-${m[1]}`;
        }
      },
      { regex: /^(\d{2})\.(\d{2})\.(\d{2})$/, format: "d.m.y", iso: (m) => {
          let yr = parseInt(m[3], 10);
          yr = yr >= 70 ? "19" + m[3] : "20" + m[3];
          return `${yr}-${m[2]}-${m[1]}`;
        }
      }
    ];
    
    for (let pat of patterns) {
      const match = str.match(pat.regex);
      if (match) {
        return { isoString: pat.iso(match), inferredFormat: pat.format };
      }
    }
    // If no pattern matches, assume the input is already in a supported ISO format.
    return { isoString: str, inferredFormat: "Y-m-d H:i:s" };
  }
  
  // Preprocess the input date string.
  const { isoString, inferredFormat } = preprocessDateString(dateString);
  
  // Create the Date object from the ISO-compatible string.
  let date = new Date(isoString);
  if (isNaN(date)) {
    throw new Error("Invalid date format");
  }
  
  // The inferred default output format will be the one we detected.
  const defaultFormat = inferredFormat;
  
  // Holds the target timezone string (IANA identifier) if set.
  let currentTimezone = null;
  
  // Helper: Given a Date and a target timeZone, compute the offset in minutes.
  function getOffsetForTimeZone(date, timeZone) {
    // Create a formatter to output numeric parts in the target timezone.
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    });
    const parts = dtf.formatToParts(date);
    const values = {};
    for (let part of parts) {
      if (part.type !== 'literal') {
        values[part.type] = part.value;
      }
    }
    // Build a string interpreted as local time.
    const localString = `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`;
    const localDate = new Date(localString);
    // The difference in minutes between the original date and the date as interpreted in local time
    return (localDate.getTime() - date.getTime()) / (60 * 1000);
  }
  
  // Helper: Format the Date using a PHP-style format string.
  // If a target timeZone is provided, the displayed components come from that zone.
  function formatDate(date, format, timeZone) {
    let displayDate = date;
    if (timeZone) {
      // Convert the date to a string in the target timezone and create a new Date from it.
      // Note: This hack works in many browsers.
      displayDate = new Date(date.toLocaleString("en-US", { timeZone }));
    }
    
    // Prepare arrays for day and month names.
    const fullDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const fullMonths = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const shortMonths = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Compute tokens from displayDate.
    const Y = displayDate.getFullYear();
    const Y_str = Y.toString();
    const y = String(Y % 100).padStart(2, '0');
    const m = String(displayDate.getMonth() + 1).padStart(2, '0');
    const n = String(displayDate.getMonth() + 1);
    const F = fullMonths[displayDate.getMonth()];
    const M = shortMonths[displayDate.getMonth()];
    const d_num = displayDate.getDate();
    const d = String(d_num).padStart(2, '0');
    const j = d_num.toString();
    const l = fullDays[displayDate.getDay()];
    const D = shortDays[displayDate.getDay()];
    const N = (displayDate.getDay() === 0 ? 7 : displayDate.getDay()).toString();
    const S = (function(day) {
      if (day >= 11 && day <= 13) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    })(d_num);
    const w = displayDate.getDay().toString();
    const z = Math.floor((displayDate - new Date(Y, 0, 1)) / 86400000).toString();

    // ISO-8601 week number (W)
    let target = new Date(displayDate.valueOf());
    let dayNr = (displayDate.getDay() + 6) % 7;
    target.setDate(displayDate.getDate() - dayNr + 3);
    let firstThursday = new Date(target.getFullYear(), 0, 4);
    dayNr = (firstThursday.getDay() + 6) % 7;
    firstThursday.setDate(firstThursday.getDate() - dayNr + 3);
    const W = String(1 + Math.round((target - firstThursday) / (7 * 86400000))).padStart(2, '0');

    const L = ((Y % 4 === 0 && Y % 100 !== 0) || (Y % 400 === 0)) ? '1' : '0';
    function getISOYear(d) {
      let target = new Date(d.valueOf());
      target.setDate(d.getDate() - ((d.getDay() + 6) % 7) + 3);
      return target.getFullYear();
    }
    const o = getISOYear(displayDate).toString();

    // Time tokens.
    const H = String(displayDate.getHours()).padStart(2, '0');
    const G = displayDate.getHours().toString();
    const h = String((displayDate.getHours() % 12) === 0 ? 12 : displayDate.getHours() % 12).padStart(2, '0');
    const g = ((displayDate.getHours() % 12) === 0 ? 12 : displayDate.getHours() % 12).toString();
    const i_str = String(displayDate.getMinutes()).padStart(2, '0');
    const s_str = String(displayDate.getSeconds()).padStart(2, '0');
    const a = displayDate.getHours() < 12 ? 'am' : 'pm';
    const A = displayDate.getHours() < 12 ? 'AM' : 'PM';

    // Swatch Internet Time (B)
    let totalSeconds = displayDate.getUTCHours() * 3600 + displayDate.getUTCMinutes() * 60 + displayDate.getUTCSeconds();
    let beat = Math.floor((totalSeconds + 3600) / 86.4) % 1000;
    const B = String(beat).padStart(3, '0');

    // Microseconds (u) & Milliseconds (v)
    const u = String(displayDate.getMilliseconds() * 1000).padStart(6, '0');
    const v = String(displayDate.getMilliseconds()).padStart(3, '0');

    // Timezone tokens – if a target timezone is provided, compute its offset.
    let e, I, O, P, T, Z;
    if (timeZone) {
      e = timeZone;
      const offset = getOffsetForTimeZone(date, timeZone);
      I = offset ? '1' : '0';
      let sign = offset >= 0 ? '+' : '-';
      let absOffset = Math.abs(offset);
      let offsetH = String(Math.floor(absOffset / 60)).padStart(2, '0');
      let offsetM = String(Math.floor(absOffset % 60)).padStart(2, '0');
      O = sign + offsetH + offsetM;
      P = sign + offsetH + ':' + offsetM;
      // Try to get a timezone abbreviation.
      const parts = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' }).formatToParts(date);
      const tzPart = parts.find(part => part.type === 'timeZoneName');
      T = tzPart ? tzPart.value : '';
      Z = String(-offset * 60);
    } else {
      // Use the local system timezone.
      e = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const jan = new Date(Y, 0, 1);
      const jul = new Date(Y, 6, 1);
      I = date.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset()) ? '1' : '0';
      let offset = -date.getTimezoneOffset();
      let sign = offset >= 0 ? '+' : '-';
      let absOffset = Math.abs(offset);
      let offsetH = String(Math.floor(absOffset / 60)).padStart(2, '0');
      let offsetM = String(absOffset % 60).padStart(2, '0');
      O = sign + offsetH + offsetM;
      P = sign + offsetH + ':' + offsetM;
      const parts = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(date);
      const tzPart = parts.find(part => part.type === 'timeZoneName');
      T = tzPart ? tzPart.value : '';
      Z = String(-date.getTimezoneOffset() * 60);
    }
    
    // Full Date/Time tokens.
    const c = `${Y_str}-${m}-${d}T${H}:${i_str}:${s_str}${P}`;
    const r = `${D}, ${d} ${M} ${Y_str} ${H}:${i_str}:${s_str} ${O}`;
    const U = String(Math.floor(date.getTime() / 1000));

    // Map each PHP date() token to its computed value.
    const tokens = {
      'd': d,
      'D': D,
      'j': j,
      'l': l,
      'N': N,
      'S': S,
      'w': w,
      'z': z,
      'W': W,
      'F': F,
      'm': m,
      'M': M,
      'n': n,
      't': String(new Date(Y, displayDate.getMonth() + 1, 0).getDate()),
      'L': L,
      'o': o,
      'Y': Y_str,
      'y': y,
      'a': a,
      'A': A,
      'B': B,
      'g': g,
      'G': G,
      'h': h,
      'H': H,
      'i': i_str,
      's': s_str,
      'u': u,
      'v': v,
      'e': e,
      'I': I,
      'O': O,
      'P': P,
      'T': T,
      'Z': Z,
      'c': c,
      'r': r,
      'U': U
    };

    // Process the format string, honoring escapes with a backslash.
    let output = '';
    for (let i = 0; i < format.length; i++) {
      let char = format[i];
      if (char === '\\') {
        i++;
        if (i < format.length) {
          output += format[i];
        }
        continue;
      }
      output += tokens.hasOwnProperty(char) ? tokens[char] : char;
    }
    return output;
  }
  
  return {
    add: function(what, howMuch) {
      if (typeof howMuch !== 'number') {
        throw new Error("'howMuch' must be a number.");
      }
      switch (what) {
        case 'second':
        case 'seconds':
          date.setSeconds(date.getSeconds() + howMuch);
          break;
        case 'minute':
        case 'minutes':
          date.setMinutes(date.getMinutes() + howMuch);
          break;
        case 'hour':
        case 'hours':
          date.setHours(date.getHours() + howMuch);
          break;
        case 'day':
        case 'days':
          date.setDate(date.getDate() + howMuch);
          break;
        case 'week':
        case 'weeks':
          date.setDate(date.getDate() + howMuch * 7);
          break;
        case 'month':
        case 'months':
          date.setMonth(date.getMonth() + howMuch);
          break;
        case 'year':
        case 'years':
          date.setFullYear(date.getFullYear() + howMuch);
          break;
        default:
          throw new Error("Unsupported time unit: " + what);
      }
      return this;
    },

    set: function(what, value) {
      if (typeof value !== 'number') {
        throw new Error("'value' must be a number.");
      }
      switch (what) {
        case 'second':
        case 'seconds':
          date.setSeconds(value);
          break;
        case 'minute':
        case 'minutes':
          date.setMinutes(value);
          break;
        case 'hour':
        case 'hours':
          date.setHours(value);
          break;
        case 'day':
        case 'days':
          date.setDate(value);
          break;
        // 'week' is not handled by set.
        case 'month':
        case 'months':
          date.setMonth(value - 1);
          break;
        case 'year':
        case 'years':
          date.setFullYear(value);
          break;
        default:
          throw new Error("Unsupported time unit: " + what);
      }
      return this;
    },

    // New: setTimezone lets you specify a target IANA timezone identifier.
    setTimezone: function(tz) {
      currentTimezone = tz;
      return this;
    },

    output: function(format) {
      const fmt = format || defaultFormat;
      return formatDate(date, fmt, currentTimezone);
    }
  };
}

export default datemanager;
