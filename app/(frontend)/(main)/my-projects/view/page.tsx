'use client'

import { getProject } from "@/app/services/projects";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "@/app/(frontend)/components/model";

const ProjectView = () => {

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [project, setProject] = useState({
        title: '',
    });
    const [loading, setLoading] = useState(false);
    const [modalStatus, setModalStatus] = useState(false);

    const handleModalStatus = () => {
        setModalStatus(!modalStatus);
    }

    const fetchProject = async () => {
        setLoading(true)
        try {
            if (id) {
                const result = await getProject(id);
                const data = await result.json();

                if (result.ok) {
                    setProject(data.project);
                } else {
                    toast.error(data.message || 'Erro ao carregar projeto!')
                }
            }

        } catch (err) {
            console.error(err);
            toast.error('Erro ao carregar projeto!');
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchProject()
    }, [id])

    return (
        <div className='project-container'>
            {
                modalStatus ?
                    <Modal handleStatus={handleModalStatus} title={'Subtasks'}  >
                        <SubtasksList />
                    </Modal>
                    : null
            }

            {
                loading ? <p className="alert">A carregar...</p>

                    :

                    <>
                        <h2>{project.title}</h2>
                        <div className="tasks-list">
                            <TasksTable handleModalStatus={handleModalStatus} />
                        </div>
                    </>
            }
        </div >
    )
}



const TasksTable = ({ handleModalStatus }: any) => {

    return (
        <table>
            <thead>
                <tr>
                    <th>
                        #
                    </th>
                    <th>
                        Tarefa
                    </th>
                    <th>
                        Atribuída a
                    </th>
                    <th>
                        Prioridade
                    </th>
                    <th>
                        Data Limite
                    </th>
                    <th>
                        Estado
                    </th>
                    <th>
                        Ações
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr onClick={handleModalStatus}>
                    <td>1</td>


                    <td>Fazer login page</td>


                    <td>Diogo</td>


                    <td>Urgente</td>


                    <td>02-02-2005</td>


                    <td>Pendente</td>


                    <td>
                        <button>F</button>
                        <button>X</button>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

const SubtasksList = () => {
    return (
        <p>Ola</p>
    )
}

export default ProjectView;
