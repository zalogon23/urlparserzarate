document.addEventListener("click", (e) => {
  if (e.target.classList.contains("parse-button")) handleParse();
  if (e.target.classList.contains("copy-button")) handleCopy()
})

document.addEventListener("keydown", (e) => {
  if (e.target.classList.contains("field") && e.key === "Enter") handleParse()
})

function handleParse() {
  const helper = document.querySelector(".helper");
  const url = document.querySelector(".field").value;
  const result = document.querySelector(".result");
  const resultGroup = document.querySelector(".resultgroup");

  helper.innerHTML = "";
  result.innerHTML = "";
  resultGroup.classList.add("hidden")

  if (!url) {
    helper.innerHTML = "Please, type a url";
    return;
  }
  try {

    const parsedUrl = parseUrl(url);
    resultGroup.classList.remove("hidden")
    result.innerHTML = JSON.stringify(parsedUrl, null, 2);

  } catch (e) {

    helper.innerHTML = e.message;

  }
}

function parseUrl(url) {
  const hasSpaces = url.indexOf(" ") !== -1
  if (hasSpaces) throw new Error("The url can't have spaces.");

  const startsWithSlash = url.indexOf("/") === 0;
  if (!startsWithSlash) throw new Error("The url should start with a slash.");
  const sections = url.split("/").slice(1);

  const version = sections[0];
  const isApi = sections[1] === "api";
  const collection = sections[2];
  const idSection = sections[3];

  if (!version?.length ||
    !collection?.length ||
    !idSection?.length ||
    !isApi
  ) throw new Error("The url format is wrong.")

  const queryIndex = idSection.indexOf("?");
  const hasParameters = queryIndex !== -1;

  const id = hasParameters ? idSection.slice(0, queryIndex) : idSection;

  let parsedUrl = { id, version, collection };

  if (hasParameters) {

    const parameters = idSection.slice(queryIndex + 1);
    const pairs = parameters.split("&");

    const hasAtLeastOnePair = pairs[0].length > 0;
    if (!hasAtLeastOnePair) throw new Error("There are no parameters.")

    const hasForbiddenCharacters = parameters.indexOf("?") !== -1;
    if (hasForbiddenCharacters) throw new Error("The parameters have forbidden characters.")

    pairs.forEach(pair => {

      const [name, value] = pair.split("=");

      if (!name?.length || !value?.length) throw new Error("There is a problem with the parameters.");

      parsedUrl = { ...parsedUrl, [name]: value };

    })
  }

  return parsedUrl
}

function handleCopy() {
  const result = document.querySelector(".result");
  const value = result.innerHTML;
  if (value.length === 0) return;
  navigator.clipboard.writeText(result.innerHTML);
}