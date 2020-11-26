function logErrorAndReturn(message: string, ...args: any) {
  console.error(message, ...args);
  return new Error(message);
}

function logInfoAndReturn(message: string, ...args: any) {
  console.info(message, ...args);
  return new Error(message);
}

function logWarningAndReturn(message: string, ...args: any) {
  console.warn(message, ...args);
  return new Error(message);
}

export { logErrorAndReturn, logInfoAndReturn, logWarningAndReturn };
