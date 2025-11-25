import RNFS from 'react-native-fs';

const ttsCacheDir = `${RNFS.CachesDirectoryPath}/ttsCache`;

export const createDirectory = async () => {
  try {
    const dirExists = await RNFS.exists(ttsCacheDir);
    if (!dirExists) {
      await RNFS.mkdir(ttsCacheDir);
    } 
  } catch (error) {
    console.error('Error creating TTS cache directory:', error);
  }
};

export const deleteDirectory = async () => {
  try {
    const exists = await RNFS.exists(ttsCacheDir);
    if (exists) {
      await RNFS.unlink(ttsCacheDir);
    } 
  } catch (error) {
    console.error('Error deleting TTS cache directory:', error);
    throw error;
  }
};


export const createAudioFile = async (base64Audio: string, fileName: string, languageCode: string) => {
  try {
    // Language-specific directory
    const languageDir = `${ttsCacheDir}/${languageCode}`;

    // Ensure main cache directory exists
    if (!(await RNFS.exists(ttsCacheDir))) {
      await RNFS.mkdir(ttsCacheDir);
    }

    // Ensure language directory exists
    if (!(await RNFS.exists(languageDir))) {
      await RNFS.mkdir(languageDir);
    }

    // Full path to file inside language folder
    const filePath = `${languageDir}/${fileName}.mp3`;

    // Skip if file already exists
    if (await RNFS.exists(filePath)) {
      return filePath;
    }

    // Write Base64 audio to file
    await RNFS.writeFile(filePath, base64Audio, 'base64');

    return filePath;
  } catch (error) {
    console.error('Error creating audio file:', error);
    throw error;
  }
};


export const getAudioFile = async (fileName: string, lang:string): Promise<string | null> => {
  try {
    const filePath = `${ttsCacheDir}/${lang}/${fileName}.mp3`;
    const fileExists = await RNFS.exists(filePath);
      if (fileExists) {
      return 'file://' + filePath;
    }
    return null; // File doesn't exist
  } catch (error) {
    console.error('Error getting audio file URI:', error);
    return null;
  }
};
