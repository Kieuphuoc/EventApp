const BASE_URL = "https://c499-14-169-26-201.ngrok-free.app/";
import axios from "axios";

export const endpoints = {
    'event': '/event/',
    'category': '/category/',
    'review': (event_id) => `/event/${event_id}/reviews/`,
    'create-review': (event_id) => `/event/${event_id}/reviews/create/`,
    'delete-review': (event_id, review_id) => `/event/${event_id}/reviews/${review_id}/delete_review/`,
    'reply': (event_id, review_id) => `/event/${event_id}/reviews/${review_id}/response/`,
    'delete-reply': (event_id, review_id) => `/event/${event_id}/reviews/${review_id}/delete_review/`,
    'stats_rating': (event_id) => `/event/${event_id}/reviews/stats/`,
    'eventDetail': (id) => `/event/${id}/`,
    'register': '/user/',
    'login': '/o/token/',
    'current-user': '/user/me/',
    'favoriteEvent': '/favorite/event/',
    'delete-favor': (event_id) => `/favorite/event/${event_id}/`,
    'invoice': '/invoice/',
    'invoice-detail': (id) => `/invoice/${id}/`,
    'my-discount': '/discount/my_discount/',
    'my-ticket': '/ticket/my_ticket/',
    'my-event': '/event/my_event/',
    'dashboard': '/reports/organizer/dashboard/',
    'momo-payment': (invoice_id) => `/invoice/${invoice_id}/momo-payment/`,
    'monthly': '/reports/organizer/monthly/',
    'check_in': '/ticket/check_in/',
    'user_preference': '/user/preference/',
    'trend': '/event/trend/',
    'recommend': '/event/recommended/',
    'save-push-token': '/user/save-push-token/'
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