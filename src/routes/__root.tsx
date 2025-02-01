import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DialogContainer } from '../components/DialogContainer';
import { DialogContextProvider, AuthContextProvider } from '../context';

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <>
      <AuthContextProvider>
        <QueryClientProvider client={queryClient}>
          <DialogContextProvider>
            <main className="container mx-auto flex flex-col items-center">
              <Outlet />
            </main>
            <DialogContainer />
          </DialogContextProvider>
        </QueryClientProvider>
      </AuthContextProvider>
      <TanStackRouterDevtools />
    </>
  ),
});
