import { useRouter } from "next/navigation"

const ReturnButton = () =>{
    const router = useRouter()
    return(
        <button className="return-button" onClick={() => router.back()}>Voltar</button>
    )
}

export default ReturnButton