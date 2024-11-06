import { getCurrentUser } from "@/lib/session";
import ManageArrangementsPage from "@/components/manage-arrangement";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import * as motion from "framer-motion/client";

export default async function ManageArrangements() {
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
      Manage WFH Arrangements

    </motion.h2>

    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full"
    >
      <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <ManageArrangementsPage user={user} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
