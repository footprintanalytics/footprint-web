class Dfs {
  constructor() {
    this.isDAG = true;
    this.graph = {};
    this.visited = {};
  }

  // 是否有环
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

    // 保证每个节点都遍历到，排除有的结点没有边的情况
    for (let i = 0; i < nodes.length; i++) {
      // 该节点被访问过，跳过它
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
      this.visited[nodes[i]] = 0; // 初始数据，表示一开始所有顶点都未被访问过
    }
  }

  _DFS(i, nodes) {
    // 设置结点 i 变为访问过的状态
    this.visited[nodes[i]] = 1;
    for (let j = 0, len = nodes.length; j < len; j++) {
      // 如果当前结点有指向的结点
      if (this.graph[nodes[i]][nodes[j]] !== 0) {
        // 并且已经被访问过
        if (this.visited[nodes[j]] === 1) {
          this.isDAG = false; // 有环
          break;
        } else if (this.visited[nodes[j]] === -1) {
          continue; // 当前结点后边的结点都被访问过，直接跳至下一个结点
        } else {
          this._DFS(j, nodes)
        }
      }
    }
    // 遍历过所有相连的结点后，把本节点标记为 -1
    this.visited[nodes[i]] = -1;
  }
}

export default Dfs;
