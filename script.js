let distances =[]
let playedSounds =[]
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
var plat = 0
var plon=0
const camera = document.querySelector("[gps-new-camera]");
let pois= null
var showMessage = 0


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
    
    taleDescription.innerHTML=feature.properties.description

    soundIsPlaying =1
    speaker.setAttribute('gps-new-entity-place',{
        latitude:lat, longitude:lon
    })

    speaker.setAttribute("sound",{
        src:feature.properties.audioSrc
    })
    console.log(feature.properties.audioSrc)

    speaker.setAttribute("sound", "src", feature.properties.audioSrc);
    speaker.setAttribute("sound", "volume", 5);

    ambientSound.components.sound.pauseSound();

    //playedSounds.push(feature.properties.index)
    //console.log(playedSounds)

    speaker.addEventListener("sound-ended",()=>{

        taleDescription.innerHTML=" "

        var indexToRemove = feature.properties.index

        interface.style.display ="flex"

        distIndicator.style.display = "none"

        let again= document.getElementById("again")
        let next= document.getElementById("next")
        let close= document.getElementById("close")

        next.addEventListener("click", ()=>{

            pois.features = pois.features.filter(feature => feature.properties.index !== indexToRemove)
            console.log(pois.features)
            soundIsPlaying=0
            ambientSound.components.sound.playSound();

            ambientSound.setAttribute("sound", "volume", 0);
            
            distances = distances.filter((_, index) => index !== indexToRemove)
            minDistance = 100000000


            interface.style.display ="none"
            

        } )

        close.addEventListener("click", ()=>{            
            pois.features = pois.features.filter(feature => feature.properties.index !== indexToRemove)
            console.log(pois.features)
            soundIsPlaying=0
            ambientSound.components.sound.playSound();

            ambientSound.setAttribute("sound", "volume", 0);
            
            distances = distances.filter((_, index) => index !== indexToRemove)
            minDistance = 100000000


            interface.style.display ="none"

        }
        )

        again.addEventListener("click", ()=>{

            taleDescription.innerHTML=feature.properties.description

            speaker.setAttribute("sound", "src", feature.properties.audioSrc);
            speaker.components.sound.playSound();
            interface.style.display ="none"
        } )

    })

}


//TO BE USED ONLY IN INDEX
function updateContent(){
    
        // alert("GPS UPDATE POSITION WAS TRIGGERED")
    distIndicator.style.display ="flex"

    //console.log("UPDATE CONTENT WAS STARTED")
    //console.log(currentCoord)


    for(var i=0;i < pois.features.length;i++){
         
        distance = calculateDistance(currentCoord, pois.features[i].geometry.coordinates)
        distances[i] = distance

        if(distance<10){
            console.log(pois.features[i].properties.name, "MUST BE PLAYED")

            //ambientSound.setAttribute("sound", "src", "url("+pois.features[i].properties.audioSrc+")");
            playElement(pois.features[i])
        }
    }


    console.log(distances)

    minDistance = Math.min(... distances)
    console.log(minDistance+1000)

    
    var absDistance = Math.floor(minDistance)
    if(soundIsPlaying==0){
        distIndicator.innerHTML="Ti trovi a: "+absDistance+" metri<br> dal prossimo racconto"
    }

    if(absDistance<71 && absDistance>10){
        
        if(showSongMessage==0){
            songIndicator.style.display ="flex"
            showSongMessage = 1

            dismiss.addEventListener("click", ()=>{
                songIndicator.style.display ="none"
            })
        }

        console.log(lat,lon)
        ambientSound.setAttribute('gps-new-entity-place',{
            latitude:lat, longitude:lon
        })

        var myVolume= absDistance/70

        //console.log("oldVolume", ambientSound.components.sound.data.volume)
        //console.log("myVolume:", myVolume)
        //ambientSound.components.sound.data.volume = 1-myVolume
        //ambientSound.components.sound.data.volume = 1

        ambientSound.components.sound.playSound();
        ambientSound.setAttribute("sound", "volume", 1-myVolume);

        console.log("new volume level:",ambientSound.components.sound.data)
    } else{
        ambientSound.components.sound.pauseSound();
        showSongMessage = 0
    }

    

    console.log("UPDATE CONTENT WAS EXECUTED")

    

}

function toBeRepeated(){
    if(soundIsPlaying==0){
        getGPSPosition().then(()=>{updateContent()  })

    }

}
getData()






  
  
