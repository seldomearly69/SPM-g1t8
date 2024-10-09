import { gql } from "@apollo/client";

export async function applyForWFH(
  userId: number,
  type: String,
  reason: String,
  date: Array<Date>,
  file: File
) {
  // The GraphQL mutation string for file upload
  const gqlString = `
    mutation applyWFH(
      $userId: Int!,
      $type: String!,
      $reason: String!,
      $date: [Date!]!,
      $file: Upload
    ) {
      applyWFH(
        userId: $userId,
        type: $type,
        reason: $reason,
        date: $date,
        file: $file
      ) {
        statusCode
      }
    }
  `;

  // Create a FormData object to handle the multipart request
  const formData = new FormData();

  // Add the query and variables as part of the form data
  formData.append(
    "operations",
    JSON.stringify({
      query: gqlString,
      variables: {
        userId: userId,
        type: type,
        reason: reason,
        date: date,
        file: null, // Placeholder for file in the variables
      },
    })
  );

  // Map the file in the form data to the GraphQL "file" variable
  formData.append(
    "map",
    JSON.stringify({
      "1": ["variables.file"], // Map file to the correct GraphQL variable
    })
  );

  // Attach the actual file under key "1"
  formData.append("1", file);

  // Send the fetch request with multipart/form-data
  const res = await fetch("http://localhost:5002/graphql", {
    method: "POST",
    body: formData, // No need for 'Content-Type' header, FormData handles that
  });

  const data = await res.json();
  return data;
}
