import { gql } from "@apollo/client";

export async function requestForTransfer(
  reason: string,
  staffId: number,
  targetManager: number
) {
  const isServer = typeof window === "undefined";
  const gqlString = gql`
    mutation RequestForTransfer(
      $reason: String!
      $requestingManager: Int!
      $targetManager: Int!
    ) {
      requestForTransfer(
        reason: $reason
        requestingManager: $requestingManager
        targetManager: $targetManager
      ) {
        success
        message
      }
    }
  `;
  const res = await fetch(
    `${
      isServer
        ? process.env.REQUESTS_API_URL
        : process.env.NEXT_PUBLIC_REQUESTS_API_URL
    }`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: gqlString?.loc?.source?.body,
        variables: {
          reason: reason,
          requestingManager: staffId,
          targetManager: targetManager,
        },
      }),
    }
  );

  const data = await res.json();
  return data;
}

export async function getTransferRequests(staffId: number, status?: string) {
  const isServer = typeof window === "undefined";
  const gqlString = gql`
    query TransferRequests($staffId: Int!, $status: String) {
      transferRequests(staffId: $staffId, status: $status) {
        requestId
        requestingManagerId
        requestingManagerName
        targetManagerId
        targetManagerName
        status
        reason
      }
    }
  `;
  const res = await fetch(
    `${
      isServer
        ? process.env.REQUESTS_API_URL
        : process.env.NEXT_PUBLIC_REQUESTS_API_URL
    }`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: gqlString?.loc?.source?.body,
        variables: { staffId: staffId, status: status },
      }),
    }
  );

  const data = await res.json();
  return data;
}

export async function acceptRejectTransferRequest(
  newStatus: string,
  requestId: number
) {
  const isServer = typeof window === "undefined";
  const gqlString = gql`
    mutation AcceptRejectTransferRequest(
      $newStatus: String!
      $requestId: Int!
    ) {
      acceptRejectTransferRequest(
        newStatus: $newStatus
        requestId: $requestId
      ) {
        success
        message
      }
    }
  `;
  const res = await fetch(
    `${
      isServer
        ? process.env.REQUESTS_API_URL
        : process.env.NEXT_PUBLIC_REQUESTS_API_URL
    }`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: gqlString?.loc?.source?.body,
        variables: { newStatus: newStatus, requestId: requestId },
      }),
    }
  );

  const data = await res.json();
  return data;
}

export async function getTransferOptions(staffId: number) {
  const isServer = typeof window === "undefined";
  const gqlString = gql`
    query TransferOptions($staffId: Int!) {
      transferOptions(staffId: $staffId) {
        staffId
        position
        name
      }
    }
  `;
  const res = await fetch(
    `${
      isServer
        ? process.env.REQUESTS_API_URL
        : process.env.NEXT_PUBLIC_REQUESTS_API_URL
    }`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: gqlString?.loc?.source?.body,
        variables: { staffId: staffId },
      }),
    }
  );

  
  const data = await res.json();
  return data;
}

export async function revertTransferRequest(requestId: number) {
  const isServer = typeof window === "undefined";
  const gqlString = gql`
    mutation RevertTransfer($requestId: Int!) {
      revertTransfer(requestId: $requestId) {
        success
        message
      }
    }
  `;

  const res = await fetch(
    `${
      isServer
        ? process.env.REQUESTS_API_URL
        : process.env.NEXT_PUBLIC_REQUESTS_API_URL
    }`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: gqlString?.loc?.source?.body,
        variables: { requestId: requestId },
      }),
    }
  );

  const data = await res.json();
  return data;
}
