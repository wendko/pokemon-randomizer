const LOCAL_STORAGE_KEY = "pokemon-data";
const LOCAL_STORAGE_KEY_COMPLETED = "pokemon-data-completed";
let caughtCount = 0;

const SPRITE_CLASSES = [
  "pkmn__snake",
  "pkmn__quadruped",
  "pkmn__rhydon",
  "pkmn__bug",
  "pkmn__plant",
  "pkmn__bird",
  "pkmn__clefairy",
  "pkmn__ball",
  "pkmn__fossil",
  "pkmn__pikachu",
  "pkmn__aquatic",
];

const getRandomizedData = (dataArr) => {
  return dataArr.sort((a, b) => Math.random() - 0.5);
};

const getLocalStorageData = () =>
  localStorage.getItem(LOCAL_STORAGE_KEY)?.split(",");
const setLocalStorageData = (data) =>
  localStorage.setItem(LOCAL_STORAGE_KEY, data);

const getLocalStorageCompletedData = () =>
  localStorage.getItem(LOCAL_STORAGE_KEY_COMPLETED)?.split(",");
const addToLocalStorageCompletedData = (newItem) => {
  const existingCompleted = getLocalStorageCompletedData();
  const data =
    existingCompleted && existingCompleted[0]
      ? [...existingCompleted, newItem]
      : [newItem];
  localStorage.setItem(LOCAL_STORAGE_KEY_COMPLETED, data);
};
const resetLocalStorageCompletedData = () => {
  localStorage.setItem(LOCAL_STORAGE_KEY_COMPLETED, []);
};

const shiftLocalStorageData = () => {
  const data = getLocalStorageData();
  data.shift();
  setLocalStorageData(data);
};

const getRandomSprite = () =>
  SPRITE_CLASSES[Math.floor(Math.random() * SPRITE_CLASSES.length)];

const switchSprites = () => {
  const spritesElArr = document.getElementsByClassName("pkmn");
  spritesElArr.item(0).classList = `pkmn ${getRandomSprite()}`;
  spritesElArr.item(1).classList = `pkmn ${getRandomSprite()}`;
};

const setNextState = () => {
  const dataArr = getLocalStorageData();
  // Switch sprite
  switchSprites();

  // Game continue state
  if (dataArr.length && dataArr[0]) {
    document.getElementById("remainingCount").innerHTML = dataArr.length;
    document.getElementById("currentPokemon").innerHTML = dataArr[0];
    return;
  }
  // Game end state
  document.getElementById("remainingCount").innerHTML = "0";
  document.getElementById("currentPokemon").innerHTML = "You caught them all!";
  document.getElementById("btnNext").setAttribute("disabled", true);
  document.getElementById("btnSkip").setAttribute("disabled", true);
};

const resetData = () => {
  const randomizedData = getRandomizedData(gen1);
  setLocalStorageData(randomizedData);
  document.getElementById("btnNext").removeAttribute("disabled");
  document.getElementById("btnSkip").removeAttribute("disabled");

  resetLocalStorageCompletedData();
  document.getElementById("caughtPokemon").innerHTML = [];

  caughtCount = 0;
  document.getElementById("caughtCount").innerHTML = caughtCount;
};

const setCaughtCount = (count) => {
  caughtCount = count;
  document.getElementById("caughtCount").innerHTML = caughtCount;
};

const setup = () => {
  const data = getLocalStorageData();
  if (!data) {
    resetData();
  }
  const completedData = getLocalStorageCompletedData();
  if (completedData && completedData[0]) {
    setCaughtCount(completedData.length);
    completedData.forEach(
      (data) =>
        (document.getElementById(
          "caughtPokemon"
        ).innerHTML += `<span>${data}</span>`)
    );
  } else {
    setCaughtCount(0);
  }

  document.getElementById("btnNext").addEventListener("click", () => {
    const [caughtPokemon, ...data] = getLocalStorageData();
    setLocalStorageData(data);
    setNextState();
    addToLocalStorageCompletedData(caughtPokemon);

    document.getElementById(
      "caughtPokemon"
    ).innerHTML += `<span>${caughtPokemon}</span>`;
    setCaughtCount(caughtCount + 1);
  });

  document.getElementById("btnSkip").addEventListener("click", () => {
    shiftLocalStorageData();
    setNextState();
  });

  document.getElementById("btnReset").addEventListener("click", () => {
    resetData();
    setNextState();
  });
};

setup();
setNextState();
