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
        


    })
    .catch(error => {
        console.error('There was an error!', error);
        //insert something into the DOM to notify the user that there is an error.
    });
}