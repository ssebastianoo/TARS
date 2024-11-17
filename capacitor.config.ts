import type { CapacitorConfig } from '@capacitor/cli';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const config: CapacitorConfig = {
	appId: 'com.gir8.TARS',
	appName: 'TARS',
	webDir: 'build',
	server:
		process.env.MODE === 'dev'
			? {
					url: process.env.DEV_SERVER,
					cleartext: true
				}
			: undefined,
	android: {
		buildOptions: {
			keystorePath: process.env.KEYSTORE,
			keystorePassword: process.env.KEY_PASSWORD,
			keystoreAlias: 'tars-key',
			keystoreAliasPassword: process.env.KEY_PASSWORD
		}
	},
	ios: {
		contentInset: 'always'
	}
};

export default config;
