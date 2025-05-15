const BASE_URL = "https://7fd7-14-241-246-227.ngrok-free.app/";
import axios from "axios";

export const endpoints = {
    'event': '/event/',
    'category': '/category/',
    'review': (event_id) => `/event/${event_id}/reviews/`,
    'create-review': (event_id) => `/event/${event_id}/reviews/create/`,
    'stats_rating': (event_id) => `/event/${event_id}/reviews/stats/`,
    'eventDetail': (id) => `/event/${id}/`,
    'register': '/user/',
    'login': '/o/token/',
    'current-user': '/user/me/',
    'favoriteEvent': '/favorite/event/',
    'invoice': '/invoice/',
    'my-discount': '/discount/my_discount/',
    'my-ticket': '/ticket/my_ticket/',
    'my-event': '/event/my_event/',
    'dashboard': '/reports/organizer/dashboard/',
    'delete-event' : (event_id) => `/event/${event_id}/delete_event/`,
    'momo-payment' : (event_id) => `/invoice/${event_id}/momo-payment/`,
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