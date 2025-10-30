const API_BASE = 'http://localhost:7000/api/v1/post';

// -------------------- Get All Posts --------------------
export async function getPosts() {
  try {
    const response = await fetch(`${API_BASE}`, {
      credentials: 'include', // ← Add this to send cookies
    });
    
    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(
        errorDetails?.message ||
          `Failed to fetch posts (status ${response.status})`
      );
    }
    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Keep your other functions as they are (createPost, deletePost, updatePost)


// -------------------- Create Post --------------------
export async function createPost(content, mediaFile) {
  try {
    console.log(content, mediaFile);
    const formData = new FormData();
    formData.append('content', content);
    if (mediaFile) formData.append('media', mediaFile);

    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(
        errorDetails?.message ||
          `Failed to create post (status ${response.status})`
      );
    }

    const data = await response.json();
    console.log("Data : ",data)
    return { success: true, data: data.data }; // newly created post
  } catch (error) {
    return { success: false, message: error.message };
  }
}


// -------------------- Delete Post --------------------
export async function deletePost(postId, token) {
  try {
    const response = await fetch(`${API_BASE}/${postId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(
        errorDetails?.message ||
          `Failed to delete post (status ${response.status})`
      );
    }

    const data = await response.json();
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// -------------------- Update Post --------------------
export async function updatePost(postId, content, token) {
  try {
    const response = await fetch(`${API_BASE}/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(
        errorDetails?.message ||
          `Failed to update post (status ${response.status})`
      );
    }

    const data = await response.json();
    return { success: true, data: data.data }; // updated post
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Get single post
export async function getPost(postId) {
  try {
    const response = await fetch(`${API_BASE}/${postId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(
        errorDetails?.message || `Failed to fetch post (status ${response.status})`
      );
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Get post error:', error);
    return { success: false, message: error.message };
  }
}

