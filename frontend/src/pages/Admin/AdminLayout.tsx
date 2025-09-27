import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import useAuthContext from '@/hooks/useAthContext';
import { Outlet } from 'react-router-dom';

function AdminLayout() {
    const { user } = useAuthContext()
    const sidebarState = document.cookie
    .split("; ")
    .find((row) => row.startsWith("sidebar_state"))
    ?.split("=")[1] === "true"
    
    if (!user) return <div>Acesso negado</div>;

    return (
        <SidebarProvider defaultOpen={sidebarState}>
            <AppSidebar />
            <SidebarInset>
                <section className='p-6'>
                    <Outlet />
                </section>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default AdminLayout