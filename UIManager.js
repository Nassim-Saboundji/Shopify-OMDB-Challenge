// api key : defff54c

//when a movie card is created keep track of it's id even when removed from 
//nomination.
//don't forget to add a favicon for the webpage!
//make sure that the user doesn't have to click the search button
//for results to update

//don't forget to delete the search results between each search query.


/// update the search results after the user is done typing
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


    fetch("http://www.omdbapi.com/?apikey=defff54c&s=" + userQuery)
    .then(async response => {
        const data = await response.json();
    
        let resultArray = data.Search;
    
        
        let validResultArray = []
        for (let i = 0; i < resultArray.length; i++){
            if(resultArray[i]["Type"] == "movie"){
                validResultArray.push(resultArray[i]);
            }
        }

        console.log(validResultArray);
        let finalResults = generateMovieSpecs(validResultArray);
        
        
        //Will display all the results in the results tab.
        for (let i = 0; i < finalResults.length; i++) {
            injectCard(finalResults[i]);
        }

        disableOnNewSearch(finalResults);


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
            titleElement: document.createElement("h3"),
            posterElement: document.createElement("img"),
            cardElement: document.createElement("div"),
            actionButton: document.createElement("button")
        }
        
        movieSpecs.push(aMovieSpec);
        
    }
    console.log(movieSpecs);
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

    //put in that container the poster element 
    aMovieSpec.cardElement.appendChild(aMovieSpec.posterElement);
    //provide the poster link to the posterElement
    //also making sure that we have a valid poster link.
    if(aMovieSpec.posterLink != "N/A"){
       aMovieSpec.posterElement.src = aMovieSpec.posterLink; 
    }
    

    //after having provided the poster image, inject the title element
    //in the resultsContainer
    aMovieSpec.cardElement.appendChild(aMovieSpec.titleElement);

    
    aMovieSpec.titleElement.textContent = aMovieSpec.title + "  (" + aMovieSpec.year + ") ";
    

    aMovieSpec.cardElement.appendChild(aMovieSpec.actionButton);
    
    
    aMovieSpec.actionButton.textContent = "Nominate";
    aMovieSpec.actionButton.onclick = function(){
        let nominations = document.getElementById("nominations");
        let cardClone = aMovieSpec.cardElement.cloneNode(true);
            
        //disable the button in the original card in the search results
        aMovieSpec.actionButton.disabled = true;
        nominations.appendChild(cardClone);

        //change the button text from "Nominate" to "Remove"
        cardClone.childNodes[2].textContent = "Remove";

        cardClone.childNodes[2].onclick = function(){
            //enable the original card if it's in the current search results
            aMovieSpec.actionButton.disabled = false;
            
            cardClone.remove();
            
        };
    };    
   
}

//when doing a new search check if a title in the results
//is already available in the nominations and if yes disable it's button.
function disableOnNewSearch(resultsArray){
    let results = document.getElementById('results');
    let nominations = document.getElementById('nominations');
    console.log(results.childNodes);
    console.log(nominations.childNodes);

    for(let i = 0; i < nominations.childNodes.length; i++) {
        for(let j = 0; j < resultsArray.length; j++){
            if(nominations.childNodes[i].id == resultsArray[j].id){
                resultsArray[j].actionButton.disabled = true;
            }
        }
    }


    

}