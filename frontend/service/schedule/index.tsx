import { gql } from "@apollo/client";

export async function getOwnSchedule(
  month: number,
  year: number,
  staffId: number
) {
  const gqlString = gql`
    query ownSchedule($month: Int!, $year: Int!, $staffId: Int!) {
      ownSchedule(month: $month, year: $year, staffId: $staffId) {
        month
        year
        schedule
      }
    }
  `;
  const res = await fetch("http://localhost:5002/schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString?.loc?.source?.body,
      variables: { month: month, year: year, staffId: staffId },
    }),
  });

  const data = await res.json();
  return data;
}


export async function getManagerList(staffId: number) {
  const gqlString = `
    query getManagerList($staffId: Int!) {
      managerList(staffId: $staffId) {
        directorName
        managerList {
          staffId
          position
          name
        }
      }
    }
  `;

  const res = await fetch("http://localhost:5002/schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString,
      variables: { staffId },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error response:", errorText);
    throw new Error(`Failed to fetch manager list: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function getTeamDetails(
  day: number,
  month: number,
  year: number,
  staffId: number
) {
  const gqlString = gql`
    query teamSchedule($day: Int!, $month: Int!, $year: Int!, $staffId: Int!) {
      teamSchedule(day: $day, month: $month, year: $year, staffId: $staffId) {
        teamCount
        teamSchedule {
          date
          type
          availableCount
          availability {
            name
            department
            availability
            type
            isPending
          }
        }
      }
    }
  `;
  const res = await fetch("http://localhost:5002/schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString?.loc?.source?.body,
      variables: { day: day, month: month, year: year, staffId: staffId },
    }),
  });
  const data = await res.json();
  return data;
}

export async function getTeamSchedule(
  day: number,
  month: number,
  year: number,
  staffId: number
) {
  console.log(day, month, year, staffId);

  const gqlString = gql`
    query teamSchedule($day: Int!, $month: Int!, $year: Int!, $staffId: Int!) {
      teamSchedule(day: $day, month: $month, year: $year, staffId: $staffId) {
        teamCount
        teamSchedule {
          date
          type
          availableCount
        }
      }
    }
  `;
  const res = await fetch("http://localhost:5002/schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString?.loc?.source?.body,
      variables: { day: day, month: month, year: year, staffId: staffId },
    }),
  });
  const data = await res.json();
  return data;
}

export async function getDepartmentSchedule(
  month: number,
  year: number,
  staffId: number
) {
  const gqlString = gql`
    query departmentSchedule($month: Int!, $year: Int!, $staffId: Int!) {
      departmentSchedule(month: $month, year: $year, staffId: $staffId) {
        departmentName
        deptSchedule {
          teamSchedule {
            date
            type
            availableCount
          }
        }
      }
    }
  `;
  const res = await fetch("http://localhost:5002/schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString?.loc?.source?.body,
      variables: { month: month, year: year, staffId: staffId },
    }),
  });
  const data = await res.json();
  return data;
}

export async function getOverallAvailability(month: number, year: number) {
  const gqlString = gql`
    query overallAvailability($month: Int!, $year: Int!) {
      overallAvailability(month: $month, year: $year) {
        overallAvailability
      }
    }
  `;
  const res = await fetch("http://localhost:5002/schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString?.loc?.source?.body,
      variables: { month: month, year: year },
    }),
  });
  const data = await res.json();
  return data;
}

export async function getOverallSchedule(
  month: number,
  year: number,
  day: number
) {
  const gqlString = gql`
    query overallSchedule($month: Int!, $year: Int!, $day: Int!) {
      overallSchedule(month: $month, year: $year, day: $day) {
        overallSchedule {
          date
          type
          availableCount
          availability {
            name
            type
            department
            availability
            isPending
          }
        }
      }
    }
  `;

  const res = await fetch("http://localhost:5002/schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString?.loc?.source?.body,
      variables: { month: month, year: year, day: day },
    }),
  });
  const data = await res.json();
  return data;
}

export async function getLeaves(month: number, year: number, staffId: number) {
  const gqlString = gql`
    query ownLeaves($month: Int!, $year: Int!, $staffId: Int!) {
      ownLeaves(month: $month, year: $year, staffId: $staffId) {
        date
        availability
        type
        isPending
      }
    }
  `;
  const res = await fetch("http://localhost:5002/schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString?.loc?.source?.body,
      variables: { month: month, year: year, staffId: staffId },
    }),
  });
  const data = await res.json();
  return data;
}
