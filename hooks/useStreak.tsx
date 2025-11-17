import useDatabase from "@/db/useDatabase";

const useStreak = () => {
    const { initStreakRecord } = useDatabase();
    
    const initStreak = async () => {
        try {
            await initStreakRecord();
            
        } catch (error) {
            console.error("Error initializing streak record:", error);
            throw error;
        }
        
    }

    return { initStreak };
}