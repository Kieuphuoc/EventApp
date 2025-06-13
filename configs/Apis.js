const BASE_URL = "https://05b4-14-187-40-155.ngrok-free.app/";
import axios from "axios";

export const endpoints = {
    'category': '/category/',

    //  Event
    'event': '/event/',
    'delete-event':(id) => `/event/${id}/`,
    'eventDetail': (id) => `/event/${id}/`,
    'recommend': '/event/recommended/',

    // Review
    'review': (event_id) => `/event/${event_id}/reviews/`, // Get Post
    'edit-review': (review_id) => `/reviews/${review_id}/`, // Delete Put Patch
    'reply': (review_id) => `/review/${review_id}/response/`, // Get Post
    'edit-reply': (reply_id) => `/response/${reply_id}`,

    // Rating
    'stats_rating': (event_id) => `/event/${event_id}/stats/`,

    // User
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