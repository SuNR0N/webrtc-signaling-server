import axios from 'axios';

import { AppConfig } from '../config';
import { Tokens } from '../models/twilio/tokens';

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = AppConfig;

class TwilioService {
  private _baseUri = 'https://api.twilio.com';

  async getTokens() {
    const { data } = await axios.post<Tokens>(`${this._baseUri}/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Tokens.json`, undefined, {
      auth: {
        username: TWILIO_ACCOUNT_SID,
        password: TWILIO_AUTH_TOKEN,
      },
    });
    return data;
  }
}

export const twilioService = new TwilioService();
