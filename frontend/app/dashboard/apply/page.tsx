import * as motion from "framer-motion/client";
import ApplicationForm from "@/components/application-form";
import { getCurrentUser } from "@/lib/session";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function ApplyWFHPage() {
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
        Apply for Work From Home
      </motion.h2>
      <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <ApplicationForm user={user} />
          </CardContent>
        </Card>
    </motion.div>
  );
}
