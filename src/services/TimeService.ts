import axios from "axios";
import {TimeZoneData } from "../types/TimeZoneData";

const URL_BASE_REST_API = 'https://api.timezonedb.com/v2.1/get-time-zone?key=CSRK2MMZ4DPB&format=json&by=position&lat=-34.61315&lng=-58.37723';

export const fetchTime = async (): Promise<TimeZoneData> => {
    try {
        const response = await axios.get<TimeZoneData>(URL_BASE_REST_API);
        return response.data;
    } catch (error) {
        console.error('fetchTime error:', error);
        throw new Error(error instanceof Error ? error.message : "Error desconocido");;
    }
}