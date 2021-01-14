//The UI manager takes care of all the UI functionnalities.


function loadSavedNominations(){
    let data = localStorage.getItem('data');
    document.getElementById("nominations").innerHTML = data;
    let nominations = document.getElementById("nominations").childNodes;
    for (let i = 0; i < nominations.length; i++){
        
        nominations[i].childNodes[2].onclick = function(){
            if(nominations.length == 1){
                reEnableOnRemove(nominations[0].id);
                nominations[0].remove();
            }else{
               //enable the original card if it's in the current search results
                reEnableOnRemove(nominations[i].id);           
                nominations[i].remove(); 
            }
        };
    }
    
}

//save the nominations when the user leaves the webpage.
window.addEventListener('unload', function(){
    let array = document.getElementById("nominations").innerHTML;
    localStorage.setItem('data', array);
});

loadSavedNominations();


let timer; 
let timeoutVal = 1000;

let resultsContainer = document.getElementById("results");
let textBox = document.getElementById("query");

textBox.addEventListener('keyup', handleKeyUp);

function handleKeyUp(e) {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
        getResults();
    }, timeoutVal)
}


function clearResults(){
    let resultsContainer = document.getElementById("results");
    while(resultsContainer.firstChild){
        resultsContainer.firstChild.remove();
    }
}



function getResults(){
    //clear the current search results before making a new search.
    clearResults();
    
    let userQuery = document.getElementById("query").value;

    
    fetch("https://www.omdbapi.com/?apikey=defff54c&s=" + userQuery)
    .then(async response => {
        const data = await response.json();
    
        let resultArray = data.Search;
    
        
        let validResultArray = []
        for (let i = 0; i < resultArray.length; i++){
            if(resultArray[i]["Type"] == "movie"){
                validResultArray.push(resultArray[i]);
            }
        }

        
        let finalResults = generateMovieSpecs(validResultArray);
        
        
        //Will display all the results in the results tab.
        for (let i = 0; i < finalResults.length; i++) {
            injectCard(finalResults[i]);
        }

        //will disable titles that are already in the nomination section.
        disableOnNewSearch();


    })
    .catch(error => {
        //insert something into the DOM to notify the user that there is an error.
        let errorMessage = document.createElement("p");
        errorMessage.textContent = "Results for this search are not available :/ ";
        let resultsContainer = document.getElementById("results");
        resultsContainer.appendChild(errorMessage);
    });
}

function generateMovieSpecs(validResultArray){
    
    let movieSpecs = [];
    for (let i = 0; i < validResultArray.length; i++) {
        
        let aMovieSpec = {
            title: validResultArray[i]["Title"],
            year: validResultArray[i]["Year"],
            id: validResultArray[i]["imdbID"],
            posterLink: validResultArray[i]["Poster"],
            titleElement: document.createElement("h4"),
            posterElement: document.createElement("img"),
            cardElement: document.createElement("div"),
            actionButton: document.createElement("button")
        }
        
        movieSpecs.push(aMovieSpec);
        
    }
    
    return movieSpecs;
}




// Will inject a card containing a poster, a title with the year of release
// and a button to nominate/remove.
function injectCard(aMovieSpec){
    let resultsContainer = document.getElementById("results");
    
    //add the container to the result section
    resultsContainer.appendChild(aMovieSpec.cardElement);
    
    //set an id for the card so we can keep track of it.
    aMovieSpec.cardElement.id = aMovieSpec.id;
    aMovieSpec.cardElement.className = "movieCard";
    
    //put in that container the poster element 
    aMovieSpec.cardElement.appendChild(aMovieSpec.posterElement);
    //provide the poster link to the posterElement
    //also making sure that we have a valid poster link.
    if(aMovieSpec.posterLink != "N/A"){
       aMovieSpec.posterElement.src = aMovieSpec.posterLink;
       aMovieSpec.posterElement.className = "posterImage"; 
    } else {
       aMovieSpec.posterElement.src = './placeholder.jpg';
       aMovieSpec.posterElement.className = "posterImage"; 
    }
    

    //after having provided the poster image, inject the title element
    //in the resultsContainer
    aMovieSpec.cardElement.appendChild(aMovieSpec.titleElement);
    aMovieSpec.titleElement.textContent = aMovieSpec.title + "  (" + aMovieSpec.year + ") ";
    aMovieSpec.cardElement.appendChild(aMovieSpec.actionButton);
    
    
    aMovieSpec.actionButton.textContent = "Nominate";
    aMovieSpec.actionButton.onclick = function(){
        
        let nbTitles = document.getElementById('nominations').childNodes.length;
            
            if(nbTitles < 5){

                if (nbTitles == 4) {
                    notifyUser();
                }

                let nominations = document.getElementById("nominations");
                let cardClone = aMovieSpec.cardElement.cloneNode(true);
            
                //disable the button in the original card in the search results
                aMovieSpec.actionButton.disabled = true;
                nominations.appendChild(cardClone);
       

                //change the button text from "Nominate" to "Remove"
                cardClone.childNodes[2].textContent = "Remove";

                cardClone.childNodes[2].onclick = function(){
            
                    //enable the original card if it's in the current search results
                    reEnableOnRemove(cardClone.id);           
                    cardClone.remove();
            
                };
            } else {
                notifyUser();
            }
    };    
   
}

function notifyUser(){        
    let notifications = document.getElementById('notifications');
    let notify =  document.createElement('p');
    notify.textContent = "You have nominated 5 titles!";
    notify.id = 'notify';
    notifications.appendChild(notify);
   
    window.setTimeout(() => {
        notify.remove();
    }, 3000);
}


function reEnableOnRemove(IdOfCardToRemove){
    let results = document.getElementById('results');
    for(let i = 0; i < results.childNodes.length; i++){
        if(results.childNodes[i].id == IdOfCardToRemove){
            results.childNodes[i].childNodes[2].disabled = false;
        }
    }
}




//when doing a new search check if a title in the results
//is already available in the nominations and if yes disable it's button.
function disableOnNewSearch(){
    let results = document.getElementById('results');
    let nominations = document.getElementById('nominations');
    
    for(let i = 0; i < nominations.childNodes.length; i++) {
        for(let j = 0; j < results.childNodes.length; j++){
            if(nominations.childNodes[i].id == results.childNodes[j].id){   
                results.childNodes[j].childNodes[2].disabled = true;
               
                //results.childNodes[j].childNodes[2].disabled = false;
                
            }
        }
    }
    
}



