import { gql } from "@apollo/client";

export async function getArrangements(staffId: number) {
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

export async function getEmployeesRequest(managerId: number) {
  const gqlString = gql`
    query request($managerId: Int!) {
      request(managerId: $managerId) {
        employeeName
        employeeDepartment
        requestedOn
        requestDate
        type
        status
        reason
        files
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
      variables: { managerId: managerId },
    }),
  });

  const data = await res.json();
  return data.data.request;
}

export async function getIndividualRequest(requestId: number) {
  const gqlString = `
    query request($requestId: Int!) {
      request(requestId: $requestId) {
        requestId
        date
        type
        status
        remarks
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
      variables: { requestId: requestId },
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
    }
  `;

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
