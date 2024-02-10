import { LightningElement } from 'lwc';
import{countryCodeList} from'c/countryCodeList'
import currencyConverterAssets from '@salesforce/resourceUrl/currencyConverterAssets'
export default class CurrencyConverterApp extends LightningElement 
{
    currencyImage = currencyConverterAssets +'/currencyConverterAssets/currency.svg'
    countryList = countryCodeList
    countryFrom = "USD"
    countryTo = "AUD"  
    amount=''
    result=''
    handleChange(event)
        {
        const {name, value} = event.target
        console.log("name", name)
        console.log("value", value)
        this[name] = value
        console.log( this[name])
        }
    submitHandler(event)
        { 
            event.preventDefault()
            this.convert()

        }
    async convert(){
     const API_KEY='c1a86687ba60f88ea728bbd1'
     const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${this.countryFrom}/${this.countryTo}`        
         try{
            const data= await fetch(API_URL)
            const jsonData = await data.json()
            console.log(jsonData)
            this.result=(Number(this.amount)*jsonData.conversion_rate).toFixed(2)
            console.log(this.result)
           }
         catch(error){
                console.log(error)
                this.error="An error occurred. Please try again..."
            }
            

    }
}
