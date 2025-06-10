'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const MobileNavBar = dynamic(() => import('./MobileNavBar'), {
    ssr: false
});

export default function ClientLayout({ children }) {
    return (
        <>
            <div className="pb-16 md:pb-0"> {/* Add padding at bottom for mobile nav */}
                {children}
            </div>
            <MobileNavBar />
        </>
    );
}
