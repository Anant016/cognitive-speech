import * as request from "request";
import { config } from "./config";
import * as fileHelpers from "./fileHelpers";
import * as vkbeautify from "vkbeautify";
import * as querystring from "querystring";
import * as fs from "fs";

// getLanguagesForTranslate();
function getLanguagesForTranslate() {
  const requestOptions = getRequestOptions();
  request.get(
    config.speech.translateTextAPI.endPoint + "/GetLanguagesForTranslate",
    requestOptions,
    logOutput
  );
}

// getLanguagesForTranslateWithAccessToken();
function getLanguagesForTranslateWithAccessToken() {
  getAccessToken().then(accessToken => {
    const requestOptions: request.CoreOptions = {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    };
    request.get(
      config.speech.translateTextAPI.endPoint + "/GetLanguagesForTranslate",
      requestOptions,
      logOutput
    );
  });
}

// getLanguageNames('en');
// getLanguageNames('de');
// getLanguageNames('es');
function getLanguageNames(locale: string) {
  const requestOptions = getRequestOptions();
  requestOptions.headers["Content-Type"] = "text/xml";
  requestOptions.body = `<ArrayOfstring 
                            xmlns:i="http://www.w3.org/2001/XMLSchema-instance"  
                            xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
                            <string>zh</string>
                            <string>en</string>
                        </ArrayOfstring>`;

  request.post(
    config.speech.translateTextAPI.endPoint +
      "/GetLanguageNames?locale=" +
      locale,
    requestOptions,
    logOutput
  );
}

const inputString = "I am so hungry, but I am stuck recording this course";

// translate(inputString, 'en', 'de');
// translate(inputString, 'en', 'hi');
// translate(inputString, 'en', 'no');
// translate(inputString, 'en', 'ru');

function translate(inputText: string, from: string, to: string) {
  const requestOptions = getRequestOptions();
  const params = {
    from: from,
    to: to,
    text: inputText
  };

  request.get(
    config.speech.translateTextAPI.endPoint +
      "/Translate?" +
      querystring.stringify(params),
    requestOptions,
    logOutput
  );
}

function breakSentences(longText: string) {
  const requestOptions = getRequestOptions();
  request.get(
    config.speech.translateTextAPI.endPoint +
      '/BreakSentences?text="' +
      encodeURIComponent(longText) +
      '"&language=en',
    requestOptions,
    logOutput
  );
}

// translateArray();
function translateArray() {
  const requestOptions = getRequestOptions();
  requestOptions.headers["Content-Type"] = "text/xml";
  requestOptions.body = `
    <TranslateArrayRequest>
    <AppId />
    <From>en</From>
    <Options>
        <Category xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2">general</Category>
        <ContentType xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2">text/plain</ContentType>
    </Options>
    <Texts>
    <string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">Translation services is pretty good.</string>
    <string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">However you are not fooling me for a human just yet.</string>
    <string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">It does convey the meaning however.</string>
    </Texts>
    <To>de</To>
    </TranslateArrayRequest>`;

  request.post(
    config.speech.translateTextAPI.endPoint + "/TranslateArray",
    requestOptions,
    logOutput
  );
}
// ----------------------------------------------------------------

// getLanguagesForSpeak();
function getLanguagesForSpeak() {
  const requestOptions = getRequestOptions();
  request.get(
    config.speech.translateTextAPI.endPoint + "/GetLanguagesForSpeak",
    requestOptions,
    logOutput
  );
}

speakText("This is test of speech recognition", "en");
function speakText(inputText: string, inputLanguage: string) {
  const requestOptions = getRequestOptions();
  const params = {
    text: inputText,
    language: inputLanguage,
    format: "audio/mp3"
  };

  const uri =
    config.speech.translateTextAPI.endPoint +
    "/Speak?" +
    querystring.stringify(params);

  request.get(uri, requestOptions).pipe(fs.createWriteStream("./output.mp3"));
}

function getAccessToken(): Promise<string> {
  const promise = new Promise<string>((resolve, reject) => {
    const authRequestOptions = getRequestOptions();
    request.post(
      config.speech.translateTextAPI.authEndPoint + "/issueToken",
      authRequestOptions,
      (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body);
        }
      }
    );
  });
  return promise;
}

function logOutput(err: any, response: request.Response, body: any) {
  console.log(vkbeautify.xml(body));
}

function getRequestOptions() {
  const requestOptions: request.CoreOptions = {
    headers: {
      "Ocp-Apim-Subscription-Key": config.speech.translateTextAPI.key1
    }
  };
  return requestOptions;
}
