// app.js created by OON CHEE YEE
// XiMnet Malaysia Interview Project Tryout
// Based on Vanilla JavaScript **
// last updated: 1/12/2020

//--------------------------------------------------------------------------------------------//
// Declaration and initialisation of api keys variable to access and store weather conditions
//-------------------------------------------------------------------------------------------//
let api={
    key: "5e34ecbdf07e9639daa204998e8deb07",
    base:"https://api.openweathermap.org/data/2.5/",
    units:'metric'
    }
let searchmethod='q'
let weather = {}

var searchbox=document.getElementById('userInputtxt'); // getting user's input from searchbox
searchbox.addEventListener('keypress', setQuery); // execute after detecting "ENTER or "Submit" key

function setQuery(evt) {
    if (evt.keyCode == 13) { // keyCode for "Enter" or "Submit" key
      getResults(searchbox.value);//** METHOD 1 Execute function to determine weather of search input 
    }
}

weather.temperature = {
    unit : "celsius" // may differ based on metric or imperial declared above
}

// Check if browser allow to use GEOLOCATION
function checkLocation(){
    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(definePosition, showError);
    }else{
        notificationElement.style.display = "block";
        notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
    }
}

// Loacting User's position
function definePosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getLocation(latitude, longitude);
}

// Acquiring user's location from api
function getLocation(latitude, longitude){
    let link = `${api.base}weather?lat=${latitude}&lon=${longitude}&appid=${api.key}`;
    
    fetch(link)
        .then(function(response){ // using promise API to convert response into json format
            let data = response.json();
            return data;   
        })
        .then(function(data){
            weather.city = data.name; // inserting json data into weather object notation
            weather.country = data.sys.country;
            let searchbox=document.querySelector('.search-box');
            searchbox.value= `${weather.city}, ${weather.country}`; // Displaying user's current location on search bar
            getResults(searchbox.value); //** METHOD 2 Directly search for the user's current location 
        }) 
}

// Display error when Geolocation service unable to execute
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//--------------------------------------------------------------------------------------------//
// Declaration and initialisation of api keys variable to access and store weather conditions
//-------------------------------------------------------------------------------------------//
function getResults(query){
    fetch(`${api.base}weather?${searchmethod}=${query}&units=${api.units}&APPID=${api.key}`)
    .then(function(response){
        let data = response.json();
        return data;
    }) // list of functions to be executed step by step 
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
    console.log(jsonResult) // check point
    if (jsonResult.hasOwnProperty('message')){
        alert("Cannot find location! Retry by typing in format of 'city','country code'. e.g., 'Melbourne, AU'")
        } // using the fact that invalid location error has key value pairs of 'message', display error to assist
          // user to retype the location

 // inserting json data into weather object notation class, accessible for other functions
    weather.temperature.value = Math.round(jsonResult.main.temp);
    weather.condition = jsonResult.weather[0].description;
    weather.iconId = jsonResult.weather[0].icon;
    weather.city = jsonResult.name;
    weather.country = jsonResult.sys.country;
    weather.background = jsonResult.weather[0].main;
    weather.currentTime= jsonResult.dt;
    weather.currentTimeZone=jsonResult.timezone;
}

// switching background images based on weather condition and Day/Night
// Total of 14 different background images available
function switchBackground (){
    switch(weather.background){
        case 'Clear':
            if (weather.iconId.includes("n")){
                document.body.style.backgroundImage = 'url("background/clear-night.jpg")'
               }
               else{
                document.body.style.backgroundImage = 'url("background/clear.jpg")';
               }
               adjustMain();
            break;
        case 'Clouds':
            if (weather.iconId.includes("n")){
                document.body.style.backgroundImage = 'url("background/cloudy-night.jpg")'
               }
               else{
                document.body.style.backgroundImage = "url('background/cloudy.jpg')";
               }
            adjustMain();
            break;
        case 'Rain': // categorizing Rain and Drizzle to same backgroundImage
        case 'Drizzle':
            if (weather.iconId.includes("n")){
                document.body.style.backgroundImage = 'url("background/rain-night.jpg")'
               }
               else{
                document.body.style.backgroundImage = 'url("background/rain.jpg")';
               }
            adjustMain();
            break;
        case 'Mist': 
        case 'Smoke':  
        case 'Haze':  
        case 'Fog':  
        case 'Dustt':  
        case 'Sand':  
        case 'Ash':  
            if (weather.iconId.includes("n")){
                document.body.style.backgroundImage = 'url("background/mist-night.jpg")'
               }
               else{
                document.body.style.backgroundImage = 'url("background/mist.jpg")';
               }
            adjustMain();
            break;
        case 'Snow':
            if (weather.iconId.includes("n")){
                document.body.style.backgroundImage = 'url("background/snow-night.jpg")'
               }
               else{
                document.body.style.backgroundImage = 'url("background/snow.jpg")';
               }
            adjustMain();
            break;
        case 'Thunderstorm':
            if (weather.iconId.includes("n")){
                document.body.style.backgroundImage = 'url("background/storm-night.jpg")'
               }
               else{
                document.body.style.backgroundImage = 'url("background/storm.jpg")';
               }
            adjustMain();
            break;
        case 'Squall':  
        case 'Tornado':
                document.body.style.backgroundImage = 'url("background/tornado.jpg")';
            adjustMain();
            break;        
        default:
            break;
    }
}

// Relocate the temperature description bounding box
function adjustMain() {
    let main_border=document.getElementById('TempDescrip');
    let main_border_height=main_border.clientHeight;
    let main_border_width=main_border.clientWidth;
 
    main_border.style.left= "calc(50% - " + (main_border_width/2).toString() + "px)";  
    main_border.style.top= "calc(50% - " + (main_border_height/1.3).toString() + "px)"
    main_border.style.visibility="visible"; 
}

// Accessing HTML id and classes to provide update based on weather   
const iconElement = document.querySelector(".weather-icon");
//const city = document.getElementById('city'); // not needed, since city name is used to relace text on search bar
const date=document.getElementById('date');
const time=document.getElementById('time');
const temp=document.getElementById('temp');
const weather_el=document.getElementById('condition');

// Finalising by assigning respective output to html elements
function displayResults (){
    console.log(weather) // check point
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`; // able to change weather icon based on weather obtained
    temp.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather_el.innerHTML = weather.condition[0].toUpperCase() +  weather.condition.slice(1); // Changing first letter to uppercase
    //city.innerHTML = `${weather.city}, ${weather.country}`; // not needed for now
    time.innerHTML = timeBuilder()
    searchbox.value=`${weather.city}, ${weather.country}`; // replace searchbox text with correct location
}

// Updating local time of the searched location (including date and time)
function timeBuilder (){
    var initial= new Date((weather.currentTime*1000)); // converting to milliseconds, JS requirement
    var new_initial=initial.setHours(initial.getHours() - 8) // setting back the time to GMT +0 Hours
    var milliseconds2=weather.currentTimeZone*1000; // converting to milliseconds, JS requirement
    //* timezone referring to time shift of searched lcoation
    var totalseconds=new_initial+milliseconds2;
    var time_current = new Date(totalseconds);// converting total seconds shift from 1970 javascript default date
    
    // Hours part from the timestamp
    var hours = time_current.getHours();
    var temp = hours.toString();
        if (temp.length<2){
            hours="0"+ hours.toString()
        }  // top up to two digits, if for example: 01:00, need to add the zero in front, single digit numbers

    // Minutes part from the timestamp
    var minutes =time_current.getMinutes();
    var temp = minutes.toString();
        if (temp.length<2){
            minutes="0"+ minutes.toString()
        } // top up to two digits, if for example: 11:01, need to add the zero in front, single digit numbers

    var seconds =time_current.getSeconds();
    var temp = seconds.toString();
        if (temp.length<2){
            seconds="0"+ seconds.toString()
        } // top up to two digits, if for example: 11:11:01, need to add the zero in front, single digit numbers

    // To allow date and time on same line
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"];
    let day = days[time_current.getDay()];
    let date= time_current.getDate()
    let month = months[time_current.getMonth()];
    let year=time_current.getFullYear();

    // Will display time in e.g. Tues, December 1 , 2020, 18:20:44
    return `${day}, ${month} ${date} , ${year}` +', '  + hours + ':' + minutes + ':'+ seconds
    }
