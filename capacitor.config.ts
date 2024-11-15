import type { CapacitorConfig } from '@capacitor/cli';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const config: CapacitorConfig = {
	appId: 'com.gir8.TARS',
	appName: 'TARS',
	webDir: 'build',
	server: {
		url: process.env.DEV_SERVER,
		cleartext: true
	},
	android: {
		buildOptions: {
			keystorePath: 'tars-keystore.jks',
			keystorePassword: process.env.KEY_PASSWORD,
			keystoreAlias: 'tars-key',
			keystoreAliasPassword: process.env.KEY_PASSWORD
		}
	}
};

export default config;
