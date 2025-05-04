const BASE_URL = "https://82a2-2405-4802-6452-28e0-6c90-5144-fd0b-52d9.ngrok-free.app/";
import axios from "axios";

export const endpoints = {
   'event': '/event/',
   'category': '/category/',
   'review': (event_id) => `/event/${event_id}/reviews/`,
   'stats_rating' : (event_id) => `/event/${event_id}/reviews/stats/`,
   'eventDetail': (id) => `/event/${id}/`
}

export default axios.create({
    baseURL: BASE_URL
})