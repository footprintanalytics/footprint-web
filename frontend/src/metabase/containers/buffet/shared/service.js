import { KernelAPI, KernelManager } from "@jupyterlab/services";
import { jupyterServerUrl, jupyterToken } from "metabase/env";

let kernel_instance = null;

async function getServerConnectSettings(connInfo) {
  const serverSettings = {
    baseUrl: connInfo.baseUrl,
    appUrl: "",
    wsUrl: connInfo.baseUrl.replace("http", "ws"),
    token: connInfo.token,
    appendToken: true,
    init: { cache: "no-store", credentials: "same-origin" },
    WebSocket: WebSocket,
    fetch: fetch,
    Request: Request,
    Headers: Headers,
  };

  return serverSettings;
}

async function connectToKernel() {
  const server_url = jupyterServerUrl;
  const token = jupyterToken;

  if (kernel_instance) {
    if (kernel_instance.connectionStatus === "connected") {
      return kernel_instance;
    } else {
      kernel_instance.dispose();
    }
  }

  const serverSettings = await getServerConnectSettings({
    baseUrl: server_url,
    token: token,
  });

  const kernelModels = await KernelAPI.listRunning(serverSettings);
  const kernelManager = new KernelManager({ serverSettings: serverSettings });

  let kernel;
  if (kernelModels && kernelModels.length > 0) {
    const idleKernels = kernelModels.filter(
      it => it.execution_state === "idle",
    );
    if (idleKernels && idleKernels.length > 0) {
      kernel = await kernelManager.connectTo({ model: idleKernels[0] });
    }
  }
  if (!kernel) {
    kernel = await kernelManager.startNew({ name: "python3" });
  }
  kernel.statusChanged.connect((_, status) => {
    console.log("Kernel status changed", status);
  });
  kernel_instance = kernel;
  return kernel;
}

async function callJupyter(kernel, code) {
  const future = kernel.requestExecute({ code: code });
  let table = null;
  let error = null;
  future.onIOPub = msg => {
    console.log("IO Pub", msg);
    if (msg?.header?.msg_type === "execute_result") {
      table = msg?.content?.data;
      try {
        table = JSON.parse(table["text/plain"].replaceAll("'", ""));
        console.log("Result", table);
      } catch (err) {}
    }
    if (msg?.header?.msg_type === "error") {
      error = msg.content;
      console.log("Error", error);
    }
  };
  await future.done;
  return { table, error };
}

export async function executeCode({ code }) {
  const kernel = await connectToKernel();
  const res = await callJupyter(kernel, code.join("\n"));
  setTimeout(() => kernel.dispose(), 1000 * 60 * 5);
  return res;
}
