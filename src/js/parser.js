export default (xml) => {
  const parser = new DOMParser();
  const res = parser.parseFromString(xml, 'application/xml');

  const feeds = {
    title: res.querySelector('channel title').textContent,
    description: res.querySelector('channel description').textContent,
  };

  const posts = [...res.querySelectorAll('item')]
    .map((item) => ({
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    }));

  return { feeds, posts };
};
