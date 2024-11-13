import type { CapacitorConfig } from '@capacitor/cli';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('dev server');
console.log(process.env.DEV_SERVER);

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
