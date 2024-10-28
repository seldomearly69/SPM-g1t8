import { gql } from "@apollo/client";

export async function getOwnRequest(staffId: number) {
  const gqlString = gql`
    query ownRequests($staffId: Int!) {
      ownRequests(staffId: $staffId) {
        approvingManager
        requests {
          requestId
          date
          type
          createdAt
          status
          reason
          remarks
        }
      }
    }
  `;
  const res = await fetch("http://localhost:5002/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString?.loc?.source?.body,
      variables: { staffId: staffId },
    }),
  });

  const data = await res.json();
  return data;
}

export async function getSubordinatesRequest(managerId: number) {
  // Define the GraphQL query
  const gqlString = `
    query subordinatesRequest($staffId: Int!) {
      subordinatesRequest(staffId: $staffId) {
        requestId
        requestingStaffName
        department
        date
        type
        status
        reason
        remarks
        createdAt
        files
      }
    }
  `;

  // Perform the fetch request
  const res = await fetch("http://localhost:5002/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString, // The query string itself
      variables: { staffId: managerId }, // Passing managerId as staffId
    }),
  });

  const data = await res.json();

  // Handle the result and return the correct data
  if (data.errors) {
    throw new Error(`GraphQL error: ${data.errors[0].message}`);
  }

  return data.data;
}

export async function getFileLink(fileKey: string) {
  const gqlString = `
    query getFileLink($fileKey: String!) {
      fileLink(fileKey: $fileKey) {
        fileKey
        fileLink
      }
    }
  `;

  const res = await fetch("http://localhost:5002/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString,
      variables: {
        fileKey: fileKey, // The file key to retrieve the link for
      },
    }),
  });

  const data = await res.json();

  // Check for errors
  if (data.errors) {
    throw new Error(`GraphQL error: ${data.errors[0].message}`);
  }

  // Ensure that the expected keys are in the response
  if (data.data && data.data.fileLink && data.data.fileLink.fileLink) {
    return data.data.fileLink; // Return the file link object
  } else {
    throw new Error("Invalid response format");
  }
}

export async function approveRequest(
  requestId: number,
  newStatus: string,
  remarks: string
) {
  const gqlString = `
  mutation acceptRejectRequest($requestId: Int!, $newStatus: String!, $remarks: String) {
    acceptRejectRequest(requestId: $requestId, newStatus: $newStatus, remarks: $remarks) {
      success
      message
    }
  }
`;

  const res = await fetch("http://localhost:5002/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString,
      variables: {
        requestId: requestId, // Replace with actual request ID
        newStatus: newStatus, // Replace with new status like 'approved' or 'rejected'
        remarks: remarks, // Optional, can be null or a string
      },
    }),
  });
  const data = await res.json();
  console.log(data);
  return data;
}

export async function getIndividualRequest(requestId: number) {
  const gqlString = `
    query request($requestId: Int!) {
      request(requestId: $requestId) {
        requestId
        date
        type
        createdAt
        status
        remarks
        reason
      }
    }
  `;

  const res = await fetch("http://localhost:5002/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString,
      variables: { requestId: requestId },
    }),
  });
  const data = await res.json();

  return data;
}

export async function withdrawApprovedRequest(
  requestId: number,
  newReason: string
) {
  const gqlString = `
    mutation WithdrawApprovedRequest($requestId: Int!, $newReason: String!) {
      withdrawApprovedRequest(requestId: $requestId, newReason: $newReason) {
        success
        message
      }
    }
  `;

  const res = await fetch("http://localhost:5002/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString,
      variables: { requestId, newReason },
    }),
  });

  const data = await res.json();
  console.log(data);
  return data;
}

/*     mutation withdrawPendingRequest($requestId: Int!) {
  withdrawPendingRequest(requestId: $requestId) {
    success
    message
  }
} */
export async function withdrawPendingRequest(requestId: number) {
  const gqlString = gql`
    mutation AcceptRejectRequest($requestId: Int!) {
      acceptRejectRequest(newStatus: "withdrawn", requestId: $requestId) {
        success
        message
      }
    }
  `;

  const res = await fetch("http://localhost:5002/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString?.loc?.source.body, // Correct usage
      variables: { requestId }, // Ensure you pass requestId as a variable here
    }),
  });

  const data = await res.json();
  return data;
}

export async function fetchPendingRequests() {
  const query = gql`
    query {
      pendingRequests {
        requestId
        employeeName
        status
      }
    }
  `;

  const response = await fetch("http://localhost:5002/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: query.loc?.source?.body }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pending requests");
  }

  const data = await response.json();
  return data.data.pendingRequests;
}
