import { CompletedType, CountType, User, Word } from "@/types/types";
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
                console.log(word.learn_lang)
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

    const getPracticeWords = async (limit = 100, difficultyLevel = '') => { 
        try {
            
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1]);
            if (!userResults) {
                throw new Error('User not found');
            }

            let query = `
                SELECT * FROM learned_words 
                WHERE user_id = ? 
                AND learn_lang = ? 
                AND native_lang = ?
                `;

            const params = [1, userResults.learn_lang, userResults.native_lang];
            if (difficultyLevel && difficultyLevel !== '') {
                query += ` AND learning_difficulty = ?`;
                params.push(difficultyLevel.toLowerCase());
            }

            // Add ordering and limit
            query += ` ORDER BY RANDOM() LIMIT ?`;
            params.push(Number(limit) || 100);

            // Execute query
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

    const markAsLearned = async (wordId: number) => {
        try {
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1])
            if (!userResults) {
                throw new Error('User not found');
            }
            
            await db.runAsync(
                `UPDATE daily_words SET learned = 1 WHERE user_id = ? AND learn_lang = ? AND native_lang = ? AND word_id = ?`,
                [1, userResults.learn_lang, userResults.native_lang, wordId]
            );
            

        } catch (error) {
            
            console.error('Error marking daily word as learned:', error);
            throw error;
        }
    };

    const increaseDifficultyLevel = async (difficultyLevel: string) => {
        if(!difficultyLevel) return;
        
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
            await db.withTransactionAsync(async () => {
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
            });
            
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

    const insertStreakRecord = async () => {
        const date = DateTime.now().toISODate();
        const yesterday = DateTime.now().minus({ days: 1 }).toISODate();
        try {
            
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1]);
            if (!userResults) {
                throw new Error('User not found');
            }
            const userLangPair = `${userResults.native_lang}-${userResults.learn_lang}`;

            await db.runAsync(
                `INSERT OR IGNORE INTO streak (user_id, date, completed, lang_pair_code) VALUES (?, ?, ?, ?)`,
                [1, date, 0, userLangPair]
            );

            await db.runAsync(
                `INSERT OR IGNORE INTO streak_counts (user_id, lang_pair_code, current, longest) VALUES (?, ?, ?, ?)`,
                [1, userLangPair, 0, 0]
            );

            const allStreaks = await db.getAllAsync(`SELECT * FROM streak WHERE lang_pair_code = ?`, [userLangPair]);

            if (allStreaks.length > 1) {
                const yesterDayCompleted = await db.getFirstAsync(
                    `SELECT completed FROM streak WHERE user_id = ? AND date = ? AND completed = 1 AND lang_pair_code = ?`,
                    [1, yesterday, userLangPair]
                );
                console.log('Yesterday completed:', yesterDayCompleted);

                if (!yesterDayCompleted) {
                    await db.runAsync('UPDATE streak_counts SET longest = current WHERE current > longest AND lang_pair_code = ?', [userLangPair]);
                    await db.runAsync(
                        `UPDATE streak_counts SET current = 0 WHERE lang_pair_code = ?`,
                        [userLangPair]
                    );
                }

            }
            
            const result = await db.getFirstAsync(
                `SELECT * FROM streak WHERE user_id = ? AND lang_pair_code = ?`,
                [1, userLangPair]
            );
            
            console.log('Streak record inserted or already exists:', result);
            
        } catch (error) {
            
            console.error('Error inserting streak record:', error);
            throw error;
        }
    };

    const updateStreakRecord = async (completed: 0 | 1, date: string) => {
        try {
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1]);
            if (!userResults) {
                throw new Error('User not found');
            }
            const userLangPair = `${userResults.native_lang}-${userResults.learn_lang}`;
            
            await db.runAsync(
                `UPDATE streak SET completed = ? WHERE user_id = ? AND date = ? AND lang_pair_code = ?`,
                [completed, 1, date, userLangPair]
            );
            
            console.log('Streak record updated successfully for date:', date);
        } catch (error) {
            console.error('Error updating streak record:', error);
            throw error;
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

            const results = await db.getAllAsync(
                `SELECT * FROM streak WHERE user_id = ? AND lang_pair_code = ? AND date BETWEEN ? AND ? ORDER BY date ASC`,
                [1, userLangPair, sevenDaysAgo, today]
            );

            
            return results;
        } catch (error) {
            
            console.error('Error fetching weekly streak:', error);
            throw error;
        }
    };

    const updateStreakCount = async (instruction: 'increment' | 'reset' | 'decrement') => {
        const today = DateTime.now().toISODate();
        
        try {
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1]);
            if (!userResults) {
                throw new Error('User not found');
            }
            const userLangPair = `${userResults.native_lang}-${userResults.learn_lang}`;
            
            const results = await db.getFirstAsync<CompletedType>("SELECT completed FROM streak WHERE user_id = ? AND date = ? ORDER BY date DESC", [1, today]);
            switch (instruction) {
                case 'increment':
                    if (results?.completed === 0) {
                        await db.runAsync(`
                            UPDATE streak_counts SET current = current + 1 WHERE lang_pair_code = ?`,
                            [userLangPair]);
                    }
                    break;
                case 'reset':
                    console.log('Resetting streak count for lang pair:', userLangPair);
                    await db.runAsync(
                        `UPDATE streak_counts SET current = 0 WHERE lang_pair_code = ?`,
                        [userLangPair]
                    );
                    break;
                case 'decrement':
                    if (results?.completed === 1) {
                        await db.runAsync(`UPDATE streak_counts SET current = CASE WHEN current > 0 THEN current - 1 ELSE 0 END WHERE lang_pair_code = ?`, [userLangPair]);
                    }
                    break;
                default:
                    console.log('Invalid instruction for updating streak count.');
                    return;
            }
            
            console.log('Streak count increased successfully.');
            
        } catch (error) {
            console.error('Error increasing streak count:', error);
            
            throw error;
        }
    };

    const getStreakCount = async () => {
        try {
            
            const userResults = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [1]);
            if (!userResults) {
                throw new Error('User not found');
            }
            const userLangPair = `${userResults.native_lang}-${userResults.learn_lang}`;
            const result = await db.getFirstAsync(
                `SELECT * FROM streak_counts WHERE user_id = ? AND lang_pair_code = ?`,
                [1, userLangPair]
            );
            console.log('Fetched streak count:', result);
            
            return result;
        } catch (error) {
            
            console.error('Error fetching streak count:', error);
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
                `UPDATE users SET last_set = 0, difficulty_level = 'a1' WHERE id = 1`,
                [nativeLang, learnLang]
            );

            console.log(`Progress reset for language pair: ${langPairCode}`);
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

    
    return { setTutorialCompleted, insertDifficultyLevel, saveLastFetchedDate, resetProgressByLanguagePair, getStreakCount, getLearnedWordsByTimeframe, updateStreakCount, getWeeklyStreak, updateStreakRecord, insertStreakRecord, saveLastCard, setLastSet, increaseDifficultyLevel, markAsLearned, deleteAllFromDailyWords, insertIntoLearnedWords, getLearnedWords, getLearnedWordsIds, toggleFavourite, getDailyLearnedCount, setNativeLanguage, setLearningLanguage, setWordsPerDay, getPracticeWords, setDifficultyLevel, setRemindersOn, getDailyWords, saveDailyWords };
}

export default useDatabase;