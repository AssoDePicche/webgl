export const getFileContents = async (URL) => await fetch(URL).then((resource) => resource.text());
