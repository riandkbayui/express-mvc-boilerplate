import fs from 'fs';
import path from 'path';

export const dependencies = [
    {
        path: "controllers",
        collections: new Map()
    },
    {
        path: "middlewares",
        collections: new Map()
    }
];

/** @returns {Array} */
function getFilesRecursively(dir) {
    dir = path.join(process.cwd(), "src", dir)
    const stack = [dir];
    const fileList = [];

    while (stack.length > 0) {
        const currentDir = stack.pop();
        const files = fs.readdirSync(currentDir);

        for (const file of files) {
            const fullPath = path.join(currentDir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                stack.push(fullPath);
            } else {
                const cleanPath = fullPath.replace(path.join(process.cwd(), 'src'), '').replaceAll('\\', '/').replace('.js', '').substring(1)
                fileList.push(cleanPath);
            }
        }
    }

    return fileList;
}

export default async function load() {
    for(let dep of dependencies) {
        let files = getFilesRecursively(dep.path);
        for(let file of files) {
            if(!dep.collections.has(file)) {
                let instance = await import(`../${file}.js`);
                dep.collections.set(file, instance);
            }
        }
    }
    return dependencies;
}