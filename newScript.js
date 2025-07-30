let distances =[]
var soundIsPlaying = 0
var showSongMessage = 0

let distIndicator = document.getElementById("distanceIndicator")
let taleDescription = document.getElementById("taleDescription")

let songIndicator = document.getElementById("songIndicator")
let dismiss = document.getElementById("dismiss")
    if(songIndicator!==null){songIndicator.style.display ="none"}

let ambientSound = document.getElementById("ambientSound")
let speaker = document.getElementById("speaker")

let accuracyIndicator = document.getElementById("accuracyIndicator")


let interface = document.getElementById("interface")
    if(interface!==null){interface.style.display ="none"}

var currentCoord={"latitude":0,"longitude":0}
let minDistance = 0
var lat=0
var lon=0
let pois= null
var showMessage = 0

let poisWithDistances = []


async function getData(){
    const data =  await fetch('./data.json');
    console.log("data are loaded");
    

    pois =  await data.json();
    console.log(pois)


    //UNNECESSARY CODE

}

function getGPSPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => {


                currentCoord.latitude = position.coords.latitude;
                currentCoord.longitude = position.coords.longitude;

                lat = position.coords.latitude;
                lon = position.coords.longitude;


                console.log(currentCoord)
                console.log(lat, lon);
                resolve({ lat, lon });


                console.log("GPS was Accessed")
                console.log(position.coords.accuracy)

                if(position.coords.accuracy<20){
                    accuracyIndicator.style.display="none"
                } else{
                    accuracyIndicator.style.display="flex"
                }
            },
            error => {
                console.error("Error getting location:", error);
                reject(error);
            }
        );


        //updateContent()
    });
}

function calculateDistance(coord1, coord2) {
    const R = 6371; // Radius of the Earth in kilometers
    const lat1 = toRadians(coord1.latitude);
    const lon1 = toRadians(coord1.longitude);
    const lat2 = toRadians(coord2.latitude);
    const lon2 = toRadians(coord2.longitude);

    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;

    const a =
        Math.sin(dlat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c *1000; // Distance in meters

    return distance;
    } function toRadians(degrees) {
              return degrees * (Math.PI / 180);
}


speaker.pause()
ambientSound.pause()


//TO BE USED ONLY IN INDEX
function updateContent() {
    distIndicator.style.display = "flex";

    // If poisWithDistances is empty, initialize it
    if (poisWithDistances.length === 0) {
        poisWithDistances = pois.features.map((feature, i) => ({
            feature: feature,
            distance: calculateDistance(currentCoord, feature.geometry.coordinates)
        }));

        poisWithDistances.sort((a, b) => a.distance - b.distance);
    } else{
        poisWithDistances = poisWithDistances.features.map((feature, i) => ({
            feature: feature,
            distance: calculateDistance(currentCoord, feature.geometry.coordinates)
        }));

        poisWithDistances.sort((a, b) => a.distance - b.distance);
    }

    console.log(poisWithDistances);

    function playElement() {
        soundIsPlaying = 1;
        distIndicator.style.display = "none";
        console.log(poisWithDistances[0].feature.properties.audioUrl);

        speaker.src = poisWithDistances[0].feature.properties.audioUrl;
        speaker.play();
        ambientSound.pause();

        taleDescription.innerHTML = poisWithDistances[0].feature.properties.description;

        speaker.onended = function () {

            interface.style.display= "flex"
            taleDescription.style.display = "none"

            let again= document.getElementById("again")
            let next= document.getElementById("next")


            again.addEventListener("click", ()=>{

                interface.style.display= "none"

                taleDescription.style.display = "flex"
                speaker.play()
            })

            next.addEventListener("click", ()=>{

                interface.style.display= "none"
                taleDescription.style.display="none"

                poisWithDistances.shift(); // Remove played element
                console.log(poisWithDistances);
                soundIsPlaying = 0;
            })



        };
    }

    if (poisWithDistances.length > 0 && poisWithDistances[0].distance < 10) {
        playElement();
    } else if (poisWithDistances.length > 0 && poisWithDistances[0].distance < 70) {
        console.log("AmbientSound MUST BE PLAYED");

        absDistance = Math.floor(poisWithDistances[0].distance);
        var myVolume = absDistance / 70;
        ambientSound.volume = 1 - myVolume;

        distIndicator.style.display = "flex";
        distIndicator.innerHTML = "Ti trovi a: " + absDistance + " metri<br> dal prossimo racconto";

        ambientSound.play();
    } else {
        ambientSound.pause();
    }

    console.log("UPDATE CONTENT WAS EXECUTED");
}

function toBeRepeated(){
    if(soundIsPlaying==0){
        getGPSPosition().then(()=>{updateContent()  })

    }

}
getData()






  
  
