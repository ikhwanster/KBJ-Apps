import { DecryptedResidentData, EncryptedResidentData } from '../types';

// Default application pepper/master secret for client-side field data encryption
const APP_PEPPER = 'SiJentik-RW08-Secure-MasterKey-2026';

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Derives an AES-GCM 256-bit CryptoKey using PBKDF2 with 100,000 iterations.
 */
async function deriveKey(saltBuffer: ArrayBuffer, customPass?: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const password = customPass || APP_PEPPER;
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts sensitive resident health information into AES-256 GCM ciphertext.
 */
export async function encryptResidentData(
  data: DecryptedResidentData,
  customPass?: string
): Promise<EncryptedResidentData> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(salt.buffer, customPass);

  const enc = new TextEncoder();
  const encodedPayload = enc.encode(JSON.stringify(data));

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encodedPayload
  );

  return {
    ciphertext: bufferToBase64(ciphertextBuffer),
    iv: bufferToBase64(iv.buffer),
    salt: bufferToBase64(salt.buffer),
    algorithm: 'AES-256-GCM (PBKDF2 SHA-256)',
    lastEncryptedAt: new Date().toISOString(),
  };
}

/**
 * Decrypts AES-256 GCM ciphertext back to DecryptedResidentData object.
 */
export async function decryptResidentData(
  encrypted: EncryptedResidentData,
  customPass?: string
): Promise<DecryptedResidentData> {
  try {
    const saltBuffer = base64ToBuffer(encrypted.salt);
    const ivBuffer = base64ToBuffer(encrypted.iv);
    const ciphertextBuffer = base64ToBuffer(encrypted.ciphertext);

    const key = await deriveKey(saltBuffer, customPass);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(ivBuffer),
      },
      key,
      ciphertextBuffer
    );

    const dec = new TextDecoder();
    const jsonStr = dec.decode(decryptedBuffer);
    return JSON.parse(jsonStr) as DecryptedResidentData;
  } catch (err) {
    console.error('Decryption failed:', err);
    throw new Error('Kunci enkripsi tidak cocok atau data terkorupsi.');
  }
}
