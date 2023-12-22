import axios from 'axios';
const apiKey = '7e4c7bde0a654dc6aa682932232112';

const forecastEndpoint = params=>`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.city}&days=${params.days}&aqi=no&alerts=no`;
const locationsEndpoint = params=>`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.city}`;


//axios package is used to make api calls to the weather api and return the data
const apiCall = async (endpoint)=>{
  const options = {
      method: 'GET',
      url: endpoint,
  };

    try{
      const response = await axios.request(options);
      return response.data;
    }catch(error){
      console.log('error: ',error);
      return {};
  }
}

export const fetchWeatherForecast = params=>{
  let forecastUrl = forecastEndpoint(params);
  return apiCall(forecastUrl);
}

export const fetchLocations = params=>{
  let locationsUrl = locationsEndpoint(params);
  return apiCall(locationsUrl);
}
