import { UAParser } from 'ua-parser-js';

function UserAgentDetails({ userAgent }) {
    if (!userAgent) {
        return <span>No User Agent Available</span>;
    }

    // Parse the user agent string
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return (
        <div>
            <div><strong>Browser:</strong> {result.browser.name} {result.browser.version}</div>
            <div><strong>OS:</strong> {result.os.name} {result.os.version}</div>
            <div><strong>Device:</strong> {result.device.vendor || 'Unknown'} {result.device.model || ''}</div>
            <div><strong>Engine:</strong> {result.engine.name} {result.engine.version}</div>
        </div>
    );
}

export default UserAgentDetails;