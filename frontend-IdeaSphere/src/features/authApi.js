// frontend/src/features/authApi.js

// -------------------- Local Login --------------------
export async function login(identifier, password) {
  try {
    const response = await fetch('http://localhost:7000/api/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
      credentials: 'include', // ✅ send cookies
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(errorDetails?.message || `Login failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// -------------------- Signup --------------------
export async function signUp(email, phoneNumber, password) {
  const userCredentials = { email, phoneNumber, password };

  try {
    const response = await fetch('http://localhost:7000/api/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userCredentials),
      credentials: 'include', // ✅ in case backend sets cookies on signup
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(errorDetails?.message || `Signup failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// -------------------- Logout --------------------
export async function logout() {
  try {
    const response = await fetch('http://localhost:7000/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include', // ✅ send cookie to clear it
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(errorDetails?.message || `Logout failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// -------------------- OAuth --------------------
export function googleAuth() {
  // Opens backend Google login in the same tab
  window.open('http://localhost:7000/api/v1/auth/google', '_self');
}

export function githubAuth() {
  window.open('http://localhost:7000/api/v1/auth/github', '_self');
}

// -------------------- Get Current User --------------------
export async function getCurrentUser() {
  try {
    const response = await fetch('http://localhost:7000/api/v1/auth/me', {
      credentials: 'include', // ✅ send cookie
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch {
    return null;
  }
}
