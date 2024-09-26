import { gql } from "@apollo/client"

export async function getOwnSchedule(month: number, year: number, staffId: number) {
    const gqlString = gql`
         query ownSchedule($month: Int!, $year: Int!, $staffId: Int!) {
            ownSchedule(month: $month, year: $year, staffId: $staffId) {
                month
                year
                schedule
            }
        }
    `
    const res = await fetch("http://localhost:5002/get_schedule", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: gqlString.loc.source.body,
            variables: { month:month, year: year, staffId: staffId }
        }),
    })
    
    const data = await res.json()
    return data
}

export async function getTeamSchedule(month: number, year: number, staffId: number) {
    const gqlString = gql`
         query teamSchedule($month: Int!, $year: Int!, $staffId: Int!) {
            teamSchedule(month: $month, year: $year, staffId: $staffId) {
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
            query: gqlString.loc.source.body,
            variables: { month:month, year: year, staffId: staffId }
        }),
    })
    const data = await res.json()
    return data
}

export async function getTeamDetails(month: number, year: number, staffId: number) {
    const gqlString = gql`
         query teamSchedule($month: Int!, $year: Int!, $staffId: Int!) {
            teamSchedule(month: $month, year: $year, staffId: $staffId) {
                teamCount
                teamSchedule {
                    availability {
                        name
                        department
                        availability
                        isPending
                        
                    }
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
            query: gqlString.loc.source.body,
            variables: { month:month, year: year, staffId: staffId }
        }),
    })
    const data = await res.json()
    return data
}

export async function getDepartmentSchedule(month: number, year: number, staffId: number) {
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
    `
    const res = await fetch("http://localhost:5002/get_schedule", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: gqlString.loc.source.body,
            variables: { month:month, year: year, staffId: staffId }
        }),
    })
    const data = await res.json()
    return data
}

    