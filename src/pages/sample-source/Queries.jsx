import axios from "axios";
import { API_BASE_URL } from "../../Costants";
import api from "../../api";

const API_URL = `${API_BASE_URL}/api/sample-sources`;

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const setConfig = (pagination = {}) => ({
  headers: { "Content-Type": "application/json" },
  params: { ...pagination },
});

export const getSampleSources = async ({
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
    console.error("Error fetching Sample Sources:", error);
    throw error;
  }
};

export const createUpdateSampleSource = async (sampleSourceData) => {
  try {
    const response = await api.post(API_URL, sampleSourceData, config);
    return response.data;
  } catch (error) {
    console.error(`Error while changing Sample Source:`, error);
    throw error;
  }
};

export const deleteSampleSource = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting Sample Source:", error);
    throw error;
  }
};
