const BASE_URL = "https://1c64-14-169-26-201.ngrok-free.app/";
import axios from "axios";

export const endpoints = {
   'event': '/event/',
   'category': '/category/',
   'review': (event_id) => `/event/${event_id}/reviews/`,
   'stats_rating' : (event_id) => `/event/${event_id}/reviews/stats/`,
   'eventDetail': (id) => `/event/${id}/`,
   'register': '/user/',
   'token': '/o/token/',
   'userMe': '/user/me/',    
}

export default axios.create({
    baseURL: BASE_URL
})