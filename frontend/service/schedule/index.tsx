import { gql } from "@apollo/client"

export async function getOwnSchedule() {
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
            variables: { month: 1, year: 2024, staffId: 130002 }
        }),
    })
    
    const data = await res.json()
    return data
}

export async function getTeamSchedule() {}
