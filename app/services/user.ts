
export async function editUser(formData: FormData, id: number): Promise<Response> {

    const res = await fetch(`/api/user/update/${id}`, {
        method: 'PUT',
        body: formData,
    })
    return res;
}