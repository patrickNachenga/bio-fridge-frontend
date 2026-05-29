import axios from "axios";
import { API_BASE_URL } from "../../Costants";
import api from "../../api";

const API_URL = `${API_BASE_URL}/api/sample-types`;

const config = {
    headers: {
        "Content-Type": "application/json",
    },
};

const setConfig = (pagination = {}) => ({
    headers: { "Content-Type": "application/json" },
    params: { ...pagination },
});

export const getSampleTypes = async ({
    uid = "",
    search = "",
    directory = "",
    pagination = {},
}) => {
    try {
        let url = `${API_URL}`;
        let config = {};

        if (uid !== "") {
            url += `/${uid}`;
        } else {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (directory) params.append("directory", directory);
            url += `?${params.toString()}`;
            config = setConfig(pagination);
        }

        const response = await api.get(url, config);
        return response.data;
    } catch (error) {
        console.error("Error fetching SampleTypes:", error);
        throw error;
    }
};

export const createUpdateSampleType = async (sampleTypeData) => {
    try {
        const response = await api.post(API_URL, sampleTypeData, config);
        return response.data;
    } catch (error) {
        console.error(`Error while changing SampleType:`, error);
        throw error;
    }
};

export const deleteSampleType = async (id) => {
    try {
        const response = await api.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting SampleType:", error);
        throw error;
    }
};
