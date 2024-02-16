import axios from 'axios';
import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import { getFileHashSync, uuidv4, uploadToR2 } from '~/composables/fileUpload';

export default defineEventHandler(async event => {
	console.warn(`start request: ${event.path}`);
	const body = await readBody(event);
	if (!body) return new Response('Bad Request, url require', { status: 400 });
	const url = body.url;
	const startTime = Date.now();
	try {
		const endpoint = process.env.SCREEN_URL;
		if (!endpoint) {
			return new Response('SCREEN_URL is null, func disabled', { status: 400 });
		}

		const response = await axios.get(`${endpoint}/take`, {
			params: {
				url: url,
				'viewport-width': 1200,
				'viewport-height': 600,
				width: 1600,
				'max-height': 900,
				'delay-ms': 3000,
			},
			responseType: 'arraybuffer',
		});

		console.warn('header: ', response.headers);
		if (response.headers['content-type'] === 'image/png') {
			const publicDir = path.join(process.cwd(), 'public');
			const filePath = path.join(publicDir, `${uuidv4()}.png`);
			console.warn('save screen to :', filePath);

			// 将 fs.writeFile 包装成 Promise
			const writeFilePromise = new Promise((resolve, reject) => {
				fs.writeFile(filePath, response.data, 'binary', err => {
					if (err) {
						console.error('save screen fail', err);
						reject(err);
					} else {
						const fileHash = getFileHashSync(filePath);
						console.warn('file hash:', fileHash);
						const previewUrl = uploadToR2(filePath, `${fileHash}.png`, 'screenshot');
						console.log('previewUrl:', previewUrl);
						resolve(previewUrl);
					}
				});
			});

			// 等待写入操作完成，并返回 previewUrl
			const previewUrl = await writeFilePromise;
			return previewUrl;
		}

		const endTime = Date.now();
		const elapsedTime = endTime - startTime;
		console.warn(`request: ${event.path} takes ${elapsedTime} ms`);
	} catch (error) {
		return error;
	}
});
