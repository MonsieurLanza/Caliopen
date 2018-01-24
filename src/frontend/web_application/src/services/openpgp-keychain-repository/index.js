import { getLocalstorage } from '../localStorage';

const NAMESPACE = 'openpgp';

export function getPrimaryKeysByFingerprint() {
  const ls = getLocalstorage();

  return ls.findAll(NAMESPACE)
    .reduce((prev, { id, value }) => {
      const fingerprint = id.replace('publicKeyArmored.', '')
        .replace('privateKeyArmored.', '');
      const keyType = id.replace(`.${fingerprint}`, '');

      return {
        ...prev,
        [fingerprint]: {
          ...prev[fingerprint],
          [keyType]: value,
        },
      };
    }, {});
}

export function saveKey(fingerprint, publicKeyArmored, privateKeyArmored) {
  const ls = getLocalstorage();
  ls.save(NAMESPACE, `publicKeyArmored.${fingerprint}`, publicKeyArmored);
  ls.save(NAMESPACE, `privateKeyArmored.${fingerprint}`, privateKeyArmored);
}

export function deleteKey(fingerprint) {
  const ls = getLocalstorage();
  ls.remove(NAMESPACE, `publicKeyArmored.${fingerprint}`);
  ls.remove(NAMESPACE, `privateKeyArmored.${fingerprint}`);
}
