import ManageEmployeeArrangementsItem from "@/components/manage-employee-item";
import { getCurrentUser } from "@/lib/session";
import * as motion from "framer-motion/client";
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
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="max-w-6xl mx-auto px-2"
  >
    <motion.h2
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-2xl font-bold mb-6"
    >
      Manage Employee Arrangement
    </motion.h2>
      <ManageEmployeeArrangementsItem
        params={{ request_id: params.request_id, user: user }}
      />
    </motion.div>
  );
}
