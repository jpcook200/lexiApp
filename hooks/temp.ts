const handleDayComplete = async () => { 
        const date = new Date().toLocaleString('en-CA').split(',')[0];
        await updateStreakCount('increment');
        await updateStreakRecord(1, date);
}
    
    useEffect(() => {
        if (user && (progressToday >= user?.words_per_day && isInitialised)) {
            handleDayComplete();
        }
    }, [progressToday, user]);

      useFocusEffect(
        useCallback(() => {
            let isActive = true;
            
            const fetchAndNormalize = async () => {
                const results = await getWeeklyStreak(); // wait for async data
                const streakCountsResults = await getStreakCount();
                setStreakCounts({
                    current: streakCountsResults?.current || 0,
                    longest: Math.max(streakCountsResults?.longest, streakCountsResults?.current),
                });
                const normalizedResults = normalizeStreak(results);
                setStreakData(normalizedResults);
            };

            if (isActive) { 
                fetchAndNormalize();
            }

            return () => {
                isActive = false;
            };
        }, [])
    );