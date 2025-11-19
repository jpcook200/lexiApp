// installationId.js
import { randomUUID } from 'expo-crypto';
import * as SecureStore from "expo-secure-store";

export async function getInstallationId() {
    let existing = await SecureStore.getItemAsync("installation-id");

    if (!existing) {
        const newId = randomUUID();
        await SecureStore.setItemAsync("installation-id", newId);
        return newId;
    }

    return existing;
}
