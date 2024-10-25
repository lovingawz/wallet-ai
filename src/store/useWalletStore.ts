import { create } from 'zustand';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import axios from 'axios';

export interface TokenBalance {
  mint: string;
  amount: number;
  decimals: number;
  uiAmount: number;
  symbol?: string;
  name?: string;
  logo?: string;
  price?: number;
  value?: number;
  change24h?: number;
}

interface WalletState {
  solBalance: number;
  tokens: TokenBalance[];
  totalValue: number;
  isLoading: boolean;
  error: string | null;
  fetchBalances: (publicKey: PublicKey, connection: Connection) => Promise<void>;
}

const useWalletStore = create<WalletState>((set) => ({
  solBalance: 0,
  tokens: [],
  totalValue: 0,
  isLoading: false,
  error: null,

  fetchBalances: async (publicKey: PublicKey, connection: Connection) => {
    try {
      set({ isLoading: true, error: null });

      // Fetch SOL balance
      const solBalance = await connection.getBalance(publicKey);
      const solUiBalance = solBalance / LAMPORTS_PER_SOL;

      // Fetch token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      // Transform token accounts into TokenBalance objects
      const tokens: TokenBalance[] = tokenAccounts.value.map((account) => {
        const { mint, tokenAmount } = account.account.data.parsed.info;
        return {
          mint,
          amount: tokenAmount.amount,
          decimals: tokenAmount.decimals,
          uiAmount: tokenAmount.uiAmount,
        };
      });

      // Fetch token metadata and prices
      const tokenMetadata = await Promise.all(
        tokens.map(async (token) => {
          try {
            const metadata = await axios.get(
              `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${token.mint}&vs_currencies=usd&include_24hr_change=true`
            );

            return {
              ...token,
              price: metadata.data[token.mint.toLowerCase()]?.usd || 0,
              change24h: metadata.data[token.mint.toLowerCase()]?.usd_24h_change || 0,
              value: token.uiAmount * (metadata.data[token.mint.toLowerCase()]?.usd || 0),
            };
          } catch (error) {
            console.error('Error fetching token metadata:', error);
            return token;
          }
        })
      );

      // Calculate total value
      const solValue = solUiBalance * (await fetchSolPrice());
      const tokensValue = tokenMetadata.reduce((acc, token) => acc + (token.value || 0), 0);
      const totalValue = solValue + tokensValue;

      set({
        solBalance: solUiBalance,
        tokens: tokenMetadata,
        totalValue,
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Failed to fetch wallet balances', isLoading: false });
      console.error('Error fetching wallet balances:', error);
    }
  },
}));

async function fetchSolPrice(): Promise<number> {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
    );
    return response.data.solana.usd;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    return 0;
  }
}

export default useWalletStore;