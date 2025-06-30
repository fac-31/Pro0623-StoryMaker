let logs: string[] = [];

export function addLog(message: string) {
	logs.push(message);
	if (logs.length > 100) logs = logs.slice(-100);
}

export function getLogs() {
	return logs;
}
