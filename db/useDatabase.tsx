const { useSQLiteContext } = require('expo-sqlite')

export type Word = { 
    id: number;
    word_id: number;
    user_id: number;
    learning_word: string;
    native_word: string;
    learning_language: string;
    native_language: string;
    learning_difficulty: 'a1' | 'a2' | 'a3' | 'b1' | 'b2' | 'c1' | 'c2';
    learned_at: string;
    favourite: number | boolean;
    learning_gender: string;
    native_definition: string;
    part_of_speech: string;
    learning_definition: string;
    learning_sentence: string;
    learning_pronunciation: string;
    native_pronunciation: string;
}

const useDatabase = () => { 
    const db = useSQLiteContext();

    const getLearnedWords = async (filters = { sortBy: 'dateAdded', favouritesOnly: false }) => {
        try {
            const userResults = await db.getFirstAsync('SELECT * FROM users WHERE id = ?', [1])
            if (!userResults) {
                throw new Error('User not found');
            }
            let query = `SELECT * FROM learned_words WHERE user_id = ? AND learning_language = ? AND native_language = ?`;
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

            const results = await db.getAllAsync(query, params);

            return results;

        } catch (error) {
            console.error('Error fetching learned words:', error);
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
                    favourite, learning_language, native_language
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
                    word.favourite === true ? 1 : 0,
                    userResults.learn_lang,
                    userResults.native_lang

                ]
            )
        } catch (error) {
            console.error('Error inserting word into learned_words:', error);
            throw error;
        }          
    };

    const getLearnedWordsIds = async () => {
        try {
            const userResults = await db.getFirstAsync('SELECT * FROM users WHERE id = ?', [1])
            
            if (!userResults) {
                throw new Error('User not found');
            }
            const results = await db.getAllAsync(
                `SELECT word_id FROM learned_words WHERE user_id = ? AND learning_language = ? AND native_language = ?`,
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
            // Fetch the user
            const userResults = await db.getFirstAsync('SELECT * FROM users WHERE id = ?', [1]);
            if (!userResults) {
                throw new Error('User not found');
            }

            // Build the base query
            let query = `
                SELECT * FROM learned_words 
                WHERE user_id = ? 
                AND learning_language = ? 
                AND native_language = ?
                `;

            // Add difficulty condition if provided
            const params = [1, userResults.learn_lang, userResults.native_lang];
            if (difficultyLevel && difficultyLevel !== '') {
                query += ` AND learning_difficulty = ?`;
                params.push(difficultyLevel.toLowerCase());
            }

            // Add ordering and limit
            query += ` ORDER BY RANDOM() LIMIT ?`;
            params.push(Number(limit) || 100);

            // Execute query
            const results = await db.getAllAsync(query, params);
            return results || [];
        } catch (error) {
            console.error('Error fetching practice words:', error);
            throw error;
        }
    };

    const getDailyLearnedCount = async () => {
        try {
            const userResults = await db.getFirstAsync('SELECT * FROM users WHERE id = ?', [1])
            if (!userResults) {
                throw new Error('User not found');
            }
            const result = await db.getFirstAsync(
                `SELECT COUNT(*) as count FROM daily_words WHERE user_id = ? AND learned = 1 AND native_language = ? AND learning_language = ?`, 
                [1, userResults.native_lang, userResults.learn_lang]
            );
            return result.count || 0;
        } catch (error) {
            console.error('Error fetching daily learned count:', error);
            throw error;
        }
        
    };

    const toggleFavourite = async (wordId: string, isFavourite: 0 | 1) => { 
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
        } catch (error) {
            console.error('Error setting learning language:', error);
            throw error;
        }
    };

    const setWordsPerDay = async (wordsPerDay: string) => { 
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
            const userResults = await db.getFirstAsync('SELECT * FROM users WHERE id = ?', [1])
            if (!userResults) {
                throw new Error('User not found');
            }
            const results = await db.getAllAsync(
                `SELECT * FROM daily_words WHERE user_id = ? AND learning_language = ? AND native_language = ? ORDER BY RANDOM()`,
                [1, userResults.learn_lang, userResults.native_lang]
            );
            return results;
        } catch (error) {
        }
    };

    const deleteAllFromDailyWords = async () => { 
        try {
            const userResults = await db.getFirstAsync('SELECT * FROM users WHERE id = ?', [1])
            if (!userResults) {
                throw new Error('User not found');
            }
            await db.runAsync(
                `DELETE FROM daily_words WHERE user_id = ? AND learning_language = ? AND native_language = ?`,
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
                    `INSERT OR IGNORE INTO daily_words (word_id, user_id, learning_language, native_language, native_word, learning_word, learning_pronunciation, native_pronunciation, part_of_speech, native_definition, learning_definition, learning_difficulty, learning_sentence, learning_gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        word.id,
                        1,
                        userResults.learn_lang,
                        userResults.native_lang,
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

    const markAsLearned = async (wordId) => {
        try {
            const userResults = await db.getFirstAsync('SELECT * FROM users WHERE id = ?', [1])
            if (!userResults) {
                throw new Error('User not found');
            }
            
            await db.runAsync(
                `UPDATE daily_words SET learned = 1 WHERE user_id = ? AND learning_language = ? AND native_language = ? AND word_id = ?`,
                [1, userResults.learn_lang, userResults.native_lang, wordId]
            );
            
        } catch (error) {
            console.error('Error marking daily word as learned:', error);
            throw error;
        }
    }

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
            const userResults = await db.runAsync('UPDATE users SET difficulty_level = ? WHERE id = ?', [newDifficultyLevel, 1])
            if (!userResults) {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error('Error increasing difficulty level:', error);
            throw error;
        }
    };

    const setLastSet = async () => { 
        try {
            const userResults = await db.runAsync(
                'UPDATE users SET last_set = ?, difficulty_level = ? WHERE id = ?',
                [1, 'c2', 1]
            );
            if (!userResults) {
                throw new Error('User not found');
            }
        }
        catch (error) {  
            console.error('Error setting last set:', error);
            throw error;
        }
    }



    return {setLastSet, increaseDifficultyLevel, markAsLearned, deleteAllFromDailyWords, insertIntoLearnedWords, getLearnedWords, getLearnedWordsIds, toggleFavourite, getDailyLearnedCount, setNativeLanguage, setLearningLanguage, setWordsPerDay, getPracticeWords, setDifficultyLevel, setRemindersOn, getDailyWords, saveDailyWords };
}

export default useDatabase;