const BASE_URL = "https://1f65-2001-ee1-df06-98a0-ec81-6ff9-f11c-3aaf.ngrok-free.app/";
import axios from "axios";

export const endpoints = {
   'event': '/event/',
   'category': '/category/'
}

export default axios.create({
    baseURL: BASE_URL
})