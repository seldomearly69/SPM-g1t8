import ManageEmployeeArrangements from "@/components/manage-employee";
import { getCurrentUser } from "@/lib/session";

export default async function ManageEmployeeArrangementsPage() {
    const user = await getCurrentUser()
    return (
        <ManageEmployeeArrangements user={user} />
    )
}