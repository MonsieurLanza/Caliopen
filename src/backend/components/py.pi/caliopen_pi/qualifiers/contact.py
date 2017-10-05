# -*- coding: utf-8 -*-
"""Caliopen user message qualification logic."""
from __future__ import absolute_import, print_function, unicode_literals
import logging

from caliopen_storage.exception import NotFound
from caliopen_storage.config import Configuration
from caliopen_main.contact.core import Contact
from caliopen_main.contact.parameters import NewPublicKey as NewKeyParam

from caliopen_pgp.keys import PublicKeyDiscoverer

log = logging.getLogger(__name__)


def unmarshall_pgp_key(key):
    """Map a caliopen_pgp.base.key to a PublicKey parameter."""
    param = NewKeyParam()
    param.fingerprint = key.fingerprint
    param.expire_date = None    # XXXX TOFIX XXXXX
    param.size = key.size
    param.type = key.algorithms
    param.name = key.keyid
    return param


class ContactEmailQualifier(object):
    """
    Process new or delete of an email for a contact.

    - will try to discover public keys
    - process for privacy features and PI compute

    """

    def __init__(self, user):
        """Create a new instance of an contact email qualifier."""
        self.user = user
        conf = Configuration('global').configuration
        self.key_disco = PublicKeyDiscoverer(conf)

    def _process_new_keys(self, contact, keys):
        known_fingerprints = [x.fingerprint for x in contact.public_keys]
        new_keys = []
        for new_key in keys:
            if new_key.fingerprint not in known_fingerprints:
                if not new_key.is_expired:
                    new_keys.append(new_key)
        if new_keys:
            ids = [x.fingerprint for x in new_keys]
            log.info('Found new keys {0} for contact'.format(ids))

            for new_key in new_keys:
                param = unmarshall_pgp_key(new_key)
                contact.add_public_key(param)

            if 'valid_public_keys' not in contact.privacy_features.keys():
                contact.privacy_features['valid_public_keys'] = True
                contact.pi.technic = contact.pi.technic + 10
                co_boost = 5 * len(new_keys)
                contact.pi.comportment = contact.pi.comportment + co_boost
            contact.save()

    def create_new_email(self, contact_id, email):
        """Add a new email for a contact."""
        contact = Contact.get(self.user, contact_id)
        found_keys = self.key_disco.search_email(email)
        if found_keys:
            log.info('Found keys for email {0}: {1}'.format(email, found_keys))
            self._process_new_keys(contact, found_keys)
