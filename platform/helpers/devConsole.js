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

export function printDevConsoleMsg(error) {
  // todo: disable if env is prod

  console.log(
    `%c
Development error: 
${error}`,
    parseJSS(ERROR_JSS)
  );
}
