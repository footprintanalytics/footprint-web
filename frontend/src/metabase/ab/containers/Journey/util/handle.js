let arrayData = [];

const getData = (nodes, links, firstEvent) => {
  arrayData.push(firstEvent)
  const array = [];
  links.forEach(item => {
    if (item.source.includes(firstEvent)) {
      array.push(item.target);
    }
  });
  if (array.length > 0) {
    array.forEach(item => {
      getData(nodes, links, item)
    })
  }
}

const handleErrorNodes = (nodes, links, firstEvent) => {
  let result = nodes;
  arrayData = [];
  getData(nodes, links, firstEvent)
  result = result.filter(item => item.name === firstEvent || arrayData.includes(item.id));
  return result;
}

export default handleErrorNodes;
