import { getAllUserAccounts } from "../api/data.js";
import { getActiveAccountId, setActiveAccountId } from "../state/sessionState.js";

export async function ensureActiveAccount(ctx, next) {
    const activeAccountId = getActiveAccountId();

    if (!activeAccountId) {
        const accounts = await getAllUserAccounts();
        const firstAccountId = accounts[0]?._id;

        if (firstAccountId) {
            setActiveAccountId(firstAccountId)
        }
    }
}