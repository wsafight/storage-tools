export const invariant = (condition: boolean, errorMsg: string) => {
  if (condition) {
    throw new Error(errorMsg);
  }
}