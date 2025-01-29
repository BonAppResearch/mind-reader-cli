const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function runCommand(command) {
    try {
        const { stdout, stderr } = await exec(command);
        if (stderr) {
            throw new Error(stderr);
        }
        return stdout;
    } catch (error) {
        throw error;
    }
}

module.exports = runCommand;