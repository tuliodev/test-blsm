import { describe, it, vi, expect, beforeAll } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import ConnectWalletButton from './ConnectWalletButton';

// Mock the toast function
vi.mock('react-toastify', () => ({
  toast: vi.fn(),
}));

// Mock Ethereum provider
const mockEthereum = {
  request: vi.fn(),
};

beforeAll(() => {
  window.ethereum = mockEthereum;
});

describe('ConnectWalletButton', () => {
 

  it('handles wallet connection error', async () => {
    const setAddress = vi.fn();
    
    mockEthereum.request.mockRejectedValueOnce(new Error('Connection Error'));
    
    const { getByText } = render(<ConnectWalletButton setAddress={setAddress} />);
    
    fireEvent.click(getByText('Connect Wallet'));
    
    await waitFor(() => {
      expect(setAddress).not.toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith(expect.stringContaining('Error connecting wallet'), expect.any(Object));
    });
  });
});
