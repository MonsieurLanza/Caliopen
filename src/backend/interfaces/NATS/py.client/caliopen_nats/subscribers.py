import json

from caliopen_main.message.delivery import UserMessageDelivery


class InboundEmail(object):

    def __init__(self, natsConn):
        self.deliver = UserMessageDelivery()
        self.natsConn = natsConn

    def handler(self, msg):
        print("[Received: {0}] {1}".format(msg.subject, msg.data))
        payload = json.loads(msg.data)
        try:
            self.deliver.process(payload["user_id"], payload["raw_email_id"])
        except Exception as exc:
            self.natsConn.publish(msg.reply, exc)
            return exc
        self.natsConn.publish(msg.reply, "OK : message processed")
