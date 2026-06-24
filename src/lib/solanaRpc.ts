export interface RpcAccountInfo {
  exists: boolean;
  lamports: number;
  isProgram: boolean;
  dataSize: number;
  error: string | null;
}

export async function fetchAccountInfo(address: string): Promise<RpcAccountInfo> {
  try {
    const response = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getAccountInfo",
        params: [
          address,
          { encoding: "base58" }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Solana RPC responded with status: ${response.status}`);
    }

    const json = await response.json();
    
    if (json.error) {
      throw new Error(json.error.message || JSON.stringify(json.error));
    }

    const value = json.result?.value;
    if (value === null || value === undefined) {
      return {
        exists: false,
        lamports: 0,
        isProgram: false,
        dataSize: 0,
        error: null
      };
    }

    const lamports = typeof value.lamports === 'number' ? value.lamports : 0;
    const isProgram = value.executable === true;
    const dataSize = (Array.isArray(value.data) && typeof value.data[0] === 'string') 
      ? value.data[0].length 
      : 0;

    return {
      exists: true,
      lamports,
      isProgram,
      dataSize,
      error: null
    };

  } catch (err: any) {
    return {
      exists: false,
      lamports: 0,
      isProgram: false,
      dataSize: 0,
      error: err instanceof Error ? err.message : String(err)
    };
  }
}
