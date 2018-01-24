import { getLocalstorage } from '../../../../services/localStorage';
import { CURVE_TYPE } from '../ecdsa';

const DEVICE_NAMESPACE = 'device';

let ls;
const getStorage = () => {
  if (!ls) {
    ls = getLocalstorage();
  }

  return ls;
};

export const saveConfig = ({ id, priv, hash, curve }) => {
  const storage = getStorage();
  storage.save(DEVICE_NAMESPACE, 'id', id);
  storage.save(DEVICE_NAMESPACE, 'priv', priv);
  storage.save(DEVICE_NAMESPACE, 'hash', hash);
  storage.save(DEVICE_NAMESPACE, 'curve', curve);
};

export const save = ({ id, keypair }) => {
  saveConfig({
    id,
    curve: CURVE_TYPE,
    hash: keypair.ec.hash.name,
    priv: keypair.priv.toString(),
  });
};

export const getConfig = () => {
  const params = getStorage().findAll(DEVICE_NAMESPACE);

  if (!params.length) {
    return null;
  }

  return params.reduce((acc, item) => ({
    ...acc,
    [item.id]: item.value,
  }), {});
};

// XXX: should be a "Model" ?
export const getPublicDevice = ({ id, keypair }) => {
  const pub = keypair.getPublic();

  return {
    device_id: id,
    ecdsa_key: {
      curve: CURVE_TYPE,
      hash: keypair.ec.hash.name,
      x: pub.x.toString(),
      y: pub.y.toString(),
    },
  };
};
