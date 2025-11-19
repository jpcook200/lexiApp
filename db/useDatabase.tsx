import { freeWordsAllowance } from "@/constants/languages";
import { CompletedType, CountType, StreakRow, User, Word } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { DateTime } from "luxon";

const useDatabase = () => {
    const db = useSQLiteContext();
    const getLearnedWords = async (filters = { sortBy: 'dateAdded', favouritesOnly: false }) => {
        try {
            
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1])
            if (!userResults) {
                throw new Error('User not found');
            }
            let query = `SELECT * FROM learned_words WHERE user_id = ? AND learn_lang = ? AND native_lang = ?`;
            const params = [1, userResults.learn_lang, userResults.native_lang];

            if (filters.favouritesOnly) {
                query += ` AND favourite = 1`;
            }

            if (filters.sortBy === 'alphabetical') {
                query += ` ORDER BY learning_word COLLATE NOCASE ASC`;
            } else if (filters.sortBy === 'difficulty') {
                query += ` ORDER BY learning_difficulty ASC`;
            } else {
                query += ` ORDER BY learned_at DESC`;
            }

            const results = await db.getAllAsync<Word>(query, params);
            
            return results;

        } catch (error) {
            
            console.error('Error fetching learned words:', error);
            throw error;
        }
    };

    const getLearnedWordsByTimeframe = async () => {
        const today = DateTime.now().toISODate();
        const weekAgo = DateTime.now().minus({ days: 7 }).toISODate();

        try {
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1]);
            if (!userResults) {
                throw new Error('User not found');
            }

            const todayResults = await db.getFirstAsync<CountType>(
                `SELECT COUNT(*) as count 
                    FROM learned_words 
                    WHERE DATE(learned_at) = DATE(?) 
                    AND native_lang = ? 
                    AND learn_lang = ?`,
                [today, userResults.native_lang, userResults.learn_lang]
            );

            const pastWeekResults = await db.getFirstAsync<CountType>(
                `SELECT COUNT(*) as count 
                    FROM learned_words 
                    WHERE DATE(learned_at) BETWEEN DATE(?) AND DATE(?) 
                    AND native_lang = ? 
                    AND learn_lang = ?`,
                [weekAgo, today, userResults.native_lang, userResults.learn_lang]
            );

            const allTimeResults = await db.getFirstAsync<CountType>(
                `SELECT COUNT(*) as count 
                    FROM learned_words 
                    WHERE native_lang = ? 
                    AND learn_lang = ?`,
                [userResults.native_lang, userResults.learn_lang]
            );
            
            return { today: todayResults?.count || 0, pastWeek: pastWeekResults?.count || 0, allTime: allTimeResults?.count || 0 };

        } catch (error) {
            console.error('Error getting learned_words:', error);
            throw error;
        }
    };

    const insertIntoLearnedWords = async (word: Word) => {
        try {
            const userResults = await db.getFirstAsync('SELECT * FROM users WHERE id = ?', [1])
            if (!userResults) {
                throw new Error('User not found');
            }
            await db.runAsync(
                `INSERT into learned_words (
                    user_id, word_id, native_word, learning_word, learning_pronunciation,
                    native_pronunciation, part_of_speech, native_definition,
                    learning_definition, learning_difficulty, learning_sentence, learning_gender,
                    favourite, learn_lang, native_lang
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    1,
                    word.word_id,
                    word.native_word,
                    word.learning_word,
                    word.learning_pronunciation,
                    word.native_pronunciation,
                    word.part_of_speech,
                    word.native_definition,
                    word.learning_definition,
                    word.learning_difficulty,
                    word.learning_sentence,
                    word.learning_gender,
                    word.favourite,
                    word.learn_lang,
                    word.native_lang
                ]
            )

        } catch (error) {
            console.error('Error inserting word into learned_words:', error);
            throw error;
        }
    };

    const removeFromLearnedWords = async (wordId: number) => {
        try {
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1])
            
            if (!userResults) {
                throw new Error('User not found');
            }
            await db.runAsync(
                `DELETE FROM learned_words WHERE word_id = ? AND user_id = ? AND learn_lang = ? AND native_lang = ?`,
                [wordId, 1, userResults.learn_lang, userResults.native_lang]
            );
        } catch (error) {
            console.error('Error removing word from learned_words:', error);
            throw error;
        }
    }

    const insertDifficultyLevel = async (lang: string, level: string) => {
        try {
            await db.runAsync(
                `INSERT INTO difficulties (lang, level) VALUES (?, ?) ON CONFLICT(lang) DO UPDATE SET level = ?`,
                [lang, level, level]
            );
        } catch (error) {
            console.error('Error inserting difficulty level:', error);
            throw error;
        }
    }

    const getLearnedWordsIds = async () => {
        try {
            type WordIdResult = { word_id: number }
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1])
            
            if (!userResults) {
                throw new Error('User not found');
            }
            const results = await db.getAllAsync<WordIdResult>(
                `SELECT word_id FROM learned_words WHERE user_id = ? AND learn_lang = ? AND native_lang = ?`,
                [1, userResults.learn_lang, userResults.native_lang]
            );
            const mappedResults = results.map((result) => result.word_id);
            
            return mappedResults;
        } catch (error) {
            
            console.error('Error fetching learned words IDs:', error);
            throw error;
        }
    };

    const getPracticeWords = async (filters: { date: string | null; limit: number; difficulty?: string | null }) => {
        try {
            const userResults = await db.getFirstAsync<User>(
                'SELECT * FROM users WHERE id = ?',
                [1]
            );
            if (!userResults) throw new Error('User not found');

            let query = `
                SELECT * FROM learned_words
                WHERE user_id = ?
                AND learn_lang = ?
                AND native_lang = ?
            `;
            const params: any[] = [1, userResults.learn_lang, userResults.native_lang];

            // Filter by date if provided
            if (filters.date) {
                query += ` AND DATE(learned_at) = ?`;
                params.push(filters.date);
            }
            // Filter by difficulty if provided and not "all"
            if (filters.difficulty && filters.difficulty.toLowerCase() !== 'all') {
                console.log('Applying difficulty filter:', filters.difficulty);
                query += ` AND learning_difficulty = ?`;
                params.push(filters.difficulty.toLowerCase());
            }

            // Random order and limit
            if (filters.limit && filters.limit > 0) {
                query += ` ORDER BY RANDOM() LIMIT ?`;
                params.push(filters.limit);
            } else {
                query += ` ORDER BY RANDOM()`;
            }

            const results = await db.getAllAsync<Word>(query, params);
            return results || [];
        } catch (error) {
            console.error('Error fetching practice words:', error);
            throw error;
        }
    };


    const getDailyLearnedCount = async () => {
        try {
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1])
            if (!userResults) {
                throw new Error('User not found');
            }
            const result = await db.getFirstAsync<CountType>(
                `SELECT COUNT(*) as count FROM daily_words WHERE user_id = ? AND learned = 1 AND native_lang = ? AND learn_lang = ?`,
                [1, userResults.native_lang, userResults.learn_lang]
            );
            
            return result?.count || 0;
        } catch (error) {
            console.error('Error fetching daily learned count:', error);
            throw error;
        }
    };

    const toggleFavourite = async (wordId: number, isFavourite: 0 | 1) => {
        try {
            await db.runAsync(
                `UPDATE learned_words SET favourite = ? WHERE id = ?`,
                [isFavourite ? 0 : 1, wordId]
            );
        } catch (error) {
            console.error('Error toggling favourite status:', error);
            throw error;
        }
    };

    const setNativeLanguage = async (languageCode: string) => {
        try {
            await db.runAsync(
                `UPDATE users SET native_lang = ? WHERE id = ?`,
                [languageCode, 1]
            );
        } catch (error) {
            console.error('Error setting native language:', error);
            throw error;
        }
    };

    const setLearningLanguage = async (languageCode: string) => {
        try {
            await db.runAsync(
                `UPDATE users SET learn_lang = ? WHERE id = ?`,
                [languageCode, 1]
            );
            await insertDifficultyLevel(languageCode, 'a1');
        } catch (error) {
            console.error('Error setting learning language:', error);
            throw error;
        }
    };

    const setWordsPerDay = async (wordsPerDay: number) => {
        try {
            await db.runAsync(
                `UPDATE users SET words_per_day = ? WHERE id = ?`,
                [wordsPerDay, 1]
            );
        } catch (error) {
            console.error('Error setting words per day:', error);
            throw error;
        }
    };

    const saveLastFetchedDate = async () => {
        try {
            await db.runAsync(
                `UPDATE users SET last_fetched = datetime('now', 'localtime') WHERE id = ?`,
                [1]
            );
        } catch (error) {
            console.error('Error saving last fetched date:', error);
            throw error;
        }
    }

    const setDifficultyLevel = async (level: string) => {
        try {
            await db.runAsync(
                `UPDATE users SET difficulty_level = ? WHERE id = ?`,
                [level, 1]
            );
        } catch (error) {
            console.error('Error setting difficulty level:', error);
            throw error;
        }
    };

    const setRemindersOn = async (remindersOn: 0 | 1) => {
        try {
            await db.runAsync(
                `UPDATE users SET reminders_on = ? WHERE id = ?`,
                [remindersOn ? 1 : 0, 1]
            );
        } catch (error) {
            console.error('Error setting reminders on:', error);
            throw error;
        }
    };

    const getDailyWords = async () => {
        try {
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1])
            if (!userResults) {
                throw new Error('User not found');
            }
            const results = await db.getAllAsync<Word>(
                `SELECT * FROM daily_words WHERE user_id = ? AND learn_lang = ? AND native_lang = ? ORDER BY word_id ASC`,
                [1, userResults.learn_lang, userResults.native_lang]
            );
            
            return results;
        } catch (error) {
            
            console.error('Error fetching daily words:', error);
            throw error;
        }
    };

    const deleteAllFromDailyWords = async () => {
        try {
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1])
            if (!userResults) {
                throw new Error('User not found');
            }
            await db.runAsync(
                `DELETE FROM daily_words WHERE user_id = ? AND learn_lang = ? AND native_lang = ?`,
                [1, userResults.learn_lang, userResults.native_lang]
            );
            
            console.log('All daily words deleted successfully.');
        } catch (error) {
            console.error('Error deleting all from daily words:', error);
            throw error;
        }
    };

    const saveDailyWords = async (words: Word[]) => {
        try {
            const userResults = await db.getFirstAsync('SELECT * FROM users WHERE id = ?', [1])
            if (!userResults) {
                throw new Error('User not found');
            }

            const insertPromises = words.map((word) => {
                return db.runAsync(
                    `INSERT OR IGNORE INTO daily_words (word_id, user_id, learn_lang, native_lang, native_word, learning_word, learning_pronunciation, native_pronunciation, part_of_speech, native_definition, learning_definition, learning_difficulty, learning_sentence, learning_gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        word.id,
                        1,
                        word.learn_lang,
                        word.native_lang,
                        word.native_word,
                        word.learning_word,
                        word.learning_pronunciation,
                        word.native_pronunciation,
                        word.part_of_speech,
                        word.native_definition,
                        word.learning_definition,
                        word.learning_difficulty,
                        word.learning_sentence,
                        word.learning_gender
                    ]
                );
            });
            await Promise.all(insertPromises);

            const newData = await getDailyWords();
            console.log('Daily words saved successfully. Total words saved:', newData.length);
            
            return newData;
        } catch (error) {
            
            console.error('Error saving daily words:', error);
            throw error;
        }
    };

    const toggleLearned = async (wordId: number,) => {
        try {
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1])
            if (!userResults) {
                throw new Error('User not found');
            }
            
            await db.runAsync(
                `UPDATE daily_words
                SET learned = CASE learned
                    WHEN 1 THEN 0
                    ELSE 1
                    END
                WHERE user_id = ?
                    AND learn_lang = ?
                    AND native_lang = ?
                    AND word_id = ?`,
                [1, userResults.learn_lang, userResults.native_lang, wordId]
            );
        } catch (error) {
            console.error('Error marking daily word as learned:', error);
            throw error;
        }
    };

    const increaseDifficultyLevel = async (difficultyLevel: string) => {
        if (!difficultyLevel) return;
        
        const difficulties = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
  
        const currentIndex = difficulties.indexOf(difficultyLevel.toLowerCase())
        
        if (currentIndex === -1 || currentIndex === difficulties.length - 1 || currentIndex === 0) {
            console.log('Difficulty level is already at maximum or invalid.');
            return;
        }
        const newDifficultyLevel = difficulties[currentIndex - 1];
        try {
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1]);
            if (!userResults) {
                throw new Error('User not found');
            }
            await insertDifficultyLevel(userResults.learn_lang, newDifficultyLevel);
            
        } catch (error) {
            console.error('Error increasing difficulty level:', error);
            throw error;
        }
    };

    const setLastSet = async () => {
        try {
            
            const userResults = await db.getFirstAsync<User>(
                'SELECT * FROM users WHERE id = ?',
                [1]
            );
            if (!userResults) {
                throw new Error('User not found');
            }

            await db.runAsync(
                'UPDATE users SET last_set = ? WHERE id = ?',
                [1, 1]
            );

            await insertDifficultyLevel(userResults.learn_lang, 'c2');
            
            
        } catch (error) {
            console.error('Error setting last set (transaction rolled back):', error);
            throw error;
        }
    };


    const saveLastCard = async (wordId: number) => {
        try {
            await db.runAsync(
                `UPDATE users SET last_card_id = ? WHERE id = ?`,
                [wordId, 1]
            );
        } catch (error) {
            console.error('Error saving last card ID:', error);
            throw error;
        }
    };

    const updateStreakCount = async (instruction: 'increment' | 'reset' | 'decrement'): Promise<number> => {
        const today = DateTime.now().toISODate();

        try {
            const userResults = await db.getFirstAsync<User>(
                'SELECT * FROM users WHERE id = ?',
                [1]
            );
            if (!userResults) throw new Error('User not found');

            const userLangPair = `${userResults.native_lang}-${userResults.learn_lang}`;

            const results = await db.getFirstAsync<CompletedType>(
                `SELECT completed FROM streak 
                WHERE user_id = ? AND date = ? AND lang_pair_code = ? 
                ORDER BY date DESC`,
                [1, today, userLangPair]
            );

            switch (instruction) {
                case 'increment':
                    if (results?.completed === 0) {
                        await db.runAsync(
                            `UPDATE streak_counts 
                            SET current = current + 1 
                            WHERE lang_pair_code = ?`,
                            [userLangPair]
                        );
                    }
                    break;

                case 'reset':
                    await db.runAsync(
                        `UPDATE streak_counts 
                        SET current = 0 
                        WHERE lang_pair_code = ?`,
                        [userLangPair]
                    );
                    break;

                case 'decrement':
                    if (results?.completed === 1) {
                        await db.runAsync(
                            `UPDATE streak_counts 
                            SET current = CASE WHEN current > 0 THEN current - 1 ELSE 0 END 
                            WHERE lang_pair_code = ?`,
                            [userLangPair]
                        );
                    }
                    break;

                default:
                    console.log('Invalid instruction for updating streak count.');
                    return 0;
            }

            // Fetch and return the new streak count
            const updated = await db.getFirstAsync<{ current: number }>(
                `SELECT current FROM streak_counts WHERE lang_pair_code = ?`,
                [userLangPair]
            );

            return updated?.current ?? 0;

        } catch (error) {
            console.error('Error updating streak count:', error);
            throw error;
        }
    };


    const initStreakRecord = async () => {
        const date = DateTime.now().toISODate();
        const yesterday = DateTime.now().minus({ days: 1 }).toISODate();

        try {
            const userResults = await db.getFirstAsync<User>(
                'SELECT * FROM users WHERE id = ?',
                [1]
            );
            
            if (!userResults) throw new Error('User not found');

            const userLangPair = `${userResults.native_lang}-${userResults.learn_lang}`;

            // Insert today's record if missing
            await db.runAsync(
                `INSERT OR IGNORE INTO streak (user_id, date, completed, lang_pair_code) VALUES (?, ?, ?, ?)`,
                [1, date, 0, userLangPair]
            );

            // Total count (safe)
            const totalStreaks = await db.getFirstAsync<CountType>(
                `SELECT COUNT(*) as count FROM streak WHERE user_id = ? AND lang_pair_code = ?`,
                [1, userLangPair]
            );

            const totalCount = totalStreaks?.count ?? 0;

            // Check yesterday's record
            const yesterdayStreakRecord = await db.getAllAsync<StreakRow>(
                `SELECT * FROM streak WHERE user_id = ? AND lang_pair_code = ? AND date = ?`,
                [1, userLangPair, yesterday]
            );

            if (totalCount > 1) {
                if (
                    yesterdayStreakRecord.length === 0 ||
                    yesterdayStreakRecord[0].completed === 0
                ) {
                    await updateStreakCount('reset');
                }
            }

            await db.runAsync(
                `INSERT OR IGNORE INTO streak_counts (user_id, lang_pair_code, current, longest) VALUES (?, ?, ?, ?)`,
                [1, userLangPair, 0, 0]
            );

            console.log('Streak record initialized successfully:', date);

        } catch (error) {
            console.error('Error inserting streak record:', error);
            throw error;
        }
    };

    const updateStreakRecord = async (completed: 0 | 1): Promise<boolean> => {
        const date = DateTime.now().toISODate();

        try {
            const userResults = await db.getFirstAsync<User>(
                'SELECT * FROM users WHERE id = ?',
                [1]
            );

            if (!userResults) {
                throw new Error('User not found');
            }

            const userLangPair = `${userResults.native_lang}-${userResults.learn_lang}`;

            const result = await db.runAsync(
                `UPDATE streak SET completed = ? WHERE user_id = ? AND date = ? AND lang_pair_code = ?`,
                [completed, 1, date, userLangPair]
            );

            console.log('Streak record updated successfully for date:', date);

            return completed === 1;
        } catch (error) {
            console.error('Error updating streak record:', error);
            return false;
        }
        };


    const getWeeklyStreak = async () => {
        const today = DateTime.now().toISODate();
        const sevenDaysAgo = DateTime.now().minus({ days: 7 }).toISODate();
        try {
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1]);
            if (!userResults) {
                throw new Error('User not found');
            }
            const userLangPair = `${userResults.native_lang}-${userResults.learn_lang}`;

            const results = await db.getAllAsync<StreakRow>(
                `SELECT * FROM streak WHERE user_id = ? AND lang_pair_code = ? AND date BETWEEN ? AND ? ORDER BY date ASC`,
                [1, userLangPair, sevenDaysAgo, today]
            );
            console.log(results)
            return results;
        } catch (error) {
            
            console.error('Error fetching weekly streak:', error);
            throw error;
        }
    };

    const getStreakCount = async () => {
        type Streak = {
            current: number;
            longest?: number; // optional if not always present
        };
        try {
            
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1]);
            if (!userResults) {
                throw new Error('User not found');
            }
            const userLangPair = `${userResults.native_lang}-${userResults.learn_lang}`;
            const result = await db.getFirstAsync<Streak>(
                `SELECT * FROM streak_counts WHERE user_id = ? AND lang_pair_code = ?`,
                [1, userLangPair]
            )
            
            return result;
        } catch (error) {
            
            console.error('Error fetching streak count:', error);
            throw error;
        }
    };

    const getAllStreakCounts = async () => {
        try {
            const results = await db.getAllAsync<StreakRow>(
                `SELECT * FROM streak_counts WHERE user_id = ?`,
                [1]
            )
            
            return results; 
        }catch (error) {
            console.error('Error fetching all streak counts:', error);
            throw error;
        }
    };

    const resetProgressByLanguagePair = async (nativeLang: string, learnLang: string) => {
        const langPairCode = `${nativeLang}-${learnLang}`;

        try {
            await db.withTransactionAsync(async () => {
                await db.runAsync(
                    `DELETE FROM learned_words WHERE native_lang = ? AND learn_lang = ?`,
                    [nativeLang, learnLang]
                );

                await db.runAsync(
                    `DELETE FROM streak WHERE lang_pair_code = ?`,
                    [langPairCode]
                );

                await db.runAsync(
                    `DELETE FROM streak_counts WHERE lang_pair_code = ?`,
                    [langPairCode]
                );
            });

            await db.runAsync(
                `UPDATE users SET last_set = 0 WHERE id = 1`,
            );

            await db.runAsync(
                'UPDATE difficulties set level = ? WHERE lang = ?',
                ['a1', learnLang]
            )
        } catch (error) {
            console.error('Error resetting progress by language pair:', error);
            throw error;
        }
    };

    const setTutorialCompleted = async () => {
        try {
            await db.runAsync(
                `UPDATE users SET tutorial_completed = 1 WHERE id = ?`,
                [1]
            );
        } catch (error) {
            console.error('Error setting tutorial completed:', error);
            throw error;
        }
    }

    const setUserAccessLevel = async (accessLevel: string) => {
        try {
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1]);
            if (!userResults) {
                throw new Error('User not found');
            }

            await db.runAsync(
                `UPDATE users SET access_level = ? WHERE id = ?`,
                [accessLevel, 1]
            );
            
            if (userResults.words_per_day > freeWordsAllowance) {
                const userLearnedWordsCount = await db.getFirstAsync<CountType>(
                    `SELECT COUNT(*) as count FROM daily_words WHERE user_id = ? AND learn_lang = ? AND native_lang = ? AND learned = 1`,
                    [1, userResults.learn_lang, userResults.native_lang]
                );

                if (!userLearnedWordsCount || userLearnedWordsCount.count === undefined) { 
                    throw new Error('Could not retrieve learned words count');
                }

                if (userLearnedWordsCount.count >= freeWordsAllowance) { 
                    await updateStreakCount('increment');
                    await updateStreakRecord(1);
                }
                await setWordsPerDay(freeWordsAllowance);
            }
        } catch (error) {
            console.error('Error setting user access level:', error);
            throw error;
        }
    }

    const setUserWordsTotal = async (totalWords: number) => {
        try {
            await db.runAsync(
                `UPDATE users SET words_total = ? WHERE id = ?`,
                [totalWords, 1]
            );
        } catch (error) {
            console.error('Error setting user total words:', error);
            throw error;
        }
    }

   
    return {
        setUserWordsTotal,
        setUserAccessLevel,
        setTutorialCompleted,
        insertDifficultyLevel,
        saveLastFetchedDate,
        resetProgressByLanguagePair,
        getStreakCount,
        getLearnedWordsByTimeframe,
        updateStreakCount,
        getWeeklyStreak,
        updateStreakRecord,
        initStreakRecord,
        saveLastCard,
        setLastSet,
        increaseDifficultyLevel,
        toggleLearned,
        deleteAllFromDailyWords,
        insertIntoLearnedWords,
        getLearnedWords,
        getLearnedWordsIds,
        toggleFavourite,
        getDailyLearnedCount,
        setNativeLanguage,
        setLearningLanguage,
        setWordsPerDay,
        getPracticeWords,
        setDifficultyLevel,
        setRemindersOn,
        getDailyWords,
        saveDailyWords,
        removeFromLearnedWords,
        getAllStreakCounts
    };

}
    
export default useDatabase;