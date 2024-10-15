import ManageIndividualRequest from "@/components/manage-arrangement-item"
import { getCurrentUser } from "@/lib/session"

export default async function ManageIndividualRequestPage({ params }: { params: { request_id: string }}) {
    const user = await getCurrentUser()
    return (
            <ManageIndividualRequest user={user} params={params} />
    )
}