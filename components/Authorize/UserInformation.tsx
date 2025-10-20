import React from 'react'
import { Avatar, Chip } from "@heroui/react"


interface iUserInfoProps {
    userAvatar: string | undefined
    userName: string
    userEmail: string
}
function UserInformation({ userAvatar, userEmail, userName }: iUserInfoProps) {
    return (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <Avatar src={userAvatar} size="md" name={userName} />
            <div className="flex-1">
                <p className="font-semibold text-foreground">{userName}</p>
                <p className="text-sm text-default-500">{userEmail}</p>
            </div>
            <Chip size="sm" color="success" variant="flat">
                Conectado
            </Chip>
        </div>
    )
}

export default UserInformation