import { useCallback, useEffect, useMemo, useState } from 'react';
import { Contract, formatUnits, parseUnits } from 'ethers';
import { useAccount, usePublicClient } from 'wagmi';
import type { Abi } from 'viem';

import { Header } from './Header';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { useEthersSigner } from '../hooks/useEthersSigner';
import {
  PAYROLL_ADDRESS,
  PAYROLL_ABI,
  TOKEN_ADDRESS,
  TOKEN_ABI,
  TOKEN_DECIMALS,
} from '../config/contracts';

import '../styles/PayrollApp.css';

const ZERO_HANDLE = '0x0000000000000000000000000000000000000000000000000000000000000000';

type SalaryEncrypted = {
  pending: string;
  total: string;
};

type SalaryDecrypted = {
  pending: bigint;
  total: bigint;
};

const isZeroHandle = (value?: string | null) => {
  if (!value) {
    return true;
  }
  return value.toLowerCase() === ZERO_HANDLE.toLowerCase();
};

const formatAmount = (value: bigint | null) => {
  if (value === null) {
    return '—';
  }
  try {
    return formatUnits(value, TOKEN_DECIMALS);
  } catch (error) {
    console.error('Failed to format amount', error);
    return value.toString();
  }
};

const parseSalaryInput = (raw: string) => {
  if (!raw) {
    throw new Error('Enter an amount to record');
  }
  return parseUnits(raw, TOKEN_DECIMALS);
};

const hasConfiguredAddress = (address: string) => {
  return !/^0x0{40}$/i.test(address);
};

export function PayrollApp() {
  const { address, isConnected, chain } = useAccount();
  const publicClient = usePublicClient();
  const { instance, isLoading: isZamaLoading, error: zamaError } = useZamaInstance();
  const signerPromise = useEthersSigner();

  const payrollConfigured = hasConfiguredAddress(PAYROLL_ADDRESS);
  const tokenConfigured = hasConfiguredAddress(TOKEN_ADDRESS);

  const [salaryEncrypted, setSalaryEncrypted] = useState<SalaryEncrypted | null>(null);
  const [salaryDecrypted, setSalaryDecrypted] = useState<SalaryDecrypted | null>(null);
  const [balanceEncrypted, setBalanceEncrypted] = useState<string | null>(null);
  const [balanceDecrypted, setBalanceDecrypted] = useState<bigint | null>(null);
  const [formValue, setFormValue] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isDecryptingSalary, setIsDecryptingSalary] = useState(false);
  const [isDecryptingBalance, setIsDecryptingBalance] = useState(false);

  const resetMessages = () => {
    setStatusMessage(null);
    setErrorMessage(null);
  };

  const refreshData = useCallback(async () => {
    if (!publicClient || !address || !payrollConfigured || !tokenConfigured) {
      return;
    }

    try {
      const salaryResponse = await publicClient.readContract({
        address: PAYROLL_ADDRESS as `0x${string}`,
        abi: PAYROLL_ABI as unknown as Abi,
        functionName: 'getSalary',
        args: [address],
      });

      const balanceResponse = await publicClient.readContract({
        address: TOKEN_ADDRESS as `0x${string}`,
        abi: TOKEN_ABI as unknown as Abi,
        functionName: 'confidentialBalanceOf',
        args: [address],
      });

      const salaryTuple = salaryResponse as readonly [string, string];
      setSalaryEncrypted({ pending: salaryTuple[0], total: salaryTuple[1] });
      setSalaryDecrypted(null);

      setBalanceEncrypted(balanceResponse as string);
      setBalanceDecrypted(null);
    } catch (error) {
      console.error('Failed to load payroll data', error);
      setErrorMessage('Unable to load on-chain payroll data.');
    }
  }, [address, publicClient, payrollConfigured, tokenConfigured]);

  useEffect(() => {
    resetMessages();
    if (isConnected) {
      void refreshData();
    } else {
      setSalaryEncrypted(null);
      setSalaryDecrypted(null);
      setBalanceEncrypted(null);
      setBalanceDecrypted(null);
    }
  }, [isConnected, address, refreshData]);

  const handleRecordSalary = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();

    if (!instance) {
      setErrorMessage('Encryption service is still initializing.');
      return;
    }
    if (!address) {
      setErrorMessage('Connect your wallet to record salary.');
      return;
    }
    if (!payrollConfigured) {
      setErrorMessage('Payroll contract address is not configured.');
      return;
    }

    try {
      setIsRecording(true);
      const amount = parseSalaryInput(formValue);

      const encryptedInput = await instance
        .createEncryptedInput(PAYROLL_ADDRESS, address)
        .add64(amount)
        .encrypt();

      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Wallet signer unavailable.');
      }

      const payrollContract = new Contract(PAYROLL_ADDRESS, PAYROLL_ABI as unknown as any, signer);
      const tx = await payrollContract.recordSalary(encryptedInput.handles[0], encryptedInput.inputProof);
      await tx.wait();

      setStatusMessage('Salary recorded successfully.');
      setFormValue('');
      await refreshData();
    } catch (error) {
      console.error('Failed to record salary', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to record salary.');
    } finally {
      setIsRecording(false);
    }
  };

  const handleClaimSalary = async () => {
    resetMessages();

    if (!address) {
      setErrorMessage('Connect your wallet to claim salary.');
      return;
    }
    if (!payrollConfigured) {
      setErrorMessage('Payroll contract address is not configured.');
      return;
    }

    try {
      setIsClaiming(true);
      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Wallet signer unavailable.');
      }

      const payrollContract = new Contract(PAYROLL_ADDRESS, PAYROLL_ABI as unknown as any, signer);
      const tx = await payrollContract.claimSalary();
      await tx.wait();

      setStatusMessage('Salary claimed and cUSDT minted successfully.');
      await refreshData();
    } catch (error) {
      console.error('Failed to claim salary', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to claim salary.');
    } finally {
      setIsClaiming(false);
    }
  };

  const decryptSalary = async () => {
    resetMessages();

    if (!instance) {
      setErrorMessage('Encryption service is still initializing.');
      return;
    }
    if (!address || !salaryEncrypted) {
      setErrorMessage('No encrypted salary available for decryption.');
      return;
    }
    if (isZeroHandle(salaryEncrypted.pending) && isZeroHandle(salaryEncrypted.total)) {
      setSalaryDecrypted({ pending: 0n, total: 0n });
      return;
    }

    try {
      setIsDecryptingSalary(true);
      const keypair = instance.generateKeypair();
      const handleContractPairs = [] as Array<{ handle: string; contractAddress: string }>;

      if (!isZeroHandle(salaryEncrypted.pending)) {
        handleContractPairs.push({ handle: salaryEncrypted.pending, contractAddress: PAYROLL_ADDRESS });
      }

      if (!isZeroHandle(salaryEncrypted.total)) {
        handleContractPairs.push({ handle: salaryEncrypted.total, contractAddress: PAYROLL_ADDRESS });
      }

      if (handleContractPairs.length === 0) {
        setSalaryDecrypted({ pending: 0n, total: 0n });
        return;
      }

      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '10';
      const contractAddresses = [PAYROLL_ADDRESS];

      const eip712 = instance.createEIP712(keypair.publicKey, contractAddresses, startTimeStamp, durationDays);
      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Wallet signer unavailable.');
      }

      const signature = await signer.signTypedData(
        eip712.domain,
        { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
        eip712.message,
      );

      const result = await instance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        address,
        startTimeStamp,
        durationDays,
      );

      const pending = isZeroHandle(salaryEncrypted.pending)
        ? 0n
        : BigInt(result[salaryEncrypted.pending] ?? '0');
      const total = isZeroHandle(salaryEncrypted.total)
        ? 0n
        : BigInt(result[salaryEncrypted.total] ?? '0');

      setSalaryDecrypted({ pending, total });
    } catch (error) {
      console.error('Failed to decrypt salary', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to decrypt salary.');
    } finally {
      setIsDecryptingSalary(false);
    }
  };

  const decryptBalance = async () => {
    resetMessages();

    if (!instance) {
      setErrorMessage('Encryption service is still initializing.');
      return;
    }
    if (!address || !balanceEncrypted || isZeroHandle(balanceEncrypted)) {
      setBalanceDecrypted(0n);
      return;
    }

    try {
      setIsDecryptingBalance(true);
      const keypair = instance.generateKeypair();
      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '10';
      const contractAddresses = [TOKEN_ADDRESS];

      const eip712 = instance.createEIP712(keypair.publicKey, contractAddresses, startTimeStamp, durationDays);
      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Wallet signer unavailable.');
      }

      const signature = await signer.signTypedData(
        eip712.domain,
        { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
        eip712.message,
      );

      const result = await instance.userDecrypt(
        [
          {
            handle: balanceEncrypted,
            contractAddress: TOKEN_ADDRESS,
          },
        ],
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        address,
        startTimeStamp,
        durationDays,
      );

      const value = BigInt(result[balanceEncrypted] ?? '0');
      setBalanceDecrypted(value);
    } catch (error) {
      console.error('Failed to decrypt balance', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to decrypt balance.');
    } finally {
      setIsDecryptingBalance(false);
    }
  };

  const chainMismatch = useMemo(() => {
    if (!chain) {
      return false;
    }
    return chain.id !== 11155111; // Sepolia
  }, [chain]);

  return (
    <div className="payroll-app">
      <Header />
      <main className="payroll-main">
        {!payrollConfigured || !tokenConfigured ? (
          <div className="warning-card">
            <h2>Contracts not configured</h2>
            <p>
              Update <code>PAYROLL_ADDRESS</code> and <code>TOKEN_ADDRESS</code> in <code>app/src/config/contracts.ts</code>{' '}
              after deploying to Sepolia.
            </p>
          </div>
        ) : null}

        {chainMismatch ? (
          <div className="warning-card">
            <h2>Network mismatch</h2>
            <p>Please switch your wallet to the Sepolia network to interact with the payroll.</p>
          </div>
        ) : null}

        {zamaError ? (
          <div className="warning-card">
            <h2>Encryption service error</h2>
            <p>{zamaError}</p>
          </div>
        ) : null}

        {statusMessage ? (
          <div className="status-banner success">{statusMessage}</div>
        ) : null}
        {errorMessage ? <div className="status-banner error">{errorMessage}</div> : null}

        <section className="cards-grid">
          <div className="card">
            <div className="card-header">
              <div>
                <h2>cUSDT Balance</h2>
                <p className="card-subtitle">Confidential balance stored on-chain</p>
              </div>
              <button
                className="secondary-button"
                onClick={decryptBalance}
                disabled={!isConnected || isDecryptingBalance || isZamaLoading}
              >
                {isDecryptingBalance ? 'Decrypting…' : 'Decrypt balance'}
              </button>
            </div>
            <div className="card-body">
              <div className="data-row">
                <span className="data-label">Encrypted balance</span>
                <span className="data-value monospace">{balanceEncrypted ?? '—'}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Decrypted balance</span>
                <span className="data-value">{formatAmount(balanceDecrypted)}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <h2>Salary Records</h2>
                <p className="card-subtitle">Encrypted payroll totals just for you</p>
              </div>
              <button
                className="secondary-button"
                onClick={decryptSalary}
                disabled={!isConnected || isDecryptingSalary || isZamaLoading || !salaryEncrypted}
              >
                {isDecryptingSalary ? 'Decrypting…' : 'Decrypt salary'}
              </button>
            </div>
            <div className="card-body">
              <div className="data-row">
                <span className="data-label">Encrypted pending</span>
                <span className="data-value monospace">{salaryEncrypted?.pending ?? '—'}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Pending (clear)</span>
                <span className="data-value">{formatAmount(salaryDecrypted?.pending ?? null)}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Encrypted total recorded</span>
                <span className="data-value monospace">{salaryEncrypted?.total ?? '—'}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Total recorded (clear)</span>
                <span className="data-value">{formatAmount(salaryDecrypted?.total ?? null)}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <h2>Record salary</h2>
              <p className="card-subtitle">Encrypt your salary locally and store it on-chain</p>
            </div>
          </div>

          <form className="form" onSubmit={handleRecordSalary}>
            <label className="form-label" htmlFor="salary-input">
              Salary amount (cUSDT, {TOKEN_DECIMALS} decimals)
            </label>
            <input
              id="salary-input"
              type="text"
              value={formValue}
              onChange={(event) => setFormValue(event.target.value)}
              placeholder="e.g. 2500.50"
              className="form-input"
              disabled={!isConnected || isRecording || isZamaLoading}
            />
            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={!isConnected || isRecording || isZamaLoading}
              >
                {isRecording ? 'Recording…' : 'Record encrypted salary'}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={handleClaimSalary}
                disabled={!isConnected || isClaiming || isZamaLoading}
              >
                {isClaiming ? 'Claiming…' : 'Claim salary payout'}
              </button>
            </div>
            <p className="form-helper">
              All amounts are encrypted with Zama FHE before leaving your browser.
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
