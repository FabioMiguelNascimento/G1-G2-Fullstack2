import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AccountSidebarProps {
    sectionContent: React.ReactNode;
    sectionName: string;
}

export default function AccountSidebar({
    sectionContent,
    sectionName,
}: AccountSidebarProps) {
    const isMobile = useIsMobile();
    console.log(sectionName)
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        {isMobile ? <SidebarTrigger className="-ml-1" /> : null}
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        {sectionName}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                {sectionContent}
            </SidebarInset>
        </SidebarProvider>
    );
}
