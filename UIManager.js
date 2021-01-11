// api key : defff54c

//when a movie card is created keep track of it's id even when removed from 
//nomination.
//don't forget to add a favicon for the webpage!

//don't forget to delete the search results between each search query.

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
            injectCard(finalResults[i], "results");
        }

    })
    .catch(error => {
        console.error('There was an error!', error);
        //insert something into the DOM to notify the user that there is an error.
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
function injectCard(aMovieSpec, sectionId){
    let resultsContainer = document.getElementById(sectionId);
    
    //add the container to the result section
    resultsContainer.appendChild(aMovieSpec.cardElement);
    
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

    //inject the title + year inside the title element so it can be visible
    //to the user.
    aMovieSpec.titleElement.textContent = aMovieSpec.title + "  (" + aMovieSpec.year + ") ";
    

    aMovieSpec.cardElement.appendChild(aMovieSpec.actionButton);
    
    //change the button text depending on the section where it lives.
    if (sectionId == "results") {
        aMovieSpec.actionButton.textContent = "Nominate";
    } else {
        aMovieSpec.actionButton.textContent = "Remove"; 
    }

}
