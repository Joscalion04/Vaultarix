/**
 * src/services/libsodiumService.js
 * Ejemplo de cómo usar libsodium para cifrar mensajes internos.
 *
 * NOTA: Esta librería es para cifrado simétrico interno (crypto_secretbox).
 * Las claves deben obtenerse desde un KMS o derivarse de secretos no almacenados en el código.
 */

import sodium from 'libsodium-wrappers';

let ready = false;
const readyPromise = (async () => {
  await sodium.ready;
  ready = true;
})();

export const getSodium = async () => {
  if (!ready) await readyPromise;
  return sodium;
};

/**
 * key: Uint8Array length sodium.crypto_secretbox_KEYBYTES
 * message: string
 */
export const encryptInternal = async (message, key) => {
  const sodium = await getSodium();
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const cipher = sodium.crypto_secretbox_easy(message, nonce, key);
  return {
    cipher: Buffer.from(cipher).toString('base64'),
    nonce: Buffer.from(nonce).toString('base64')
  };
};

export const decryptInternal = async (cipher64, nonce64, key) => {
  const sodium = await getSodium();
  const cipher = Buffer.from(cipher64, 'base64');
  const nonce = Buffer.from(nonce64, 'base64');
  const msg = sodium.crypto_secretbox_open_easy(cipher, nonce, key);
  return Buffer.from(msg).toString('utf8');
};
