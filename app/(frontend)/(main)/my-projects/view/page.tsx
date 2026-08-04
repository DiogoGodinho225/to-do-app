'use client'

import { getProject, editTask, removeTask, createTask, editProject, removeSubtask, editSubtask, createSubtask } from "@/app/services/projects";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "@/app/(frontend)/components/modal";
import { FaPlus, FaCheck, FaTrash, FaPencilAlt, FaEye } from "react-icons/fa";
import { Member, Task, Project, Subtask } from '@/app/types/next-project'
import { useUser } from "@/app/context/UserContext";
import Filters from "@/app/(frontend)/components/filters";

interface TasksListProps {
    tasks: Task[],
    handleModalStatus: (task?: Task | null) => void,
    members: Member[],
    fetchProject: () => Promise<void>;
}

interface FormProps {
    members: Member[],
    selectedTask: Task | null,
    handleModalStatus: (task?: Task | null) => void;
    fetchProject: () => Promise<void>;
    projectId: number
}

interface SubtaskListProps {
    subtasks: Subtask[],
    fetchProject: () => Promise<void>;
    taskId: number
    handleModal: () => void
}

interface SubtaskFormProps {
    subtask: Subtask | null,
    taskId: number,
    setForm: (value: boolean) => void,
    fetchProject: () => Promise<void>,
    handleModal: () => void
}

const ProjectView = () => {

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [project, setProject] = useState<Project>({
        id: 0,
        title: '',
        description: '',
        owner_id: 0,
        tasks: [],
        project_members: [],
    });
    const [loading, setLoading] = useState(false);
    const [subtasksModalStatus, setSubtasksModalStatus] = useState(false);
    const [taskModalStatus, setTaskModalStatus] = useState(false);
    const router = useRouter()
    const [showDetails, setShowDetails] = useState(false)
    const { user } = useUser()
    const [task, setTask] = useState<Task | null>({})
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

    const handleSubtasksModalStatus = (task?: Task | null) => {

        if (task) {
            setTask(task)
        }
        setSubtasksModalStatus(!subtasksModalStatus);
    }


    const handleTaskModalStatus = () => {

        setTaskModalStatus(!taskModalStatus);
    }

    const fetchProject = async () => {
        setLoading(true)
        try {
            if (id) {
                const result = await getProject(id);
                const data = await result.json();

                if (result.ok) {
                    setProject(data.project);
                    setFilteredTasks(data.project.tasks);
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

    const handleProjectDetails = () => {
        if (showDetails) {
            handleEditProject();
        }
        setShowDetails(!showDetails)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProject((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditProject = async () => {
        try {
            const data = { title: project.title, description: project.description }
            const result = await editProject(data, Number(user?.id), Number(id))
            const body = await result.json();

            if (!result.ok) {
                toast.error(body.message || "Erro ao editar projeto!");
            }


        } catch (error) {
            toast.error('Erro ao editar Projeto!')
            console.error(error);
        }
    }

    return (
        <div className='project-container'>
            {
                subtasksModalStatus ?
                    <Modal handleStatus={handleSubtasksModalStatus} title={'Subtasks'}  >
                        <SubtasksList subtasks={task?.subtasks || []} fetchProject={fetchProject} taskId={task?.id || 0} handleModal={handleSubtasksModalStatus}/>
                    </Modal>
                    : null
            }

            {
                taskModalStatus ?
                    <Modal handleStatus={handleTaskModalStatus} title={'Criar Tarefa'}>
                        <TaskForm members={project.project_members || []} selectedTask={null} handleModalStatus={handleTaskModalStatus} fetchProject={fetchProject} projectId={Number(project.id)} />
                    </Modal >
                    : null
            }

            {
                loading ? <p className="alert">A carregar...</p>

                    :

                    <>
                        <h2>{project?.title}<button onClick={handleProjectDetails}><FaEye /></button></h2>
                        {
                            showDetails ?
                                <div className="project-details">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="title">Título</label>
                                            <input type="text" name="title" placeholder="Título" defaultValue={project?.title || ""} onChange={handleChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="description">Descrição</label>
                                            <textarea rows={10} name="description" placeholder="Descrição" defaultValue={project?.description || ""} onChange={handleChange}></textarea>
                                        </div>
                                    </form>

                                </div> : null
                        }
                        <Filters tasks={project.tasks || []} members={project.project_members || []} setFilteredTasks={setFilteredTasks}/>

                        <div className="tasks-list">
                            <div className="action-buttons">
                                <button onClick={handleTaskModalStatus}><FaPlus /> Tarefa</button>
                                <button onClick={() => { router.push(`/my-projects/members?id=${id}`) }}>Membros</button>
                                <button>Quadro</button>
                            </div>
                            <TasksTable handleModalStatus={(task) => handleSubtasksModalStatus(task)} tasks={filteredTasks || []} members={project?.project_members || []} fetchProject={fetchProject} />
                        </div>
                    </>
            }
        </div >
    )
}



const TasksTable = ({ handleModalStatus, tasks, members, fetchProject }: TasksListProps) => {

    const [editModalStatus, setEditModalStatus] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const { user } = useUser();


    const handleEditModalStatus = (task?: Task | null) => {
        setEditModalStatus(!editModalStatus);
        setSelectedTask(task || null);
    };

    const handleRemoveTask = async (task: Task) => {
        try {

            const confirmDelete = window.confirm("Pretende eliminar esta Tarefa?");

            if (!confirmDelete) return;


            const result = await removeTask(Number(user?.id), Number(task?.project_id), Number(task.id));
            const body = await result.json();

            if (result.ok) {
                toast.success(body.message);
                fetchProject();

            } else {
                toast.error(body.message);
            }

        } catch (error) {
            toast.error('Erro ao remover Tarefa!')
            console.error(error);
        }
    }

    const checkTask = async (task: Task) => {
        const data = { status_id: 3 }
        try {
            const result = await editTask(data, Number(task.id), Number(user?.id), Number(task?.project_id));
            const body = await result.json();

            if (result.ok) {
                toast.success(body.message);
                fetchProject();
            } else {
                toast.error(body.message);
            }


        } catch (error) {
            toast.error('Erro ao concluir Tarefa!')
            console.error(error);
        }
    }

    return (
        <>
            {
                editModalStatus ?
                    <Modal handleStatus={handleEditModalStatus} title={'Editar'}>
                        <TaskForm members={members} selectedTask={selectedTask} handleModalStatus={handleEditModalStatus} fetchProject={fetchProject} projectId={Number(selectedTask?.project_id)} />
                    </Modal >
                    : null
            }
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
                    {
                        tasks?.map((task, index) => (
                            <tr onClick={() => handleModalStatus(task)} key={index} className={`status-${task.status_id}`}>
                                <td>{index + 1}</td>


                                <td>{task.title}</td>


                                <td>{task?.user?.first_name + ' ' + task?.user?.last_name}</td>


                                <td><span className={`priority-tag status-${task?.priority_id}`}>{task?.priority?.status}</span></td>


                                <td>{task?.dueDate
                                    ? new Date(task.dueDate).toLocaleDateString('pt-PT')
                                    : '-------'}
                                </td>

                                <td><span className={`status-tag status-${task?.status_id}`}>{task?.status?.status}</span></td>


                                <td>
                                    {
                                        task.status_id != 3 ?
                                            <button className="check" onClick={(e) => { e.stopPropagation(); checkTask(task) }}><FaCheck /></button>
                                            : null
                                    }

                                    <button className="edit" onClick={(e) => { handleEditModalStatus(task); e.stopPropagation() }}><FaPencilAlt /></button>
                                    <button className="delete" onClick={(e) => { e.stopPropagation(); handleRemoveTask(task) }}><FaTrash /></button>
                                </td>
                            </tr>
                        ))
                    }

                </tbody>
            </table>
        </>
    );
}

const SubtasksList = ({ subtasks, fetchProject, taskId, handleModal }: SubtaskListProps) => {

    const [showEditForm, setShowEditForm] = useState(false)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>()
    const { user } = useUser()

    const handleRemoveSubtask = async (subtask: Subtask) => {
        try {

            const confirmDelete = window.confirm("Pretende eliminar esta subtarefa?");

            if (!confirmDelete) return;


            const result = await removeSubtask(Number(user?.id), Number(subtask?.task_id), Number(subtask.id));
            const body = await result.json();

            if (result.ok) {
                toast.success(body.message);
                handleModal();
                fetchProject()

            } else {
                toast.error(body.message);
            }

        } catch (error) {
            toast.error('Erro ao remover subtarefa!')
            console.error(error);
        }
    }

    const checkSubtask = async (subtask: Subtask) => {

        const data = { status: 1 }

        try {
        
            const result = await editSubtask(data, Number(subtask?.id), Number(user?.id), Number(taskId));

            const body = await result.json();

            if (result.ok) {
                toast.success(body.message);
                handleModal();
                fetchProject();
            } else {
                toast.error(body.message);
            }

        } catch (error) {
            toast.error('Erro!')
            console.error(error);
        } 
    }

    return (
        showEditForm ? (
            <SubtaskForm subtask={selectedSubtask || null} setForm={setShowEditForm} taskId={taskId} fetchProject={fetchProject} handleModal={handleModal}/>
        ) : showCreateForm ? (
            <SubtaskForm subtask={null} setForm={setShowCreateForm} taskId={taskId} fetchProject={fetchProject} handleModal={handleModal}/>
        ) : (
            <div className="subtasks-list">
                {subtasks.map((subtask: Subtask, i: number) => (
                    <div
                        style={
                            subtask.status === 1
                                ? { backgroundColor: 'rgb(125, 228, 125)' }
                                : {}
                        }
                        className="subtask"
                        key={subtask.id ?? i}
                    >
                        <p>{subtask.title}</p>
                        <div className="subtask-actions">
                            {subtask.status === 0 && (
                                <button onClick={() => checkSubtask(subtask)} style={{ backgroundColor: 'var(--success-color)' }}>
                                    <FaCheck />
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    setShowEditForm(true);
                                    setSelectedSubtask(subtask);
                                }}
                                style={{ backgroundColor: 'rgb(234, 199, 61)' }}
                            >
                                <FaPencilAlt />
                            </button>
                            <button
                                onClick={() => handleRemoveSubtask(subtask)}
                                style={{ backgroundColor: 'var(--error-color)' }}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
                <button onClick={() => setShowCreateForm(true)}>Adicionar</button>
            </div>
        )
    );
}

const TaskForm = ({ members, selectedTask, handleModalStatus, fetchProject, projectId }: FormProps) => {
    const [loading, setLoading] = useState(false)
    const { user } = useUser();

    const handleSubmitTaskForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { title, description, assign, priority, dueDate, status } = e.currentTarget.elements as any;

        const data = { title: title.value, description: description.value, user_id: assign.value, priority_id: priority.value, dueDate: dueDate.value, status_id: status.value }

        setLoading(true);

        try {
            var result = null;

            if (selectedTask) {
                result = await editTask(data, Number(selectedTask?.id), Number(user?.id), Number(selectedTask?.project_id));
            } else {
                result = await createTask(data, Number(user?.id), Number(projectId));
            }

            const body = await result.json();

            if (result.ok) {
                toast.success(body.message);
                fetchProject();
                handleModalStatus(null);
            } else {
                toast.error(body.message);
            }


        } catch (error) {
            toast.error('Erro ao editar Tarefa!')
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmitTaskForm}>
            <div className="form-group">
                <label htmlFor="title">Título</label>
                <input type="text" name="title" placeholder="Título" defaultValue={selectedTask?.title || ""} required />
            </div>
            <div className="form-group">
                <label htmlFor="description">Descrição</label>
                <textarea rows={3} name="description" placeholder="Descrição" defaultValue={selectedTask?.description || ""}></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="assign">Atribuir</label>
                <select name="assign" defaultValue={selectedTask?.user_id || ""} required>
                    <option value="" disabled>Selecione um membro</option>
                    {
                        members.map((member, i) => (
                            <option key={i} value={member.user_id}>{member.user.first_name + ' ' + member.user.last_name}</option>
                        ))
                    }

                </select>
            </div>
            <div className="form-group">
                <label htmlFor="priority">Prioridade</label>
                <select name="priority" defaultValue={selectedTask?.priority_id || ""}>
                    <option value={1}>Baixa</option>
                    <option value={2}>Média</option>
                    <option value={3}>Alta</option>
                    <option value={4}>Urgente</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="dueDate">Data limite</label>
                <input type="date" name="dueDate" placeholder="Data" defaultValue={selectedTask?.dueDate || ""} />
            </div>
            <div className="form-group">
                <label htmlFor="status">Estado</label>
                <select name="status" defaultValue={selectedTask?.status_id || 1}>
                    <option value={1}>Por Fazer</option>
                    <option value={2}>Em Andamento</option>
                    <option value={3}>Conluído</option>
                </select>
            </div>
            {
                selectedTask ?
                    <button type="submit">{!loading ? 'Editar' : 'A editar...'}</button>
                    :
                    <button type="submit">{!loading ? 'Criar' : 'A criar...'}</button>
            }
        </form>
    )
}


const SubtaskForm = ({ subtask, setForm, taskId, fetchProject, handleModal}: SubtaskFormProps) => {

    const [loading, setLoading] = useState(false);
    const {user} = useUser()

    const handleSubmitSubtaskForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { title, description, status } = e.currentTarget.elements as any;

        const data = { title: title.value, description: description.value, status: status.value }

        setLoading(true);

        try {
            var result = null;

            if (subtask) {
                result = await editSubtask(data, Number(subtask?.id), Number(user?.id), Number(taskId));
            } else {
                result = await createSubtask(data, Number(user?.id), Number(taskId));
            }

            const body = await result.json();

            if (result.ok) {
                toast.success(body.message);
                setForm(false);
                handleModal();
                fetchProject();
            } else {
                toast.error(body.message);
            }


        } catch (error) {
            toast.error('Erro!')
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmitSubtaskForm}>
            <div className="form-group">
                <label htmlFor="title">Título</label>
                <input type="text" name="title" placeholder="Título" defaultValue={subtask?.title || ""} required />
            </div>
            <div className="form-group">
                <label htmlFor="description">Descrição</label>
                <textarea rows={5} name="description" placeholder="Descrição" defaultValue={subtask?.description || ""}></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="status">Estado</label>
                <select name="status" defaultValue={subtask?.status || 0}>
                    <option value={0}>Por Fazer</option>
                    <option value={1}>Concluída</option>
                </select>
            </div>
            {
                subtask ?
                    <button type="submit">{!loading ? 'Editar' : 'A editar...'}</button>
                    :
                    <button type="submit">{!loading ? 'Criar' : 'A criar...'}</button>
            }
        </form>
    )
}

export default ProjectView;
