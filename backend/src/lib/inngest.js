import { Inngest } from 'inngest';

import { connectDB } from './db.js';
import User from '../models/User.js';

export const inngest = new Inngest({ id: "mentis" });

const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { email_addresses, first_name, last_name, image_url, id } = event.data
        await connectDB();
        const userAlreadyExists = await User.findOne({ clerkId: id });
        if (userAlreadyExists) {
            return { status: "already-synced" };
        }
        const newUser = new User({
            name: `${first_name.trim() || ""} ${last_name.trim() || ""}`,
            email: email_addresses[0]?.email_address, // since it is an array, [0]-> primary email address 
            profilePic: image_url,
            clerkId: id,
        })
        await User.create(newUser);
    },
);

export const functions = [syncUser];