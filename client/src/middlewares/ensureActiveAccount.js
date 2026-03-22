import { getAllUserAccounts } from "../api/data.js";
import { getActiveAccountId, setActiveAccountId } from "../state/sessionState.js";

export async function ensureActiveAccount() {
    const activeAccountId = getActiveAccountId();

    if (!activeAccountId) {
        const accounts = await await getAllUserAccounts({ isArchived: false });
        const firstAccountId = accounts[0]?._id;

        if (firstAccountId) {
            setActiveAccountId(firstAccountId)
        }
    }
}