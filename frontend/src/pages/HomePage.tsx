import React from 'react'
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignOutButton,
    UserButton,

} from '@clerk/clerk-react'
import toast from 'react-hot-toast'

function HomePage() {
    return (
        <div>
            <button className='btn btn-ghost' onClick={() => toast.success("Clicked")}>Click</button>
            <SignedIn>
                <h1 >Welcome to mentis</h1>
                <div className="btn btn-accent">
                    <SignOutButton />
                </div>
            </SignedIn>

            <SignedOut>
                <SignInButton />
            </SignedOut>
            < UserButton />
        </div>
    )
}

export default HomePage