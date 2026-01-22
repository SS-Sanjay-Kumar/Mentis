import { Inngest } from 'inngest';

import { connectDB } from './db.js';
import User from '../models/User.js';
import { upsertStreamUser, deleteStreamUser } from './stream.js';
export const inngest = new Inngest({ id: "mentis" });

const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { email_addresses, first_name, last_name, image_url, id } = event.data
        await connectDB();
        // create user in DB
        const userAlreadyExists = await User.findOne({ clerkId: id });
        if (userAlreadyExists) {
            return { status: "already-synced" };
        }
        const newUser = {
            name: `${first_name || ""} ${last_name || ""}`,
            email: email_addresses[0]?.email_address, // since it is an array, [0]-> primary email address 
            profilePic: image_url,
            clerkId: id,
        };
        await User.create(newUser);

        // create user in STREAM(getstream.io)
        await upsertStreamUser({
            id: newUser.clerkId.toString(),
            name: newUser.name,
            image: newUser.profilePic,
        });
    },
);

const deleteUserFromDB = inngest.createFunction(
    { id: "delete-user-from-db" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { id } = event.data
        await connectDB();
        // delete user from DB
        await User.deleteOne({ clerkId: id });

        // delete user from STREAM
        await deleteStreamUser(id.toString());
    },
);

export const functions = [syncUser, deleteUserFromDB];