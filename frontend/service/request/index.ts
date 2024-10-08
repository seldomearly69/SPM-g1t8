import { gql } from "@apollo/client";

export async function getArrangements(
  staffId: number
) {
  const gqlString = gql`
    query ownRequests($staffId: Int!) {
      ownRequests(staffId: $staffId) {
        approvingManager
        requests {
            requestId
            date
            type
            status
            remarks
        }
      }
    }
  `;
  const res = await fetch("http://localhost:5002/get_requests", {
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


export async function getIndividualRequest(requestId: number) {
  const gqlString = gql`
    query request($requestId: Int!) {
      request(requestId: $requestId) {
        requestId
        date
        type
        status
        remarks
      }
    }`;

  const res = await fetch("http://localhost:5002/get_requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString?.loc?.source?.body,
      variables: { requestId: requestId},
    }),
  });
  const data = await res.json();
 
  return data;
}

export async function withdrawRequest(requestId: number, reason: string) {
  const gqlString = gql`
    mutation withdrawRequest($requestId: Int!, $reason: String!) {
      withdrawRequest(requestId: $requestId, reason: $reason) {
        requestId
        status
      }
    }`;

  const res = await fetch("http://localhost:5002/get_requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString?.loc?.source?.body,
      variables: { requestId: requestId, reason: reason },
    }),
  });
  const data = await res.json();
  return data;
}
  