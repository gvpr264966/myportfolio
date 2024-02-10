import { LightningElement } from 'lwc';
import weatherAppIcons from '@salesforce/resourceUrl/weatherAppIcons'
import getWeatherDetails from '@salesforce/apex/weatherAppController.getWeatherDetails'

const API_KEY ='92662ae36696c074e8af4eb33a40c1f1'
export default class WeatherApp extends LightningElement {
 clearIcon = weatherAppIcons+'/weatherAppIcons/clear.svg'
  cloudIcon = weatherAppIcons+'/weatherAppIcons/cloud.svg'
  dropletIcon = weatherAppIcons+'/weatherAppIcons/droplet.svg'
  hazeIcon = weatherAppIcons+'/weatherAppIcons/haze.svg'
  mapIcon = weatherAppIcons+'/weatherAppIcons/map.svg'
  rainIcon = weatherAppIcons+'/weatherAppIcons/rain.svg'
  snowIcon = weatherAppIcons+'/weatherAppIcons/snow.svg'
  stormIcon = weatherAppIcons+'/weatherAppIcons/storm.svg'
  thermometerIcon = weatherAppIcons+'/weatherAppIcons/thermometer.svg'
  arrowBackIcon = weatherAppIcons+'/weatherAppIcons/arrow-back.svg'
    cityName = ''
    loadingText = ''
    isError = false
    response
    weatherIcon
  
    get loadingClasses(){
      return this.isError ? 'error-msg':'success-msg'
    }
    searchHandler(event){
      this.cityName = event.target.value
    }
  
    submitHandler(event){
      event.preventDefault()
      this.fetchData()
    }
  
    fetchData(){
      this.isError = false
      this.loadingText = 'Fetching weather details...'
      console.log("cityName", this.cityName)
     getWeatherDetails({input:this.cityName}).then(result=>{
        this.weatherDetails(JSON.parse(result))
      }).catch((error)=>{
        console.error(error)
        this.response = null
        this.loadingText = "Something went wrong"
        this.isError = true
      })
    }
  
    weatherDetails(info){
      if(info.cod === "404"){
        this.isError = true 
        this.loadingText = `${this.cityName} isn't a valid city name`
      }
       else {
        this.loadingText = ''
        this.isError = false
        const city = info.name
        const country = info.sys.country
        const {description, id} = info.weather[0]
        const {temp, feels_like, humidity} = info.main
        if(id === 800){
            this.weatherIcon = this.clearIcon
          } else if((id>=200 && id <=232) || (id>=600 && id <=622)){
            this.weatherIcon = this.stormIcon
          } else if(id>=701 && id <=781){
            this.weatherIcon = this.hazeIcon
          } else if(id>=801 && id <=804){
            this.weatherIcon = this.cloudIcon
          } else if((id>=500 && id <=531) || (id>=300 && id<= 321)){
            this.weatherIcon = this.rainIcon
          } else {}
            this.response = {
                city: city,
                temperature:Math.floor(temp),
                description:description,
                location:`${city}, ${country}`,
                feels_like:Math.floor(feels_like),
                humidity:`${humidity}%`
              }

      }
    }
    backHandler(){
        this.response=null
        this.isError = false 
        this.weatherIcon = ''
       this.cityName=''
       this.loadingText = ''
     }
}

