const API_BASE = 'http://localhost:7000/api/v1/user';

// -------------------- Get User Profile --------------------
export async function getUserProfile(userId) {
  try {
    const response = await fetch(`${API_BASE}/${userId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(
        errorDetails?.message || `Failed to fetch user (status ${response.status})`
      );
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// -------------------- Get User Posts --------------------
export async function getUserPosts(userId, page = 1, limit = 20) {
  try {
    const response = await fetch(
      `${API_BASE}/${userId}/posts?page=${page}&limit=${limit}`,
      {
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(
        errorDetails?.message || `Failed to fetch posts (status ${response.status})`
      );
    }

    const data = await response.json();
    return { success: true, data: data.data, pagination: data.pagination };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// -------------------- Get User Followers --------------------
export async function getFollowers(userId, page = 1, limit = 20) {
  try {
    const response = await fetch(
      `${API_BASE}/${userId}/followers?page=${page}&limit=${limit}`,
      {
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(
        errorDetails?.message || `Failed to fetch followers (status ${response.status})`
      );
    }

    const data = await response.json();
    return { success: true, data: data.data, pagination: data.pagination };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// -------------------- Get User Following --------------------
export async function getFollowing(userId, page = 1, limit = 20) {
  try {
    const response = await fetch(
      `${API_BASE}/${userId}/following?page=${page}&limit=${limit}`,
      {
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(
        errorDetails?.message || `Failed to fetch following (status ${response.status})`
      );
    }

    const data = await response.json();
    return { success: true, data: data.data, pagination: data.pagination };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
