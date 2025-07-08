import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Sidebar from '../../Components/Sidebar';

export default function Genres({ auth, genres = [], activeGenres = [] }) {
    const [newGenreName, setNewGenreName] = useState('');
    const [editingGenre, setEditingGenre] = useState(null);
    const [editName, setEditName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleAddGenre = async (e) => {
        e.preventDefault();
        if (!newGenreName.trim()) return;
        
        setIsSubmitting(true);
        try {
            await Inertia.post('/user/genres', { name: newGenreName });
            setNewGenreName('');
        } catch (error) {
            console.error('Error adding genre:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditGenre = async (e) => {
        e.preventDefault();
        if (!editName.trim() || !editingGenre) return;
        
        setIsSubmitting(true);
        try {
            await Inertia.put(`/user/genres/${editingGenre.id}`, { name: editName });
            setEditingGenre(null);
            setEditName('');
        } catch (error) {
            console.error('Error updating genre:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteGenre = async (genreId) => {
        if (!confirm('Are you sure you want to delete this genre?')) return;
        
        setIsSubmitting(true);
        try {
            await Inertia.delete(`/user/genres/${genreId}`);
        } catch (error) {
            console.error('Error deleting genre:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEditing = (genre) => {
        setEditingGenre(genre);
        setEditName(genre.name);
    };

    const cancelEditing = () => {
        setEditingGenre(null);
        setEditName('');
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <Sidebar 
                auth={auth}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeGenres={activeGenres}
                currentPage="genres"
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-0">
                {/* Top Bar */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-6">
                        <div className="flex items-center">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h2 className="text-xl font-semibold text-gray-900">Genre Management</h2>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                {auth.user.name}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Add New Genre */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-2xl">➕</span> Add New Genre
                            </h2>
                            <form onSubmit={handleAddGenre} className="flex gap-4">
                                <input
                                    type="text"
                                    value={newGenreName}
                                    onChange={(e) => setNewGenreName(e.target.value)}
                                    placeholder="Enter genre name..."
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="submit"
                                    disabled={!newGenreName.trim() || isSubmitting}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Adding...' : 'Add Genre'}
                                </button>
                            </form>
                        </div>

                        {/* Genres List */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="text-2xl">🏷️</span> Available Genres ({genres.length})
                            </h2>
                            
                            {genres.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📝</div>
                                    <p className="text-gray-500 mb-4">No genres available yet.</p>
                                    <p className="text-sm text-gray-400">Add your first genre above to get started!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {genres.map((genre) => (
                                        <div key={genre.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            {editingGenre?.id === genre.id ? (
                                                <form onSubmit={handleEditGenre} className="flex items-center gap-4 flex-1">
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        disabled={isSubmitting}
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={!editName.trim() || isSubmitting}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                                                    >
                                                        {isSubmitting ? 'Saving...' : 'Save'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={cancelEditing}
                                                        disabled={isSubmitting}
                                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors disabled:opacity-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                </form>
                                            ) : (
                                                <>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                            <span className="text-green-600 font-semibold text-sm">
                                                                {genre.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">{genre.name}</h3>
                                                            <p className="text-sm text-gray-500">
                                                                {genre.photos_count || 0} photos
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => startEditing(genre)}
                                                            disabled={isSubmitting}
                                                            className="text-blue-600 hover:text-blue-700 px-3 py-1 rounded hover:bg-blue-50 transition-colors disabled:opacity-50"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteGenre(genre.id)}
                                                            disabled={isSubmitting}
                                                            className="text-red-600 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Instructions */}
                        <div className="bg-blue-50 rounded-xl p-6 mt-8 border border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                <span className="text-xl">💡</span> How to use genres
                            </h3>
                            <div className="space-y-2 text-sm text-blue-800">
                                <p>• Genres help you organize your photos by category</p>
                                <p>• When uploading photos, you'll be asked to select a genre</p>
                                <p>• You can edit or delete genres that aren't being used by any photos</p>
                                <p>• Popular genres include: Landscape, Portrait, Wildlife, Street, etc.</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
} 