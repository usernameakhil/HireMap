import { useAuth } from '../Context/AuthContext';

/**
 * @desc Economy Hook to manage coin deductions and balance checks
 * Link this to any premium feature button (AI analysis, job unlocks, etc.)
 */
export const useEconomy = () => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  /**
   * @param {number} cost - The number of coins to deduct
   * @param {string} featureName - The name of the feature for transaction logging
   * @returns {Promise<boolean>} - Returns true if deduction was successful
   */
  const deductCoins = async (cost, featureName) => {
    try {
      // 1. IDENTITY CHECK: Ensure user node is active
      if (!user || !user.id) {
        alert("Authorization required for this action.");
        return false;
      }

      // 2. PRE-FLIGHT CHECK: Immediate UI feedback if balance is too low
      if (user.coins < cost) {
        alert(`Insufficient Neural Credits. This operation requires ${cost} coins. Current balance: ${user.coins}`);
        return false;
      }

      // 3. SECURE HANDSHAKE: Request deduction from Backend Grid
      const response = await fetch(`${API_URL}/api/payment/consume`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // If you have a token in local storage, add it here for security:
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          userId: user.id, 
          cost, 
          featureName 
        })
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS: The server has updated the DB
        console.log(`[ECONOMY] ${cost} coins deducted for: ${featureName}`);
        
        /** * CRITICAL: We don't manually update 'user.coins' here because 
         * the AuthContext should ideally re-fetch user data or we 
         * trigger a page reload to keep the Sidebar/Navbar in sync.
         */
        return true;
      } else {
        // FAILURE: Server rejected the transaction
        alert(data.message || "Neural transaction failed.");
        return false;
      }

    } catch (err) {
      console.error("Economy Critical Sync Error:", err);
      alert("Lost connection to the Neural Economy. Please try again.");
      return false;
    }
  };

  return { deductCoins };
};