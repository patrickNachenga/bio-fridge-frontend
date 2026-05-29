import axios from "axios";
import { baseURL } from "../../api";

const API_BASE = baseURL;

// Get all blocks for a fridge
export const getFridgeBlocks = async ({
  fridge_uid,
  search = "",
  pagination = {},
}) => {
  try {
    const params = new URLSearchParams();

    if (search) {
      params.append("search", search);
    }

    if (pagination?.paginated) {
      params.append("page", pagination.page || 1);
      params.append("page_size", pagination.page_size || 10);
      params.append("paginated", true);
    }

    const response = await axios.get(
      `${API_BASE}api/fridges/${fridge_uid}/blocks?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    return {
      status: response.status,
      data: response.data?.data || [],
      pagination: response.data?.pagination || null,
      message: response.data?.message || "Success",
    };
  } catch (error) {
    console.error("Error fetching blocks:", error);
    return {
      status: error.response?.status || 500,
      data: [],
      message: error.response?.data?.message || "Failed to fetch blocks",
    };
  }
};

// Get specific block
export const getFridgeBlock = async (fridge_uid, block_uid) => {
  try {
    const response = await axios.get(
      `${API_BASE}api/fridges/${fridge_uid}/blocks/${block_uid}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    return {
      status: response.status,
      data: response.data?.data || null,
      message: response.data?.message || "Success",
    };
  } catch (error) {
    console.error("Error fetching block:", error);
    return {
      status: error.response?.status || 500,
      data: null,
      message: error.response?.data?.message || "Failed to fetch block",
    };
  }
};

// Create/Update block
export const createOrUpdateBlock = async (fridge_uid, blockData) => {
  try {
    const response = await axios.post(
      `${API_BASE}api/fridges/${fridge_uid}/blocks`,
      blockData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    return {
      status: response.status,
      data: response.data?.data || null,
      message: response.data?.message || "Success",
    };
  } catch (error) {
    console.error("Error saving block:", error);
    return {
      status: error.response?.status || 500,
      data: null,
      message: error.response?.data?.message || "Failed to save block",
    };
  }
};

// Delete block
export const deleteBlock = async (fridge_uid, block_uid) => {
  try {
    const response = await axios.delete(
      `${API_BASE}api/fridges/${fridge_uid}/blocks/${block_uid}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    return {
      status: response.status,
      message: response.data?.message || "Block deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting block:", error);
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to delete block",
    };
  }
};
