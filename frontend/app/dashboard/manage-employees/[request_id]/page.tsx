import ManageEmployeeArrangementsItem from "@/components/manage-employee-item"

export default function ManageEmployeeRequestPage({ params }: { params: { request_id: string }}) {
    return (
        <ManageEmployeeArrangementsItem params={{ request_id: params.request_id }} />
    )
}