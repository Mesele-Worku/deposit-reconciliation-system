export const statusColor = status => {

    switch (status) {

        case "SUCCESS":
        case "COMPLETED":
        case "PASS":
            return "text-green-700 bg-green-100";

        case "FAILED":
        case "FAIL":
            return "text-red-700 bg-red-100";

        case "RUNNING":
            return "text-blue-700 bg-blue-100";

        case "ACTIVE":
            return "text-green-700 bg-green-100";

        default:
            return "text-gray-700 bg-gray-100";
    }

};