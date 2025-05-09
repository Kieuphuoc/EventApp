const BASE_URL = "https://881a-14-169-26-201.ngrok-free.app/";
import axios from "axios";

export const endpoints = {
   'event': '/event/',
   'category': '/category/',
   'review': (event_id) => `/event/${event_id}/reviews/`,
   'stats_rating' : (event_id) => `/event/${event_id}/reviews/stats/`,
   'eventDetail': (id) => `/event/${id}/`,
   'register': '/user/',
   'login': '/o/token/',
   'current-user':'/user/me/',
   'favoriteEvent':'/favorite/event/',
   'invoice' : '/invoice/',
   'my-discount' : '/discount/my_discount/',
}

export const authApis = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}


export default axios.create({
    baseURL: BASE_URL
})