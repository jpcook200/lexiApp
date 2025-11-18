// installationId.js
import * as SecureStore from "expo-secure-store";
import { v4 as uuidv4 } from "uuid";

export async function getInstallationId() {
    let existing = await SecureStore.getItemAsync("installation-id");

    if (!existing) {
        const newId = uuidv4();  // generates unique ID
        await SecureStore.setItemAsync("installation-id", newId);
        return newId;
    }

    return existing;
}
