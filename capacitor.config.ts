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
	}
};

export default config;
