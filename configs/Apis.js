const BASE_URL = "https://bf54-2405-4802-643c-8de0-d9d4-1ace-7dbf-b473.ngrok-free.app/";
import axios from "axios";

export const endpoints = {
   'event': '/event/',
   'event_type': '/event_type/'
}

export default axios.create({
    baseURL: BASE_URL
})