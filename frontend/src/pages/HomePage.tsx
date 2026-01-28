import React from 'react'
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignOutButton,
    UserButton,

} from '@clerk/clerk-react'

function HomePage() {
    return (
        <div>
            <SignedIn>
                <h1 >Welcome to mentis</h1>
                <SignOutButton className="btn btn-accent" />
            </SignedIn>

            <SignedOut>
                <SignInButton />
            </SignedOut>
            < UserButton />
        </div>
    )
}

export default HomePage