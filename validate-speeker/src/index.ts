import { config } from "./config";
import * as fileHelpers from "./fileHelpers";
import * as identification from "./IdentificationHelper";
import { RequestStatus } from "./BusinessObjects";

// identification.createIdentificationProfile().then(identificationProfile => {
//     console.log(identificationProfile);
// });

// identification.createEnrollment('/Data/Sahil/1.wav', sahilIdentificationProfile).then((result:RequestStatus) => {
//     console.log('1.wav is enrolled');
// });

// identification.createEnrollment('/Data/Sahil/2.wav', sahilIdentificationProfile)
//     .then((result: RequestStatus) => {
//         console.log('2.wav is enrolled');
//     });

// identification.createIdentificationProfile().then(identificationProfile => {
//     console.log(identificationProfile);
// });

// identification.createEnrollment('/Data/Jill/1.wav', jillIdentificationProfile).then((result:RequestStatus) => {
//     console.log('1.wav is enrolled');
// });

const jillIdentificationProfile = "7bd438a6-271c-4c4e-b23f-faea99c3734c";
const sahilIdentificationProfile = "fa946a80-b0db-4a34-bcbd-9bce15576f71";

// identification.identifySpeaker(
//     'jill_input.wav',
//     sahilIdentificationProfile + ',' + jillIdentificationProfile).then((result: RequestStatus) => {
//         console.log(`Identified profile is: ${result.processingResult.identifiedProfileId} and the confidence is: ${result.processingResult.confidence}`);
//     });

identification.deleteIdentificationProfile(sahilIdentificationProfile);
identification.deleteIdentificationProfile(jillIdentificationProfile);
