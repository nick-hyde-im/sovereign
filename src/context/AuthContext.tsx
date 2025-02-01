import * as React from 'react';
import { supabase } from '../utils';

interface User {
  name: 'Alex Nicholas';
  avatar: 'https://avatars.githubusercontent.com/u/100680756?v=4';
}

interface AuthContextValue {
  user: User | null;
}

export const AuthContext = React.createContext<AuthContextValue>({ user: null });

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user?.identities?.[0]?.identity_data;
      if (!user) return;
      setUser({
        name: user.name,
        avatar: user.avatar_url,
      });
    };
    loadUser();
  }, []);

  React.useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        const user = session?.user.identities?.[0]?.identity_data;
        if (!user) return;
        setUser({
          name: user.name,
          avatar: user.avatar_url,
        });
      }

      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
