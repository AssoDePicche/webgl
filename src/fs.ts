export const getFileContents = async (URL: string): Promise<string> => await fetch(URL).then((resource) => resource.text());
