import { getCurrentUser } from "@/lib/session";
import TeamSchedule from "@/components/team-schedule";
import * as motion from "framer-motion/client";
import { getManagerList } from "@/service/schedule";

export default async function TeamSchedulePage() {
  const user = await getCurrentUser();

  // fetching team schedule here so client can come preloaded with default 1st manager team schedule
  const manager_list_data = await getManagerList(user.staffId);
  const manager_list = manager_list_data?.data.managerList?.managerList;

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
        Team Schedule
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full"
      >
        <TeamSchedule user={user} _managerList={manager_list} />
      </motion.div>
    </motion.div>
  );
}
