// import libs
const AWS = require('aws-sdk');
const fs = require('fs');

//
// S3 Utils
//

/**
 * Init S3 client
 * @param {Object} params
 * @param {string} params.endpoint
 * @param {string} params.acccessKeyId
 * @param {string} params.secretAccessKey
 */
const init = (params = {}) => {
	return new AWS.S3({
		endpoint: params.endpoint || process.env.S3_ENDPOINT,
		accessKeyId: params.acccessKeyId || process.env.S3_ACCESS_KEY,
		secretAccessKey: params.secretAccessKey || process.env.S3_SECRET_KEY,
		//below is required for minio S3 server
		s3ForcePathStyle: true,
		signatureVersion: 'v4',
	});
};

/**
 * Check if S3 keys are populated in env
 */
const check = () => {
	return new Promise((resolve, reject) => {
		if (process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY) {
			resolve('S3 init success!');
		} else {
			reject('No S3 keys!');
		}
	});
};

/**
 * Upload function. Takes bucket from env if not specified
 * @param {string} bucket - Bucket for file to be uploaded
 * @param {AWS.S3} s3
 */
const upload = (bucket = null, s3) => {
	/**
	 * Uploads to S3
	 * @param {File} file
	 */
	const closure = async (file) => {
		return new Promise((resolve, reject) => {
			// Convert file to buffer
			fs.readFile(file.path, async (err, buff) => {
				if (null != err) {
					reject(err);
				}
				const key = file.filename;
				// Set S3 params
				const params = {
					Bucket: bucket || process.env.S3_BUCKET,
					Key: key,
					Body: buff,
					ACL: 'readonly', //special ACL for minio, 'public-read' for S3
					ContentType: file.mimetype,
					ContentLength: file.size,
				};
				// Start upload
				await s3.putObject(params, (err, result) => {
					if (err == null) {
						// Successful upload, return key name
						resolve(key);
					} else reject(err);
				});
			});
		});
	};
	return closure;
};

module.exports = { init, check, upload };
