import {createServer} from './server';

async function main() {
    const server = await createServer();
    await server.startServer();
}

main();
