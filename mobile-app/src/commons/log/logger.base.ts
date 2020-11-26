function logErrorAndReturn(message: string, ...args: any) {
  console.log(message, ...args);
  return new Error(message);
}

function logInfoAndReturn(message: string, ...args: any) {
  console.log(message, ...args);
  return new Error(message);
}

function logWarningAndReturn(message: string, ...args: any) {
  console.log(message, ...args);
  return new Error(message);
}

export { logErrorAndReturn, logInfoAndReturn, logWarningAndReturn };
