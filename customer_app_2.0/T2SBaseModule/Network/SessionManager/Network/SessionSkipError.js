import { Constants } from '../../../Utils/Constants';

class SessionSkipError extends Error {
    constructor(message = Constants.SESSION_SKIPPED, ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SessionSkipError);
        }

        this.name = Constants.SESSION_SKIPPED;
        this.message = Constants.SESSION_SKIPPED;
        this.date = new Date();
    }
}

export default SessionSkipError;
