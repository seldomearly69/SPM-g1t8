import PendingRequests from "@/components/PendingRequests";

export default function PendingRequestsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        View Pending Requests
      </h1>
      <PendingRequests />
    </div>
  );
}