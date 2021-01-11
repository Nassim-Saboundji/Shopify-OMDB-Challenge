// api key : defff54c

//when a movie card is created keep track of it's id even when removed from 
//nomination.
//don't forget to add a favicon for the webpage!

function getResults(){
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
        generateMovieSpecs(validResultArray);


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
}

function injectCard(aMovieSpec, section){
    let resultsContainer = document.getElementById("results");
    //append the movie card to the results se
    resultsContainer.appendChild(aMovieSpec.cardElement);
}
