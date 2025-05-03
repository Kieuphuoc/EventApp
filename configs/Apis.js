const BASE_URL = "https://5b93-2405-4802-6451-4ec0-8156-de08-9259-a29e.ngrok-free.app/";
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