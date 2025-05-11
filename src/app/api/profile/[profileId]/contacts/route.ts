// src/pages/api/contacts/[profileId]/contacts.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { profileId } = req.query;

    if (!profileId || typeof profileId !== 'string') {
        return res.status(400).json({ error: 'Invalid profileId' });
    }

    try {
        const apiResponse = await axios.get(
            `${process.env.API_URL}/profile/${profileId}/contacts`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: req.headers.cookie ?? '', // forward cookies to preserve session
                },
                withCredentials: true,
            }
        );
        res.status(200).json(apiResponse.data);
    } catch (err: any) {
        console.error('Error in API route:', err.message);
        res.status(err.response?.status || 500).json({ error: err.message });
    }
}
