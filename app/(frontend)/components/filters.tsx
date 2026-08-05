import { Task, Member } from "@/app/types/next-project";
import { FaSearch } from "react-icons/fa";

interface FiltersProps {
    tasks: Task[];
    members: Member[];
    setFilteredTasks: (tasks: Task[]) => void;
}

const Filters = ({ tasks, members, setFilteredTasks }: FiltersProps) => {

    const handleFilterChange = (e: React.ChangeEvent<HTMLFormElement>) => {

        const {priority, status, assign, search} = e.currentTarget.elements as any

        let filtered = tasks;
    
        if (priority.value) {
            filtered = filtered.filter(task => task.priority_id == Number(priority.value));
        }

        if (status.value) {
            filtered = filtered.filter(task => task.status_id == Number(status.value));
        }

        if (assign.value) {
            filtered = filtered.filter(task => task.user_id == Number(assign.value));
        }

        if (search.value) {
            filtered = filtered.filter(task => task.title?.toLowerCase().includes(search.value.toLowerCase()));
        }

        setFilteredTasks(filtered)

    }

    return (
        <div className="filters">
            <form onChange={handleFilterChange}>
                <div className="filter-group">
                    <label htmlFor="priority">Prioridade</label>
                    <select name="priority" >
                        <option value="">Todas</option>
                        <option value={1}>Baixa</option>
                        <option value={2}>Média</option>
                        <option value={3}>Alta</option>
                        <option value={4}>Urgente</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="status">Estado</label>
                    <select name="status" >
                        <option value="">Todos</option>
                        <option value={1}>Por Fazer</option>
                        <option value={2}>Em Andamento</option>
                        <option value={3}>Conluído</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="assign">Atríbuida</label>
                    <select name="assign">
                        <option value="">Todos</option>
                        {
                            members.map((member, i) => (
                                <option key={i} value={member.user.id}>{member.user.first_name + " " + member.user.last_name}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="search">Pesquisar</label>
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            id="search"
                            name="search"
                            placeholder="Pesquisar..."
                        />
                        <FaSearch className="search-icon" />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Filters