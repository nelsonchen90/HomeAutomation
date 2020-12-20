import Alexa from 'ask-sdk-core'
import { ExpressAdapter } from 'ask-sdk-express-adapter'
import axios from 'axios'
import { getSharedIO } from '../../../utils/socketIO.js'
import { usbSwitchPromise } from '../../../utils/usbSwitch.js'

const LaunchRequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle (handlerInput) {
    const speechText = 'Running Alexa skill on Raspberry pi.'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

const ToggleDecorLightIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
    Alexa.getIntentName(handlerInput.requestEnvelope) === 'ToggleDecorLightIntent'
  },
  async handle (handlerInput) {
    const targetValue = handlerInput.requestEnvelope.request.intent.slots.shouldOpen.value
    const { stdout } = await usbSwitchPromise(targetValue)
    let speechText
    if (stdout) {
      speechText = `The decor light turned ${targetValue}`
      const io = getSharedIO()
      if (io) {
        io.emit('component/usbSwitch', stdout)
      }
    } else {
      throw Alexa.createAskSdkError('Switch', `There is an error occurred while turinging ${targetValue} the decor light`)
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse()
  }
}

const turnOnLaptop = () => {
  return axios.post('https://homeautomationbox.com/api/v1/windowsSwitch/toggle')
    .then((response) => response.data.message)
    .catch((error) => error.response.data.errorMessage)
}

const TurnOnLaptopIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
    Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOnLaptopIntent'
  },
  async handle (handlerInput) {
    const speechText = await turnOnLaptop()
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse()
  }
}

const HelpIntentHandler = {
  canHandle (handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
          Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
  },
  handle (handlerInput) {
    const speakOutput = 'You can say things like: turn on the decor light, decor light switch, what is the status of the decor light, turn on my laptop'

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse()
  }
}

const CancelAndStopIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
  },
  handle (handlerInput) {
    const speechText = 'Goodbye!'

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .withShouldEndSession(true)
      .getResponse()
  }
}

const ErrorHandler = {
  canHandle () {
    return true
  },
  handle (handlerInput, error) {
    console.log(`Error handled: ${error.message}`)

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse()
  }
}

const SessionEndedRequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
  },
  handle (handlerInput) {
    // any cleanup logic goes here
    return handlerInput.responseBuilder.getResponse()
  }
}

const skillBuilder = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelpIntentHandler,
    ToggleDecorLightIntentHandler,
    TurnOnLaptopIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
const skill = skillBuilder.create()
export const adapter = new ExpressAdapter(skill, true, true)
