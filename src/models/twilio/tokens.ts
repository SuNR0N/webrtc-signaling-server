interface ICEServer {
  url: string;
  urls: string;
  username?: string;
  credential?: string;
}

export interface Tokens {
  account_sid: string;
  date_created: string;
  date_updated: string;
  ice_servers: ICEServer[];
  password: string;
  ttl: string;
  username: string;
}
