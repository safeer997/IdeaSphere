export async function login(identifier, password) {
  const userCredentials = {
    identifier,
    password,
  };
  try {
    const response = await fetch('http://localhost:7000/api/v1/auth/login', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {});
      throw new Error(
        errorDetails.message || `Login failed with status ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('error in login api:', error);
  }
}
