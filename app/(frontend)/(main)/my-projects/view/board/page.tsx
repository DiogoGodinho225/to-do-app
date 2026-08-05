import { Project } from "@/app/types/next-project"
import { useRouter, useSearchParams } from "next/navigation";

const board = () =>{
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    return (
        <p>{`proijeto ${id}`}</p>
    )
}

export default board