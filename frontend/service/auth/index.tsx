export async function authenticateUser(email: string, password: string) {

  const response = await fetch(`http://localhost:5001/authenticate`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
