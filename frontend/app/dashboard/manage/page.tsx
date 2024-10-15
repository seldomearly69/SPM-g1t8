import { getCurrentUser } from "@/lib/session";
import ManageArrangementsPage from "@/components/manage-arrangement";


export default async function ManageArrangements() {
  const user = await getCurrentUser()

  return (
    <div>
        <ManageArrangementsPage user={user} />
    </div>
)
}
