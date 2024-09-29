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
  const res = await fetch("http://localhost:5002/get_schedule", {
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

export async function getTeamList(
  month: number,
  year: number,
  staffId: number
) {
  const GET_MANAGER_LIST = gql`
    query GetManagerList($directorId: Int!) {
      managerList(directorId: $directorId) {
        director_name
        manager_list
      }
    }
  `;
}

export async function getManagerList(directorId: number) {
  const gqlString = `
    query getManagerList($directorId: Int!) {
      managerList(directorId: $directorId) {
        directorName
        managerList {
          staffId
          position
          name
        }
      }
    }
  `;

  const res = await fetch("http://localhost:5002/get_schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString,
      variables: { directorId },
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
  const res = await fetch("http://localhost:5002/get_schedule", {
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

export async function getTeamSchedule(day: number, month: number, year: number, staffId: number) {
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
    `
    const res = await fetch("http://localhost:5002/get_schedule", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: gqlString?.loc?.source?.body,
            variables: { day: day, month: month, year: year, staffId: staffId }
        }),
    })
    const data = await res.json()
    return data
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
  const res = await fetch("http://localhost:5002/get_schedule", {
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
