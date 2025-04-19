const selectTag=document.querySelectorAll("select");
const translationBtn=document.querySelector("#transfer");
const fromText=document.querySelector("#fromtext");
const toText=document.querySelector("#totext");
const icons=document.querySelectorAll("img");
selectTag.forEach((tag,id)=>{
    for (const countriesCode in countries) {
        let selected;
        if(id==0&&countriesCode=="en-GB"){
            selected = " selected";
        }
        else if(id==1&&countriesCode=="hi-IN"){
            selected = " selected";
        }
        let option = `<option value="${countriesCode}" ${selected}>${countries[countriesCode]}</option>`;

        tag.insertAdjacentHTML("beforeend",option);
       }
});
translationBtn.addEventListener("click", () => {
    let text = fromText.value.trim();
    let translateFrom = selectTag[0].value;
    let translateTo = selectTag[1].value; 
    if (!text) {
        alert("Please enter text to translate!");
        return;
    }
    let apiURL = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiURL)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            if (data.responseData && data.responseData.translatedText) {
                toText.value = data.responseData.translatedText;
            } else if (data.matches && data.matches[0] && data.matches[0].translation) {
                toText.value = data.matches[0].translation;
            } else {
                console.error("Translation failed. Response:", data);
                alert("Translation failed. Please try again.");
            }
        })
        .catch((error) => {
            console.error("Error fetching translation:", error);
            alert("An error occurred while fetching the translation. Please try again.");
        });
});
icons.forEach(icon =>{
    icon.addEventListener("click", ({target})=>{
        if(target.classList.contains("copy") ){
            if(target.id=="from"){
                navigator.clipboard.writeText(fromText.value)
            }
            else{
                navigator.clipboard.writeText(toText.value)
            }
        }
        else{
            let utterance;
            if(target.id=="from"){
                utterance=new SpeechSynthesisUtterance(fromText.value)
                utterance.lang=selectTag[0].value;
            }
            else{
                utterance=new SpeechSynthesisUtterance(toText.value)
                utterance.lang=selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});


