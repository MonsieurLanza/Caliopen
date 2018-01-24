import { ec as EC } from 'elliptic';
import BN from 'bn.js';

export const CURVE_TYPE = 'p256';

let ec;
const getEC = () => {
  if (!ec) {
    ec = new EC(CURVE_TYPE);
  }

  return ec;
};

export const generate = () => getEC().genKeyPair();
export const getKeypair = priv => getEC().keyFromPrivate(new BN(priv));
export const sign = (keypair, hash) => keypair.sign(hash);
