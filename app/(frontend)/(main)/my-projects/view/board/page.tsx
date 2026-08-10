'use client';
import { Project, Task } from "@/app/types/next-project"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getProject, editTask } from "@/app/services/projects";
import toast from "react-hot-toast";
import Filters from "@/app/(frontend)/components/filters";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useUser } from "@/app/context/UserContext";
import ReturnButton from "@/app/(frontend)/components/returnButton"

interface ColumnProps {
    title: string,
    tasks: Task[],
    id: number,
    fetchProject: () => Promise<void>
}

interface TasksBoardProps {
    tasks: Task[],
    fetchProject: () => Promise<void>;
}

const Board = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('project');
    const [project, setProject] = useState<Project>({
        id: 0,
        title: '',
        description: '',
        owner_id: 0,
        tasks: [],
        project_members: [],
    });
    const [loading, setLoading] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);


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

    return (
        <div className="board-container">
            <h2>{project?.title}</h2>

            <Filters tasks={project.tasks || []} members={project.project_members || []} setFilteredTasks={setFilteredTasks} />
            <TasksBoard tasks={filteredTasks || []} fetchProject={fetchProject}/>
            <ReturnButton />

        </div>
    )
}

const TasksBoard = ({ tasks, fetchProject }: TasksBoardProps) => {
    return (
        <div className="board">
            <Column id={1} title="Por Fazer" tasks={tasks.filter(t => t.status_id == 1)} fetchProject={fetchProject}/>
            <Column id={2} title="Em Andamento" tasks={tasks.filter(t => t.status_id == 2)} fetchProject={fetchProject}/>
            <Column id={3} title="Concluído" tasks={tasks.filter(t => t.status_id == 3)} fetchProject={fetchProject}/>
        </div>
    )
}

const Column = ({ id, title, tasks, fetchProject }: ColumnProps) => {

    const {user} = useUser()

    const handleTaskStatus = async (task: Task, status_id: number) => {
        const data = { status_id: status_id }
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
        <div className="column">
            <div className="status-title">
                <h3>{title}</h3>
            </div>
            <div className="tasks">
                {
                    tasks.map((task, i) => (
                        <div className="task" key={i}>

                            <button onClick={() => task.status_id && handleTaskStatus(task, task?.status_id - 1)} disabled={task.status_id == 1}><FaArrowLeft /></button>

                            <p>{task.title}</p>

                            <button onClick={() => task.status_id && handleTaskStatus(task, task?.status_id + 1)} disabled={task.status_id == 3}><FaArrowRight /></button>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default function BoardPage() {
  return (
    <Suspense fallback={<p className="alert">A carregar...</p>}>
      <Board />
    </Suspense>
  );
}