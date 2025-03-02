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
  'the sky was painted in shades of orange and pink as the sun dipped below the horizon', 
   'casting long shadows across the quiet streets a gentle breeze rustled the leaves of'
//  'the old oak trees lining the sidewalk carrying the faint scent of rain from a storm',
//  'that had passed earlier in the afternoon in the distance the soft hum of traffic ',
//  'blended with the occasional chirp of crickets creating a soothing evening symphony'
];
let total_length = sentences.join("").replace(/ /g, "").length;


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
  document.removeEventListener("keydown", handleFirstKeydown);
  start_session = Date.now();
};


document.addEventListener("keydown", handleFirstKeydown);


function handleTyping(event) {
    
  if (isTestFinished) return; 

  let end_time = Date.now();
  let time_passed = (end_time - start_time) / 1000;

  let timer = (end_time - start_session) / 1000;
  



  
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
      update_timer();
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
  
  let wpm = correct_words * 60 / time_passed;
  update_wpm(wpm);
  update_timer(timer);

  if (i === originalText.length && j+1 < sentences.length) {
    j++;
    start_session = Date.now();
    UpdateState();
    update_timer();
  }


  if (timer > TimeLimit) {
   
    if (j+1 !== sentences.length) {
        j++;
        UpdateState();
        start_session = Date.now();
        update_timer();

    } else {
        const final_time = (Date.now() - start_time) / 1000;
        const accuracy = (correct_characters / all_characters) * 100;
        const final_wpm = correct_words * 60 / final_time;
        WordsPerMinute.style.display = 'none';
        Clock.style.display = 'none';
        let result = document.createElement("div");
        result.textContent = "WPM: "+ final_wpm.toFixed(0);
        result.classList.add("wpm");
        paragraph.appendChild(result);
    
        paragraph.innerHTML = `
          <span style="animation: flameEffect_white 2.5s infinite alternate;">Accuracy: ${accuracy.toFixed(0)}%</span><br>
          <span style="animation: flameEffect_white 2.5s infinite alternate;">WPM: ${final_wpm.toFixed(0)}</span>
        `;
        update_wpm(final_wpm); 
        isTestFinished = true; 
    
        let container = document.getElementById("type");
        if (container) container.style.marginLeft = "500px";
      }
  }

  
  if (j+1 === sentences.length && i === originalText.length) {
    const final_time = (Date.now() - start_time) / 1000;
    const accuracy = (correct_characters / total_length) * 100;
    const final_wpm = correct_words * 60 / final_time;
    WordsPerMinute.style.display = 'none';
    Clock.style.display = 'none';
    let result = document.createElement("div");
    result.textContent = "WPM: "+ final_wpm.toFixed(0);
    result.classList.add("wpm");
    paragraph.appendChild(result);

    paragraph.innerHTML = `
      <span style="animation: flameEffect_white 2.5s infinite alternate;">Accuracy: ${accuracy.toFixed(0)}%</span><br>
      <span style="animation: flameEffect_white 2.5s infinite alternate;">WPM: ${final_wpm.toFixed(0)}</span>
    `;
    update_wpm(final_wpm); 
    isTestFinished = true; 

    let container = document.getElementById("type");
    if (container) container.style.marginLeft = "500px";
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
        wpm = 0;
        update_wpm(wpm);        
        WordsPerMinute.style.display = 'block';
        let container = document.getElementById("type");
        if (container) container.style.marginLeft = "0"; 
        UpdateState();

        document.addEventListener("keydown", handleFirstKeydown);
    }
});