export type Invite = {
    id?: number,
    project_id: number,
    invitedBy_id: number,
    tag: string,
    description: string, 
    status?: number
    invitedBy?: {
        first_name: string,
        last_name: string,
        tag: string,
    },
    project?:{
        title: string,
    },
}