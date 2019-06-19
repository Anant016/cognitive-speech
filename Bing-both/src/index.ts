import * as request from "request";
import { config } from "./config";
import * as fileHelpers from "./fileHelpers";
import * as fs from "fs";

convertTextToSpeech("This is a test of text to speech");
function convertTextToSpeech(inputText: string) {
  const authRequestOptions: request.CoreOptions = {
    headers: {
      "Ocp-Apim-Subscription-Key": config.speech.bingSpeech.key1
    }
  };
  request.post(
    config.speech.bingSpeech.authEndPoint + "/issueToken",
    authRequestOptions,
    (err, response, body) => {
      const accessToken = response.body;

      const payLoad = `<speak version='1.0' xml:lang='en-US'>
            <voice xml:lang='en-US' xml:gender='Female' name='Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)'>
            ${inputText}
            </voice>
            </speak>`;

      const requestOptions: request.CoreOptions = {
        headers: {
          "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
          "Content-Type": "application/ssml+xml",
          Host: "speech.platform.bing.com",
          "Content-Length": payLoad.length,
          Authorization: "Bearer " + accessToken,
          "User-Agent": "NodeJS"
        },
        body: payLoad
      };

      request
        .post("https://speech.platform.bing.com/synthesize", requestOptions)
        .pipe(fs.createWriteStream(__dirname + "/output.mp3"));
    }
  );
}

// convertSpeechToText('audio.wav');
function convertSpeechToText(fileName: string) {
  const requestOptions: request.CoreOptions = {
    headers: {
      "Content-Type": "audio/wav; codec=audio/pcm; samplerate=16000",
      "Transfer-Encoding": "chunked",
      "Ocp-Apim-Subscription-Key": config.speech.bingSpeech.key1
    },
    body: fileHelpers.readFile(__dirname + "/" + fileName)
  };

  request.post(
    config.speech.bingSpeech.endPoint,
    requestOptions,
    (err, response, body) => {
      console.log(response.body);
    }
  );
}
