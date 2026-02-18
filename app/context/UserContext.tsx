import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { getUser } from "../services/user";
import { Anybody } from "next/font/google";

type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  image_url?: string | null;
  tag?: string | null;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
  fetchUser: (id: string) => void;
  loading: boolean
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => { },
  fetchUser: () => { },
  loading: false
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async (id: string) => {
    if (id) {
      setLoading(true);
      try {
        const res = await getUser(id);
        const data = await res.json();

        if(res.ok){
          setUser(data.user);
        }else{
          toast.error(data.message);
        }
      } catch(err) {
        console.log(err);
        toast.error('Erro ao procurar utilizador');
      }finally{
        setLoading(false)
      }
      
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchUser(session?.user?.id);
    }
  }, [session]);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
