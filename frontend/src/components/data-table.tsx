import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "./ui/skeleton";

interface Column<T> {
    key: keyof T;
    header: string;
    render?: (value: any) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading: boolean;
    onError?: string | null;
}

export default function DataTable<T>({ data, columns, isLoading, onError }: DataTableProps<T>) {
    if (onError) {
        return <div>Error carregando os dados</div>;
    }

    if (isLoading) {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col, index) => (
                            <TableHead key={index}>{col.header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {columns.map((_, colIndex) => (
                                <TableCell key={colIndex}>
                                    <Skeleton className="h-4 w-[100px]" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((col, index) => (
                        <TableHead key={index}>{col.header}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {columns.map((col, colIndex) => (
                            <TableCell key={colIndex}>
                                {col.render ? col.render(item[col.key]) : String(item[col.key])}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export type { Column };
