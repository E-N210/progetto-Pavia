let distances =[]
let playedSounds =[]
var soundIsPlaying = 0
var showSongMessage = 0

let distIndicator = document.getElementById("distanceIndicator")
let taleDescription = document.getElementById("taleDescription")

taleDescription.style.display="none"

let songIndicator = document.getElementById("songIndicator")
let dismiss = document.getElementById("dismiss")
    if(songIndicator!==null){songIndicator.style.display ="none"}

let ambientSound = document.getElementById("ambientSound")
let speaker = document.getElementById("speaker")

let accuracyIndicator = document.getElementById("accuracyIndicator")


let interface = document.getElementById("interface")
    if(interface!==null){interface.style.display ="none"}


let again= document.getElementById("again")
let next= document.getElementById("next")

let mute = document.getElementById("mute")
let unmute = document.getElementById("unMute")

var isMute=0
var myVolume=0

let spinner = document.getElementById("spinner")

var currentCoord={"latitude":0,"longitude":0}
let minDistance = 0
var lat=0
var lon=0
var plat = 0
var plon=0
const camera = document.querySelector("[gps-new-camera]");
let pois= null
var showMessage = 0

speaker.pause()
ambientSound.pause()

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

                console.log(currentCoord)

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


// TO BE USED IN updateContent() when element has to be rendered
function playElement(feature){
    songIndicator.style.display ="none"
    distIndicator.style.display = "none"
    spinner.style.display="none"

    taleDescription.style.display="flex"

    
    taleDescription.innerHTML=feature.properties.description

    soundIsPlaying =1


    speaker.src= feature.properties.audioUrl
    speaker.play()

    ambientSound.pause();

    //playedSounds.push(feature.properties.index)
    //console.log(playedSounds)

    speaker.onended = function(){

        taleDescription.innerHTML=" "

        var indexToRemove = feature.properties.index

        interface.style.display ="flex"

        distIndicator.style.display = "none"

        taleDescription.style.display="none"


        next.addEventListener("click", ()=>{

            taleDescription.style.display="none"

            pois.features = pois.features.filter(feature => feature.properties.index !== indexToRemove)
            
            console.log(pois.features)
            soundIsPlaying=0
            
            distances = distances.filter((_, index) => index !== indexToRemove)
            minDistance = 100000000

            showSongMessage=0


            interface.style.display ="none"

            spinner.style.display="block"
            

        } )


        again.addEventListener("click", ()=>{


            taleDescription.style.display="flex"

            taleDescription.innerHTML=feature.properties.description

            speaker.play();
            interface.style.display ="none"
        } )

    }

}


//TO BE USED ONLY IN INDEX
function updateContent(){
    
    distIndicator.style.display ="flex"


    for(var i=0;i < pois.features.length;i++){
         
        distance = calculateDistance(currentCoord, pois.features[i].geometry.coordinates)
        distances[i] = distance

        if(distance<20){
            console.log(pois.features[i].properties.name, "MUST BE PLAYED")

            playElement(pois.features[i])
        }
    }


    console.log(distances)

    minDistance = Math.min(... distances)
    
    var absDistance = Math.floor(minDistance)
    var distanceToBeDisplayed = absDistance-20

    
    if(soundIsPlaying==0){
        distIndicator.innerHTML="distanza dal prossimo racconto:<br> "+distanceToBeDisplayed+" metri"

        
        if(absDistance<101){
        
            if(showSongMessage==0){
                songIndicator.style.display ="flex"

                spinner.style.display="none"
                showSongMessage = 1

                dismiss.addEventListener("click", ()=>{
                songIndicator.style.display ="none"

                spinner.style.display="block"
                })
            }

            console.log(lat,lon)
          

            ambientSound.play();
            if(absDistance<30 && isMute==0){
                myVolume=1
                ambientSound.volume = myVolume
            }
            else if(absDistance<40 && isMute==0){
                myVolume= 0.8;
                ambientSound.volume = myVolume
            }
            else if(absDistance<50 && isMute==0){
                myVolume= 0.6;
                ambientSound.volume = myVolume
            }

            else if(absDistance<60 && isMute==0){
                myVolume= 0.4;
                ambientSound.volume = myVolume
            }

            else if(absDistance<70 && isMute==0){
                myVolume= 0.2;
                ambientSound.volume = myVolume
            }

            else if(absDistance<80 && isMute==0){
                myVolume= 0.1;
                ambientSound.volume = myVolume
            }

            else if(absDistance<90 && isMute==0){
                myVolume= 0.05;
                ambientSound.volume = myVolume
            }

            ambientSound.play();
            console.log(ambientSound.volume)

            //console.log("new volume level:",ambientSound.components.sound.data)
        }  else{
            ambientSound.pause();
            showSongMessage = 0
        }
    }
}

    console.log("UPDATE CONTENT WAS EXECUTED")    

mute.addEventListener("click", ()=>{
    speaker.volume=0
    ambientSound.volume=0
    unmute.style.display="flex"
    mute.style.display="none"

    isMute=1
})

unmute.addEventListener("click", ()=>{
    speaker.volume=1
    ambientSound.volume=myVolume
    unmute.style.display="none"
    mute.style.display="flex"

    console.log(myVolume)

    isMute=0
})

function toBeRepeated(){
    if(soundIsPlaying==0){
        getGPSPosition().then(()=>{updateContent()  })

    }

}
getData()






  
  
