import {readFileSync} from "fs";

interface Configuration {

  discord: {
    applicationId: string;
    botId: string;
    token: string;
  };

  web: {
    port: number;
    hostStatic: boolean;
    staticDirectory: string;
  };

  redis: {
    host: string;
    port: number;
    password: string;
    prefix: string;
  };

  sounds: {
    [key: string]: {
      name: string;
      paths: string[];
    };
  };
}

export const config: Configuration = JSON.parse(readFileSync("./config.json").toString());
