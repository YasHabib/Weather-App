import { getWeather } from "./public/weather"
import "./style.css"


getWeather(10,10, Intl.DateTimeFormat().resolvedOptions().timeZone).then(
    res => {

        console.log(res.data)
    })