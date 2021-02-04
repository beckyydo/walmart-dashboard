
function init(){
        var url = "/api/market_share"

        d3.json(url).then(function(response){
                for ( var i =0 ; i < response.length ; i++ ) {
                        var element = response[i]
                        console.log(element.City)
                }
               
        })       
}

init();