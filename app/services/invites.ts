export async function getInvites(id: string): Promise<Response> {
    const res = await fetch(`/api/invites/getInvites/${id}`, {
        method: 'GET',
    })

    return res;
}

export async function acceptInvites(id: number, status: number): Promise<Response> {
    const res = await fetch(`/api/projects/accept-invite/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                status
            })
        }
    )

    return res;
}