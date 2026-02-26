'use client'
import { useSearchParams } from "next/navigation"

const ProjectMembers = () =>{

    const searchParams = useSearchParams();
    const id = searchParams.get('id');


    return(
        <div className="members-container">
            <h2>Membros</h2>
            <button>Convidar Membros</button>


        </div>
    )
}


const MembersTable = () =>{
    return(
        <table>
            <thead>
                
            </thead>
        </table>
    )
}

export default ProjectMembers;