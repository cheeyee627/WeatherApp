let api={
    key: "5e34ecbdf07e9639daa204998e8deb07",
    base:"https://api.openweathermap.org/data/2.5/",
    units:'metric'
}
let searchmethod='q'
adjustMain();

const weather = {}
const searchbox=document.getElementById('userInputtxt');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
    if (evt.keyCode == 13) {
      getResults(searchbox.value);
    }
}

//searchbox.addEventListener('keypress',setQuery);

// CHECK IF BROWSER SUPPORTS GEOLOCATION



weather.temperature = {
    unit : "celsius"
}

function checkLocation(){
    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(definePosition, showError);
    }else{
        notificationElement.style.display = "block";
        notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
    }
}


// SET USER'S POSITION
function definePosition(position){
    
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getLocation(latitude, longitude);
}

function getLocation(latitude, longitude){
    let link = `${api.base}weather?lat=${latitude}&lon=${longitude}&appid=${api.key}`;
    
    fetch(link)
        .then(function(response){
            let data = response.json();
            return data;
            
        })
        .then(function(data){
            weather.city = data.name;
            weather.country = data.sys.country;
            let searchbox=document.querySelector('.search-box');
            searchbox.value= `${weather.city}, ${weather.country}`;
            getResults(searchbox.value);
        }) 
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}



function getResults(query){
    fetch(`${api.base}weather?${searchmethod}=${query}&units=${api.units}&APPID=${api.key}`)
    .then(function(response){
        let data = response.json();
        console.log(data)
        return data;
    })
    .then(data => {
        extractResults(data);
    })
    .then(function(){
        switchBackground();
    })
    .then(function(){
        displayResults();
    })
}
    

function extractResults(jsonResult){
    console.log(jsonResult)
    if (jsonResult.hasOwnProperty('message')){
        alert("Cannot find location! Retry by typing in the format of 'city','country code'. e.g. Melbourne, AU")
    }
    weather.temperature.value = Math.round(jsonResult.main.temp);
    weather.condition = jsonResult.weather[0].description;
    weather.iconId = jsonResult.weather[0].icon;
    weather.city = jsonResult.name;
    weather.country = jsonResult.sys.country;
    weather.background = jsonResult.weather[0].main
    weather.currentTime=jsonResult.dt
    weather.currentTimeZone=jsonResult.timezone
}

function switchBackground (){
    switch(weather.background){
        case 'Clear':
            document.body.style.backgroundImage = 'url("background/clear.jpg")';
            break;
        case 'Clouds':
            document.body.style.backgroundImage = "url('background/cloudy.jpg')";
            break;
        case 'Rain':
        case 'Drizzle':
        case 'Mist':
        document.body.style.backgroundImage = 'url("background/rain.jpg")';
            break;
        case 'Snow':
            document.body.style.backgroundImage = 'url("background/snow.jpg")';
            break;
        case 'Thunderstorm':
        document.body.style.backgroundImage = 'url("background/storm.jpg")';
            break;   
        default:
            break;
            
    }

}
function adjustMain() {
    let main_border=document.getElementById('TempDescrip');
    let main_border_height=main_border.clientHeight;
    let main_border_width=main_border.clientWidth;
 
    main_border.style.left= "calc(50% - " + (main_border_width/2).toString() + "px)";  
    main_border.style.top= "calc(50% - " + (main_border_height/1.3).toString() + "px)"
    main_border.style.visibility="visible";
    
}
   
const iconElement = document.querySelector(".weather-icon");
//const city = document.getElementById('city');
const date=document.getElementById('date');
const time=document.getElementById('time');
const temp=document.getElementById('temp');
const weather_el=document.getElementById('condition');

function displayResults (){
    console.log(weather)
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    temp.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather_el.innerHTML = weather.condition[0].toUpperCase() +  weather.condition.slice(1);
    //weather_el.innerHTML = weather.condition;
    //city.innerHTML = `${weather.city}, ${weather.country}`;
    time.innerHTML = timeBuilder()
    searchbox.value=`${weather.city}, ${weather.country}`;
}


function timeBuilder (){
    
    var initial= new Date((weather.currentTime*1000));
    var new_initial=initial.setHours(initial.getHours() - 8)

    const milliseconds2=weather.currentTimeZone*1000;
    const totalseconds=new_initial+milliseconds2;

    var time_current = new Date(totalseconds);
    
// Hours part from the timestamp
var hours = time_current.getHours();
var temp = hours.toString();
    if (temp.length<2){
        hours="0"+ hours.toString()
    }  
// Minutes part from the timestamp
var minutes =time_current.getMinutes();
var temp = minutes.toString();
    if (temp.length<2){
        minutes="0"+ minutes.toString()
    }

var seconds =time_current.getSeconds();
var temp = seconds.toString();
    if (temp.length<2){
        seconds="0"+ seconds.toString()
    }
// Will display time in 10:30:23 format
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    let day = days[time_current.getDay()];
    let date= time_current.getDate()
    let month = months[time_current.getMonth()];
    let year=time_current.getFullYear();
return `${day}, ${date} ${month} ${year}` +', '  + hours + ':' + minutes + ':'+ seconds

}