const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const inputTxt = document.querySelector(".input-field input");
const transBtn = document.getElementById("translateBtn");
let word = document.querySelector(".theWord h3");
let phonetic = document.querySelector(".theWord span");

let meaning = document.querySelector(".meaning");

let synonyms = document.querySelector(".synonyms");

let sound = document.querySelector(".sound i");
let theExample = document.querySelector(".examples");
let output = document.querySelector(".output-field");

transBtn.addEventListener("click", () => {
  inputTxt.addEventListener("input", function () {
    location.reload();
  });
  translate();
});

async function translate() {
  const response = await fetch(
    "https://api.dictionaryapi.dev/api/v2/entries/en/" + inputTxt.value
  );
  const data = await response.json();
  let theData = data[0];
  console.log(theData);

  output.style.display = "block";

  console.log(theData.word);

  word.innerHTML = theData.word;

  console.log(theData.phonetic);
  phonetic.innerHTML = theData.phonetic
    ? theData.phonetic
    : theData.phonetics[1].text
    ? theData.phonetics[1].text
    : "";
  checkMeanings(theData);

  if (synonyms.innerHTML == "") {
    document.querySelector("article:last-of-type").style.display = "none";
  }

  getExamples(theData);

  if (theExample.innerHTML == "") {
    // theExample.innerHTML = 'unfortunately, there is no example.';
    document.querySelector(".ex").style.display = "none";
  }

  sound.addEventListener("click", () => displayAudio(theData));
}

function displayAudio(theData) {
  console.log(theData.phonetics[0].audio);
  let audioLink = theData.phonetics[0].audio
    ? theData.phonetics[0].audio
    : theData.phonetics[1].audio; // Replace with the actual audio link

  console.log(audioLink);

  // Create an audio element
  const audioElement = new Audio(audioLink);
  // Append the audio element to the document
  document.body.appendChild(audioElement);
  // Play the audio
  audioElement
    .play()
    .then(() => {
      console.log("Audio is playing");
      sound.style.color = "green";
    })
    .catch((error) => {
      console.error("Error playing audio:", error);
    });

  // Remove the audio element when playback is finished
  audioElement.addEventListener("ended", () => {
    document.body.removeChild(audioElement);
    sound.style.color = ""; // Revert icon color
  });
}

function getExamples(theData) {
  let nounExampleDisplayed = false;
  let verbExampleDisplayed = false;
  let adjExampleDisplayed = false;
  let advExampleDisplayed = false;

  theData.meanings.forEach((meaning) => {
    const partOfSpeech = meaning.partOfSpeech;
    console.log(
      `\n${partOfSpeech.charAt(0).toUpperCase() + partOfSpeech.slice(1)}:`
    );

    meaning.definitions.forEach((definition) => {
      const example = definition.example;
      if (example) {
        console.log(`  - Example: ${example}`);

        // Append examples to theExample element
        if (partOfSpeech === "noun" && !nounExampleDisplayed) {
          const exampleElement = document.createElement("p");
          exampleElement.textContent = `(n) ${example}`;
          theExample.appendChild(exampleElement);
          nounExampleDisplayed = true; // Set flag to true to indicate that an example has been displayed for noun
        } else if (partOfSpeech === "verb" && !verbExampleDisplayed) {
          const exampleElement = document.createElement("p");
          exampleElement.textContent = `(v) ${example}`;
          theExample.appendChild(exampleElement);
          verbExampleDisplayed = true; // Set flag to true to indicate that an example has been displayed for verb
        } else if (partOfSpeech === "adjective" && !adjExampleDisplayed) {
          const exampleElement = document.createElement("p");
          exampleElement.textContent = `(adj) ${example}`;
          theExample.appendChild(exampleElement);
          adjExampleDisplayed = true;
        } else if (partOfSpeech === "adverb" && !advExampleDisplayed) {
          const exampleElement = document.createElement("p");
          exampleElement.textContent = `(adv) ${example}`;
          theExample.appendChild(exampleElement);
          advExampleDisplayed = true;
        }
      }
    });
  });
}

function checkMeanings(theData) {
  let theMeaning = theData.meanings;

  theMeaning.forEach((m) => {
    const type = m.partOfSpeech;
    let WType;
    let defs = m.definitions;

    if (type === "noun") {
      WType = "n";
    }
    if (type === "verb") {
      WType = "v";
    }
    if (type === "adjective") {
      WType = "adj";
    }
    if (type === "adverb") {
      WType = "adv";
    }

    // show definition
    for (let i = 0; i < defs.length; i++) {
      let def = defs[i].definition;
      console.log(def);

      let mLi = document.createElement("li");
      let wt = document.createElement("span");
      wt.textContent = `- (${WType})`;
      wt.style.color = "#8797f4";
      wt.style.display = "inline";
      mLi.appendChild(wt);
      mLi.innerHTML += ` ${def}`;
      meaning.appendChild(mLi);
    }

    // Check if synonyms exist before the loop
    for (let i = 0; i < defs.length; i++) {
      let syn = defs[i].synonyms;
      console.log(syn);
      // Display synonyms only if they haven't been displayed yet
      if (syn.length > 0) {
        console.log(syn);

        // for (let j = 0; j < syn.length; j++) {
        let sLi = document.createElement("li");
        let wt = document.createElement("span");
        wt.textContent = `- (${WType})`;
        wt.style.color = "#8797f4";
        wt.style.display = "inline";
        sLi.appendChild(wt);
        sLi.innerHTML += `${syn}`;
        synonyms.appendChild(sLi);
        // }
      }
    }
  });
}
