import axios from "axios";
import { API_BASE_URL } from "../../Costants";
import api from "../../api";

const API_URL = `${API_BASE_URL}/api/fridges`;

const config = {
    headers: {
        "Content-Type": "application/json",
    },
};

const setConfig = (pagination = {}) => ({
    headers: { "Content-Type": "application/json" },
    params: { ...pagination },
});

export const getFridges = async ({
    uid = "",
    search = "",
    pagination = {},
}) => {
    try {
        const response = await api.get(
            `${API_URL}${uid == "" ? (search !== "" ? `?search=${search}` : "") : `/${uid}`
            }`,
            uid == "" ? setConfig(pagination) : {}
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching Fridges:", error);
        throw error;
    }
};

export const createUpdateFridge = async (formData) => {
    try {
        const response = await api.post(API_URL, formData, config);
        return response.data;
    } catch (error) {
        console.error(`Error while changing Fridges:`, error);
        throw error;
    }
};

export const deleteFridge = async (id) => {
    try {
        const response = await api.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting Fridges:", error);
        throw error;
    }
};
