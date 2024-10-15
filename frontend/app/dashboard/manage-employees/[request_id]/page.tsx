import ManageEmployeeArrangementsItem from "@/components/manage-employee-item";
import { getCurrentUser } from "@/lib/session";

// Define a specific type for 'user' if you know its structure
interface User {
  id: string;
  name: string;
  // other fields
}

interface ManageEmployeeRequestPageProps {
  params: {
    request_id: string;
    user: User;
  };
}

export default async function ManageEmployeeRequestPage({
  params,
}: ManageEmployeeRequestPageProps) {
  const user = await getCurrentUser();

  return (
    <ManageEmployeeArrangementsItem
      params={{ request_id: params.request_id, user: user }}
    />
  );
}
