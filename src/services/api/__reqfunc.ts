import axios from "axios"

class ReqFunc {
    public static async getReq<T>(url: string, query?: Record<string, string>): Promise<{ status: number, content: T }> {
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
        } catch (error: any) {      
            return { status: 500, content: error.response?.data?.error || error.message || 'Erro desconhecido' }
        }
    }
}

export default ReqFunc