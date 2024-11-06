export async function createRequest(
  staffId: number,
  date_type: Array<{ date: string; type: string }>,
  reason?: string,
  remarks?: string,
  files?: Array<File>
) {
  const isServer = typeof window === "undefined";   
  // The GraphQL mutation string for file upload
  const gqlString = `
    mutation createRequest(
      $staffId: Int!,
      $reason: String,
      $remarks: String,
      $dateType: [DateTypeInput!]!,
      $files: [Upload]
    ) {
      createRequest(
        staffId: $staffId,
        reason: $reason,
        remarks: $remarks,
        dateType: $dateType,
        files: $files
      ) {
        success
        message
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
        staffId: staffId,
        reason: reason || null,
        remarks: remarks || "",
        dateType: date_type,
        files: files && files.length > 0 ? files.map(() => null) : null,
      },
    })
  );

  // Assuming `files` is an array of File objects.
  if (files && files.length > 0) {
    const map: { [key: string]: string[] } = {};
    files.forEach((file, index) => {
      map[index.toString()] = [`variables.files.${index}`]; // Stringify index for keys
    });

    formData.append("map", JSON.stringify(map));

    files.forEach((file, index) => {
      formData.append(index.toString(), file); // Append each file with its index as the key
    });
  }

  // Send the fetch request with multipart/form-data
  const res = await fetch(
    `${isServer ? process.env.REQUESTS_API_URL : process.env.NEXT_PUBLIC_REQUESTS_API_URL}`,
    {
      method: "POST",
      body: formData, // No need for 'Content-Type' header, FormData handles that
  });

  const data = await res.json();
  return data;
}
