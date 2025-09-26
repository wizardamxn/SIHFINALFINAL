import { execCommand } from "../utils/files.mjs";
import path from 'path';
import os from 'os';

const getPhonemes = async ({ message }) => {
  try {
    const time = new Date().getTime();
    console.log(`Starting conversion for message ${message}`);

    const isWindows = os.platform() === 'win32';
    const ffmpegCommand = isWindows
      ? `ffmpeg -y -i audios\\message_${message}.mp3 audios\\message_${message}.wav`
      : `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`;

    await execCommand({ command: ffmpegCommand });
    console.log(`Conversion done in ${new Date().getTime() - time}ms`);

    const rhubarbPath = isWindows ? 'bin\\rhubarb.exe' : './bin/rhubarb';
    const rhubarbCommand = isWindows
      ? `${rhubarbPath} -f json -o audios\\message_${message}.json audios\\message_${message}.wav -r phonetic`
      : `${rhubarbPath} -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`;

    await execCommand({ command: rhubarbCommand });
    console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
  } catch (error) {
    console.error(`Error while getting phonemes for message ${message}:`, error);
  }
};

export { getPhonemes };