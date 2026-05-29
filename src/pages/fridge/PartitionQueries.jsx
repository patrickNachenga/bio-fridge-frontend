import axios from "axios";
import { baseURL } from "../../api";

const API_BASE = baseURL;

// Get all partitions for a block
export const getBlockPartitions = async ({
  fridge_uid,
  block_uid,
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
      `${API_BASE}api/fridges/${fridge_uid}/blocks/${block_uid}/partitions?${params.toString()}`,
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
    console.error("Error fetching partitions:", error);
    return {
      status: error.response?.status || 500,
      data: [],
      message: error.response?.data?.message || "Failed to fetch partitions",
    };
  }
};

// Get specific partition
export const getPartition = async (fridge_uid, block_uid, partition_uid) => {
  try {
    const response = await axios.get(
      `${API_BASE}api/fridges/${fridge_uid}/blocks/${block_uid}/partitions/${partition_uid}`,
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
    console.error("Error fetching partition:", error);
    return {
      status: error.response?.status || 500,
      data: null,
      message: error.response?.data?.message || "Failed to fetch partition",
    };
  }
};

// Create/Update partition
export const createOrUpdatePartition = async (
  fridge_uid,
  block_uid,
  partitionData
) => {
  try {
    const response = await axios.post(
      `${API_BASE}api/fridges/${fridge_uid}/blocks/${block_uid}/partitions`,
      partitionData,
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
    console.error("Error saving partition:", error);
    return {
      status: error.response?.status || 500,
      data: null,
      message: error.response?.data?.message || "Failed to save partition",
    };
  }
};

// Delete partition
export const deletePartition = async (fridge_uid, block_uid, partition_uid) => {
  try {
    const response = await axios.delete(
      `${API_BASE}api/fridges/${fridge_uid}/blocks/${block_uid}/partitions/${partition_uid}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    return {
      status: response.status,
      message: response.data?.message || "Partition deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting partition:", error);
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to delete partition",
    };
  }
};
