const API_BASE = 'http://localhost:7000/api/v1/post';

// Create a reply to a post
export async function createReply(postId, content, mediaFile) {
  try {
    const formData = new FormData();
    formData.append('content', content);
    if (mediaFile) formData.append('media', mediaFile);

    const response = await fetch(`${API_BASE}/${postId}/reply`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(
        errorDetails?.message ||
          `Failed to create reply (status ${response.status})`
      );
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Create reply error:', error);
    return { success: false, message: error.message };
  }
}

// Get replies for a post
export async function getPostReplies(postId, page = 1, limit = 20) {
  try {
    const response = await fetch(
      `${API_BASE}/${postId}/replies?page=${page}&limit=${limit}`,
      {
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(
        errorDetails?.message ||
          `Failed to fetch replies (status ${response.status})`
      );
    }

    const data = await response.json();
    return { success: true, data: data.data, pagination: data.pagination };
  } catch (error) {
    console.error('Get replies error:', error);
    return { success: false, message: error.message };
  }
}
