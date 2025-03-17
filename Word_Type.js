let paragraph = document.getElementById("paragraph");
let originalText = paragraph.textContent.trim();
let WordsPerMinute = document.getElementById("WPM");
let Clock = document.getElementById("Clock");
const TimeLimit = 20;
let i = 0;
let j = 0;
let correct_characters = 0;
let all_characters = 0;
let correct_words = 0;
let currentWordHasError = false; 
let isTestFinished = false; 
let sentences = [
  'the sky was painted in shades of orange and pink as the sun dipped below the horizon'
];
let total_length = sentences.join("").replace(/ /g, "").length;
let timerInterval;

function update_timer(timer) {
    Clock.innerHTML = `
        <span style="animation: flameEffect_white 2.5s infinite alternate;">Time Left: ${(TimeLimit - timer).toFixed(0)}</span>
    `;
    Clock.classList.add("wpm");
}

function update_wpm(wpm) {
    WordsPerMinute.innerHTML = `
    <span style="animation: flameEffect_white 2.5s infinite alternate;">WPM: ${(wpm).toFixed(0)}</span>
    `;
    WordsPerMinute.classList.add("wpm");
}

function isChar(c) {
  return /^[a-zA-Z]$/.test(c);
}

function UpdateState() {
  paragraph = document.getElementById("paragraph");
  paragraph.innerText = sentences[j];
  originalText = paragraph.textContent.trim();
  i = 0;
  currentWordHasError = false;
  displayedText = originalText.split("").map(char => {
    return char === " " 
        ? char 
        : `<span style="color:rgba(108,99,99,255);">${char}</span>`; 
  });
  paragraph.innerHTML = displayedText.join("");
}

UpdateState();

let start_time;
let start_session = Date.now();

const handleFirstKeydown = (event) => {
  start_time = Date.now(); 
  start_session = Date.now();
  document.removeEventListener("keydown", handleFirstKeydown);
  timerInterval = setInterval(updateTimer, 1000);
};

document.addEventListener("keydown", handleFirstKeydown);

function updateTimer() {
  const currentTime = Date.now();
  const elapsed = (currentTime - start_session) / 1000;
  update_timer(elapsed);

  const total_time_passed = (currentTime - start_time) / 1000;
  if (total_time_passed > 0) {
    const current_wpm = correct_words * 60 / total_time_passed;
    update_wpm(current_wpm);
  }

  if (elapsed >= TimeLimit) {
    if (j + 1 < sentences.length) {
      j++;
      start_session = Date.now();
      UpdateState();
    } else {
      endTest();
      clearInterval(timerInterval);
    }
  }
}

function endTest() {
  const final_time = (Date.now() - start_time) / 1000;
  const accuracy = (correct_characters / all_characters) * 100;
  const final_wpm = correct_words * 60 / final_time;

  WordsPerMinute.style.display = 'none';
  Clock.style.display = 'none';
  paragraph.innerHTML = `
    <span style="animation: flameEffect_white 2.5s infinite alternate;">Accuracy: ${accuracy.toFixed(0)}%</span><br>
    <span style="animation: flameEffect_white 2.5s infinite alternate;">WPM: ${final_wpm.toFixed(0)}</span>
  `;
  isTestFinished = true;

  let container = document.getElementById("type");
  if (container) container.style.marginLeft = "500px";
}

function handleTyping(event) {
  if (isTestFinished) return; 

  let end_time = Date.now();
  let time_passed = (end_time - start_time) / 1000;

  if (event.key === "Backspace" && i > 0) { 
    i--;
    let charToReset = originalText[i];
    displayedText[i] = charToReset === " " 
      ? charToReset 
      : `<span style="color:rgba(108,99,99,255);">${charToReset}</span>`;
    if (charToReset === " ") currentWordHasError = false;
    paragraph.innerHTML = displayedText.join("");
    return;
  }

  if (i < originalText.length) { 
    let expectedChar = originalText[i];
    if (expectedChar === " " && event.key === " ") {
      i++;
      if (!currentWordHasError) correct_words++;
      currentWordHasError = false;
      paragraph.innerHTML = displayedText.join("");
      return;
    }

    if (event.key === "Enter" && event.shiftKey && j + 1 < sentences.length) {
      j++;
      start_session = Date.now();
      UpdateState();
      return;
    }

    if (event.key === expectedChar) {
      displayedText[i] = `<span style="animation: flameEffect_white 2.5s infinite alternate;">${originalText[i]}</span>`;
      correct_characters++;
      all_characters++;
      i++;
    } 
    else if (isChar(event.key) && expectedChar !== " ") {
      displayedText[i] = `<span style="color:rgb(255, 25, 0);">${expectedChar}</span>`;
      all_characters++;
      currentWordHasError = true;
      i++;
    } 
    else if (expectedChar === " " && isChar(event.key)) {
      if (i > 0 && originalText[i - 1] !== " ") {
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = displayedText[i-1];
        let currenWord = tempDiv.textContent;
        currenWord += event.key;
        displayedText[i-1] = `<span style="color:rgb(255, 25, 0);">${currenWord}</span>`; 
      }
    } 
    else return;
    paragraph.innerHTML = displayedText.join("");
  }

  if (i === originalText.length) {
    if (j +1 < sentences.length) {
      j++;
      start_session = Date.now();
      UpdateState();
    } else {
      endTest();
      clearInterval(timerInterval);
    }
  }
}

document.addEventListener("keydown", handleTyping);

document.addEventListener("keydown", function(event) {
    if (isTestFinished && event.key === "Enter") {
        j = 0;
        i = 0;
        correct_characters = 0;
        correct_words = 0;
        currentWordHasError = false;
        isTestFinished = false;
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        update_timer(0);
        update_wpm(0);
        Clock.style.display = 'block';      
        WordsPerMinute.style.display = 'block';
        let container = document.getElementById("type");
        if (container) container.style.marginLeft = "0"; 
        UpdateState();
        document.addEventListener("keydown", handleFirstKeydown);
    }
});
