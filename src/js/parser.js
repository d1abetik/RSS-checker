export default (xml) => {
  const parser = new DOMParser();
  const res = parser.parseFromString(xml, 'application/xml');
  return res;
};