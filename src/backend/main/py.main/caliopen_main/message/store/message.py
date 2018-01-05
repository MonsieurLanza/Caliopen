# -*- coding: utf-8 -*-
"""Caliopen storage model for messages."""
from __future__ import absolute_import, print_function, unicode_literals

from cassandra.cqlengine import columns

from caliopen_storage.store.model import BaseModel
from caliopen_storage.store.mixin import IndexedModelMixin
from caliopen_main.pi.objects import PIModel
from caliopen_main.user.store.local_identity import Identity

from .attachment import MessageAttachment
from .external_references import ExternalReferences
from .participant import Participant
from .message_index import IndexedMessage

import uuid


class Message(BaseModel, IndexedModelMixin):
    """Message model."""

    _index_class = IndexedMessage

    user_id = columns.UUID(primary_key=True)
    message_id = columns.UUID(primary_key=True, default=uuid.uuid4)

    attachments = columns.List(columns.UserDefinedType(MessageAttachment))
    body_html = columns.Text()
    body_plain = columns.Text()
    date = columns.DateTime()
    date_delete = columns.DateTime()
    date_insert = columns.DateTime()
    discussion_id = columns.UUID()
    external_references = columns.UserDefinedType(ExternalReferences)
    identities = columns.List(columns.UserDefinedType(Identity))
    importance_level = columns.Integer()
    is_answered = columns.Boolean()
    is_draft = columns.Boolean()
    is_unread = columns.Boolean()
    is_received = columns.Boolean(default=False)
    parent_id = columns.UUID()
    participants = columns.List(columns.UserDefinedType(Participant))
    privacy_features = columns.Map(columns.Text(), columns.Text())
    pi = columns.UserDefinedType(PIModel)
    raw_msg_id = columns.UUID()
    subject = columns.Text()  # Subject of email, the message for short
    tags = columns.List(columns.Text())
    type = columns.Text()
