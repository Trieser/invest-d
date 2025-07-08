import React, { useState, useEffect } from "react";
import { Inertia } from '@inertiajs/inertia';

export default function UserDashboard({ auth }) {
    const handleLogout = () => {
        Inertia.post('/logout');
    };

    return (
        <div>
            <h1>User Dashboard</h1>
        </div>
    )
}