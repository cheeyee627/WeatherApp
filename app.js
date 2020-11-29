let api={
    key: "5e34ecbdf07e9639daa204998e8deb07",
    base:"https://api.openweathermap.org/data/2.5/",
    units:'metric'
}
let searchmethod='q'


const weather = {}
const searchbox=document.getElementById('userInputtxt');

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
        })
        
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

function execute(){
    if(searchbox.value)
        getResults(searchbox.value);
}

function getResults(query){
    fetch(`${api.base}weather?${searchmethod}=${query}&units=${api.units}&APPID=${api.key}`)
    .then(function(response){
        let data = response.json();
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
    });
}

function extractResults(jsonResult){
    console.log(jsonResult)
    weather.temperature.value = Math.round(jsonResult.main.temp);
    weather.condition = jsonResult.weather[0].description;
    weather.iconId = jsonResult.weather[0].icon;
    weather.city = jsonResult.name;
    weather.country = jsonResult.sys.country;
    weather.background = jsonResult.weather[0].main
    weather.currentTime=jsonResult.dt
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
    let main_border=document.getElementById('mainBox');
    let main_border_height=main_border.clientHeight;
    let main_border_width=main_border.clientWidth;

    main_border.style.left= `calc(50%-${main_border_width/2}px)`;
    main_border.style.top= `calc(50%-${main_border_height/1.3}px)`;
    main_border.style.visibility= 'visible';
}
   
const iconElement = document.querySelector(".weather-icon");
const city = document.getElementById('city');
const date=document.getElementById('date');
const time=document.getElementById('time');
const temp=document.getElementById('temp');
const weather_el=document.getElementById('condition');

function displayResults (){
    console.log(weather)
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    temp.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather_el.innerHTML = weather.condition;
    city.innerHTML = `${weather.city}, ${weather.country}`;
    let now=new Date()
    date.innerHTML = dateBuilder(now)
    time.innerHTML = 'Current Time: '+ timeBuilder(now)
    adjustMain();
}

function dateBuilder (d){
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    let day = days[d.getDay()];
    let date= d.getDate()
    let month = months[d.getMonth()];
    let year=d.getFullYear();

    return `${day} ${date} ${month} ${year}` ;
    }

function timeBuilder (now){
    // Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
var time_current = new Date(weather.currentTime*1000);
console.log(time_current)
// Hours part from the timestamp
var hours = time_current.getHours();
// Minutes part from the timestamp
var minutes = "0" + time_current.getMinutes();
// Seconds part from the timestamp
var seconds = "0" + time_current.getSeconds();

// Will display time in 10:30:23 format
return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    mins_input=now.getMinutes
    if (mins_input.length<2)
        mins_input="0"+ now.getMinutes
        else mins_input=now.getminutes

    return now.getHours() + ":" + now.getMinutes() ;
    
}
