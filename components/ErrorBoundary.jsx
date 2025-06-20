'use client'
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                        <h2 className="text-2xl font-semibold text-red-600 mb-4">
                            Something went wrong
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {this.state.error?.message || 'An unexpected error occurred.'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Reload page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}


export default ErrorBoundary;