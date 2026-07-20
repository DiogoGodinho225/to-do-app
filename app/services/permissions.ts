import {Permission} from "@/app/types/next-project"

export async function getPermissions(): Promise<Response> {
    const res = await fetch(`/api/permissions`, {
        method: 'GET',
    })

    return res;
}

export async function givePermissions(memberPermissions: Permission[], userId: number, projectId: number, id:number): Promise<Response> {
    const res = await fetch(`/api/projects/give-permissions`, {
        method: 'POST',
        body: JSON.stringify({
            memberPermissions,
            userId,
            projectId,
            id,
        })
    })

    return res;
}