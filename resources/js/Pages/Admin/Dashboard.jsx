import React, { useState, useEffect } from "react";
import { Inertia } from '@inertiajs/inertia';

export default function AdminDashboard({ auth}) {
    const handleLogout = () => {
        Inertia.post('/logout');
    };
    
    return (
        <div>
            <h1>Admin Dashboard</h1>
        </div>
    )
}