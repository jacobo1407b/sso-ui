// components/UserManagementHeader.tsx
"use client"
import { useRouter } from 'next/navigation';
import React from "react";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";


interface UserManagementHeaderProps {
    title: string;
    subtitle: string;
    isProfile?: boolean;
    actions?: React.ReactNode;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
    title,
    subtitle,
    isProfile,
    actions
}) => {
    const router = useRouter();
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div className="flex items-center gap-4">
                {isProfile && (<Button
                isIconOnly
                variant="flat"
                onPress={() => router.back()}
                className="bg-default-100 hover:bg-default-200 rounded-xl"
            >
                <ArrowLeft className="w-5 h-5" />
            </Button>)}
            <div>
                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                <p className="text-default-500">{subtitle}</p>
            </div>
             </div>
            
            {actions && actions}
        </div>
    );
};

export default UserManagementHeader;
