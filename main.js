import { ICON_MAP } from "./iconMap"
import { getWeather } from "./weather"
import "./style.css"
navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

function positionSuccess({coords}){
    getWeather(coords.latitude, coords.longitude,Intl.DateTimeFormat().resolvedOptions().timeZone)
        .then(renderWeather)
        .catch(e =>{
            console.error(e)
            alert("Error getting weather info.")
    })
}

function positionError(){
    alert("Unable to retrieve your location, please try again by allowing us to use your location and refresh the page")
}


//Code for testing purpose within developer console in Chrome
// getWeather(10,10, Intl.DateTimeFormat().resolvedOptions().timeZone).then(
//     data => {
//         console.log(data)
//     })


getWeather(10,10, Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderWeather)
.catch(e => {
    console.error(e)
    alert("Error getting weather data.")
})

function renderWeather({current, daily, hourly}){
    renderCurrentWeather(current)
    renderDailyWeather(daily)
    renderHourlyWeather(hourly)
}

function getIconUrl(iconCode){
    return `icons/${ICON_MAP.get(iconCode)}.svg`
}

function setValue(selector, value, {parent = document} = {}){
    parent.querySelector(`[data-${selector}]`).textContent = value
}

//rendering current (header section)
const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current){
    //document.querySelector("[data-current-temp]").textContent = current.currentTemp
    currentIcon.src = getIconUrl(current.iconCode)
    setValue("current-temp",current.currentTemp)
    setValue("current-high",current.highTemp)
    setValue("current-low",current.lowTemp)
    setValue("current-fl-high",current.highFeelsLike)
    setValue("current-fl-low",current.lowFeelsLike)
    setValue("current-wind",current.windSpeed)
    setValue("current-precip",current.precip)
}

//rendering daily section
const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, {weekday: "long"})
const dailySection =  document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily){
    dailySection.innerHTML = ""
    daily.forEach(day => {
        const element = dayCardTemplate.content.cloneNode(true)
        setValue("temp",day.maxTemp,{parent: element})
        setValue("date",DAY_FORMATTER.format(day.timestamp), {parent: element})
        element.querySelector("[data-icon").src = getIconUrl(day.iconCode)
        dailySection.append(element)
    });
}

//rendering hourly section
const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, {hour: "numeric"})
const hourlySection =  document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")
function renderHourlyWeather(hourly){
    hourlySection.innerHTML = ""
    hourly.forEach(hour => {
        const element = hourRowTemplate.content.cloneNode(true)
        setValue("temp", hour.temp, { parent: element })
        setValue("fltemp", hour.feelsLike, { parent: element })
        setValue("wind", hour.windSpeed, { parent: element })
        setValue("precip", hour.precip, { parent: element })
        setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element })
        setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element })
        element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
        hourlySection.append(element)
    });
}