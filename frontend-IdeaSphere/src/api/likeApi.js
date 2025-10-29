const API_BASE = 'http://localhost:7000/api/v1/like';

// Like a post
export async function likePost(postId) {
  try {
    const response = await fetch(`${API_BASE}/${postId}`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(
        errorDetails?.message ||
          `Failed to like post (status ${response.status})`
      );
    }

    const data = await response.json();
    console.log("data in api call :",data)
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Unlike a post
export async function unlikePost(postId) {
  try {
    const response = await fetch(`${API_BASE}/${postId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(
        errorDetails?.message ||
          `Failed to unlike post (status ${response.status})`
      );
    }

    const data = await response.json();
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// -------------------- Get User Liked Posts --------------------
export async function getUserLikes(userId, page = 1, limit = 20) {
  try {
    const response = await fetch(
      `${API_BASE}/user/${userId}?page=${page}&limit=${limit}`,
      {
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(
        errorDetails?.message ||
          `Failed to fetch liked posts (status ${response.status})`
      );
    }

    const data = await response.json();
    return { success: true, data: data.data, pagination: data.pagination };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
