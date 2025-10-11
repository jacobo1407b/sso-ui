import React from 'react'
import { Card, CardBody, TableHeader, TableBody, Table, Pagination, TableColumn, TableRow, TableCell } from "@heroui/react";
import { Button, Input } from "@heroui/react"
import { SearchIcon } from "lucide-react";

interface Column {
    key: string;
    label: string;
}

interface PaginationProps {
    page: number;
    total: number;
    onChange: (page: number) => void;
}

interface ReusableTableCardProps<T> {
    columns: Column[];
    data: T[];
    rowKey: (row: T) => string | number;
    renderRow: (row: T) => React.ReactNode[];
    pagination?: PaginationProps;
    totalCount?: number;
    addButton?: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
    };
    searchPlaceholder?: string;
}

function IgTable<T>({
    columns,
    data,
    rowKey,
    renderRow,
    pagination,
    totalCount,
    addButton,
    searchPlaceholder
}: ReusableTableCardProps<T>) {
    return (
        <>
            <div className="flex justify-between gap-3 items-end">
                <Input
                    isClearable
                    classNames={{
                        base: "w-full sm:max-w-[44%]",
                        inputWrapper: "border-1",
                    }}
                    placeholder={searchPlaceholder}
                    size="sm"
                    startContent={<SearchIcon className="text-default-300" />}
                    variant="bordered"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            // Aquí va tu lógica
                            console.log("🔍 Ejecutar búsqueda con:");
                            // Por ejemplo: triggerSearch(e.target.value)
                        }
                    }}
                />
                <div className="flex gap-3">
                    {addButton && (
                        <Button
                            color="primary"
                            startContent={addButton?.icon}
                            onPress={addButton?.onClick}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl"
                        >
                            {addButton?.label}
                        </Button>
                    )}

                </div>
            </div>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardBody className="p-0">
                    <Table
                        aria-label="Tabla de dinamica"
                        bottomContent={
                            pagination && (
                                <div className="py-2 px-2 flex justify-between items-center">
                                    <Pagination
                                        isCompact
                                        showControls
                                        showShadow
                                        color="primary"
                                        page={pagination.page}
                                        total={pagination.total}
                                        onChange={pagination.onChange}
                                    />
                                    <span className="text-small text-default-400">
                                        Total: {totalCount ?? data.length}
                                    </span>
                                </div>
                            )
                        }
                        classNames={{
                            wrapper: "min-h-[222px]",
                        }}
                    >
                        <TableHeader>
                            {columns.map((col) => (
                                <TableColumn key={col.key}>{col.label}</TableColumn>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={rowKey(row)}>
                                    {renderRow(row).map((cell, idx) => (
                                        <TableCell key={idx}>{cell}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </>
    )
}

export default IgTable