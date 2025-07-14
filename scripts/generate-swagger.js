import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_DIR = path.join(__dirname, '..', 'src', 'routes', 'api');
const SWAGGER_FILE = path.join(__dirname, '..', 'swagger.yaml');

function parseRouteFile(filePath) {
	const content = fs.readFileSync(filePath, 'utf8');
	const routes = {};

	// Parse GET requests
	const getMatch = content.match(/export (const|async function) GET[^{]+{/);
	if (getMatch) {
		routes.get = {
			summary: 'Get request',
			responses: {
				200: {
					description: 'Successful response'
				},
				500: {
					description: 'Server error',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error'
							}
						}
					}
				}
			}
		};
	}

	// Parse POST requests
	const postMatch = content.match(/export (const|async function) POST[^{]+{/);
	if (postMatch) {
		routes.post = {
			summary: 'Post request',
			responses: {
				200: {
					description: 'Successful response'
				},
				500: {
					description: 'Server error',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error'
							}
						}
					}
				}
			}
		};
	}

	// Add parsing for other HTTP methods as needed

	return routes;
}

function generateSwaggerPaths(dir, basePath = '') {
	const paths = {};

	const items = fs.readdirSync(dir);

	for (const item of items) {
		const itemPath = path.join(dir, item);
		const stat = fs.statSync(itemPath);

		if (stat.isDirectory()) {
			const subPaths = generateSwaggerPaths(itemPath, path.join(basePath, item));
			Object.assign(paths, subPaths);
		} else if (item === '+server.ts') {
			const routePath = basePath.replace(/\[(\w+)\]/g, '{$1}');
			paths[`/api${routePath}`] = parseRouteFile(itemPath);
		}
	}

	return paths;
}

// Read existing Swagger file
const swaggerContent = yaml.load(fs.readFileSync(SWAGGER_FILE, 'utf8'));

// Generate paths
const paths = generateSwaggerPaths(API_DIR);

// Update Swagger content
swaggerContent.paths = paths;

// Write updated Swagger file
fs.writeFileSync(SWAGGER_FILE, yaml.dump(swaggerContent));

console.log('Swagger file updated successfully!');
