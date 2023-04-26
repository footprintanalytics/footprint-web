class Dfs {
  constructor() {
    this.isDAG = true;
    this.graph = {};
    this.visited = {};
  }

  isLoop(edges) {
    let result = false
    let nodes = [];
    edges.forEach(item => {
      const { source, target } = item;
      nodes.push(source);
      nodes.push(target);
    });
    nodes = [...new Set(nodes)];
    this._init(nodes, edges);

    for (let i = 0; i < nodes.length; i++) {
      if (this.visited[nodes[i]] === -1) {
        continue;
      }

      this._DFS(i, nodes);
      if (!this.isDAG) {
        result = true
        break;
      }
    }

    return result
  }

  _init(nodes, edges) {
    for (let i = 0; i < nodes.length; i++) {
      const pre = nodes[i];
      this.graph[pre] = {};
      for (let j = 0; j < nodes.length; j++) {
        const next = nodes[j];
        this.graph[pre][next] = 0;
      }
    }
    for (let k = 0; k < edges.length; k++) {
      const edge = edges[k];
      this.graph[edge.source][edge.target] = -1;
    }

    for (let i = 0; i < nodes.length; i++) {
      this.visited[nodes[i]] = 0;
    }
  }

  _DFS(i, nodes) {
    this.visited[nodes[i]] = 1;
    for (let j = 0, len = nodes.length; j < len; j++) {
      if (this.graph[nodes[i]][nodes[j]] !== 0) {
        if (this.visited[nodes[j]] === 1) {
          this.isDAG = false;
          break;
        } else if (this.visited[nodes[j]] === -1) {
          continue;
        } else {
          this._DFS(j, nodes)
        }
      }
    }
    this.visited[nodes[i]] = -1;
  }
}

export default Dfs;
