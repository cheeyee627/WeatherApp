const api={
    key: "5e34ecbdf07e9639daa204998e8deb07",
    base:"https://api.openweathermap.org/data/2.5/"
}

const searchbox=document.querySelector('.search-box');
//searchbox.addEventListener('keypress',setQuery);

// CHECK IF BROWSER SUPPORTS GEOLOCATION

const weather = {}
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

function setQuery(evt){
        getResults(searchbox.value);
        //con
}

function getResults(query){
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather=>{
        return weather.json()
    }).then(displayResults);
}

function displayResults (weather){
    console.log(weather);
    let city = document.querySelector('.location .city');
    city.innerText= `${weather.name}, ${weather.sys.country}`;

    let now=new Date()
    let date=document.querySelector('.location .date');
    date.innerText = dateBuilder(now)

    let temp=document.querySelector('.current .temp');
    temp.innerText=`${Math.round(weather.main.temp)}° C`;

    let weather_el=document.querySelector('.current .condition');
    weather_el.innerText =weather.weather[0].main;
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