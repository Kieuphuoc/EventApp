const BASE_URL = "https://fadf-14-169-26-201.ngrok-free.app/";
import axios from "axios";

export const endpoints = {
    'category': '/category/',

    //  Event
    'event': '/event/',
    'delete-event':(id) => `/event/${id}/`,
    'eventDetail': (id) => `/event/${id}/`,
    'recommend': '/event/recommended/',

    // Review
    'review': (event_id) => `/event/${event_id}/reviews/`,
    'delete-review': (event_id, review_id) => `/event/${event_id}/reviews/${review_id}/`,
    'reply': (event_id, review_id) => `/event/${event_id}/reviews/${review_id}/response/`,
    'delete-reply': (event_id, review_id, reply_id) => `/event/${event_id}/reviews/${review_id}/response/${reply_id}`,

    'stats_rating': (event_id) => `/event/${event_id}/reviews/stats/`,

    'register': '/user/',
    'login': '/o/token/',
    'current-user': '/user/me/',

    // Favor
    'favoriteEvent': '/favorite/event/',
    'delete-favor': (event_id) => `/favorite/event/${event_id}/`,

    // Invoice
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