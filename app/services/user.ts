
export async function editUser(formData: FormData, id: number): Promise<Response> {

    const res = await fetch(`/api/user/update/${id}`, {
        method: 'PUT',
        body: formData,
    })
    return res;
}

export async function getUser(id: string):Promise<Response>{

    const res = await fetch(`/api/user/getUser/${id}`,{
        method: 'GET'
    })

    return res;
}