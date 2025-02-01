// import { useAuth } from '../hooks';
// import { supabase } from '../utils';
// import { Button } from './Button';

export function Header() {
  // const { user } = useAuth();

  // const handleSignIn = async () => {
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: 'github',
  //   });
  //   if (error) {
  //     console.error(error);
  //   }
  // };

  // const handleSignOut = async () => {
  //   const { error } = await supabase.auth.signOut();
  //   if (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <header className="my-14 flex justify-around w-full items-center">
      <span className="text-6xl -translate-y-1 basis-28 text-right">👑</span>
      <h1 className="font-serif text-6xl">Sovereign</h1>
      <div className="w-28" />
      {/* {user ? (
        <Button
          variant="outlined"
          onClick={handleSignOut}
          padding="sm"
          className="translate-y-1 w-28"
        >
          Sign out
        </Button>
      ) : (
        <Button
          variant="outlined"
          onClick={handleSignIn}
          padding="sm"
          className="translate-y-1 w-28"
        >
          Sign in
        </Button>
      )} */}
    </header>
  );
}
