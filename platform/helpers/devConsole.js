const ERROR_JSS = {
  color: "firebrick",
  fontWeight: "bold",
  padding: "0 15px 15px 0",
};

function parseJSS(jss) {
  let cssString = "";

  function convertToKebab(string) {
    return [...string]
      .map((letter, index) => {
        if (letter.toUpperCase() === letter) {
          if (index !== 0) {
            return `-${letter.toLowerCase()}`;
          }
          return letter.toLowerCase();
        }
        return letter;
      })
      .join("");
  }

  Object.entries(jss).forEach(([key, value]) => {
    cssString += `${convertToKebab(key)}: ${value}; `;
  });

  return cssString;
}

export function printDevConsoleMsg(errorMsg, ...rest) {
  // TODO disable if env is prod

  console.log(
    `%c
Development error: 
${errorMsg}`,
    parseJSS(ERROR_JSS),
    rest
  );
}

export function showMe(objVar, cloneValue = false) {
  const [varName, value] = Object.entries(objVar)[0];

  console.log(`${varName}: `, cloneValue ? deepClone(value) : value);
}

export function deepClone(val) {
  return JSON.parse(JSON.stringify(val));
} // with maybe the exception of lodash's implementation, this is the easiest, lightest, and foolest-proof way to deep clone an object.
