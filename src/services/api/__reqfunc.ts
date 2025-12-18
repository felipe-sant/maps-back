import axios from "axios"

class ReqFunc {
    public static async getReq<T>(url: string, query?: Record<string, string>): Promise<{ status: number, content: T | undefined }> {
        try {
            const fullUrl = query
                ? `${url}?${new URLSearchParams(query).toString()}`
                : url

            const response = await axios.get<T>(fullUrl, {
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            return { status: response.status, content: response.data }
        } catch (error: unknown) {      
            console.error(error)
            return { status: 500, content: undefined }
        }
    }
}

export default ReqFunc