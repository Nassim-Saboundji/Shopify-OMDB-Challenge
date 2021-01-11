// api key : defff54c

function getResults(){
    let userQuery = document.getElementById("query").value;


    fetch("http://www.omdbapi.com/?apikey=defff54c&s=" + userQuery)
    .then(async response => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
            // get error message from body or default to response statusText
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        console.log(data);
    })
    .catch(error => {
        console.error('There was an error!', error);
        //insert something into the DOM to notify the user that there is an error.
    });
}