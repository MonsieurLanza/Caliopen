// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package store

import (
	obj "github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/gocassa/gocassa"
	"github.com/gocql/gocql"
)

// part of LDABackend interface
func (cb *CassandraBackend) StoreRaw(raw_email string) (uuid string, err error) {
	rawMsgTable := cb.IKeyspace.MapTable("raw_message", "raw_msg_id", &obj.RawMessageModel{})
	consistency := gocql.Consistency(cb.CassandraConfig.Consistency)

	// need to overwrite default gocassa naming convention that add `_map_name` to the mapTable name
	rawMsgTable = rawMsgTable.WithOptions(gocassa.Options{
		TableName:   "raw_message",
		Consistency: &consistency,
	})

	raw_uuid, err := gocql.RandomUUID()
	m := obj.RawMessageModel{
		Raw_msg_id: raw_uuid.Bytes(),
		Data:       raw_email,
		Size:       len(raw_email),
	}
	err = rawMsgTable.Set(m).Run()

	uuid = raw_uuid.String()
	return
}

// part of LDABackend interface implementation
// return a list of users' ids found in user_name table for the given email addresses list
func (cb *CassandraBackend) GetUsersForRecipients(rcpts []string) (user_ids []obj.CaliopenUUID, err error) {
	userTable := cb.IKeyspace.MapTable("local_identity", "address", &obj.LocalIdentity{})
	consistency := gocql.Consistency(cb.CassandraConfig.Consistency)

	// need to overwrite default gocassa naming convention that add `_map_name` to the mapTable name
	userTable = userTable.WithOptions(gocassa.Options{
		TableName:   "local_identity",
		Consistency: &consistency,
	})

	result := obj.UserName{}
	for _, rcpt := range rcpts {
		err = userTable.Read(rcpt, &result).Run()
		if err != nil {
			log.WithError(err).Infoln("error on userTable query")
			return
		}
		var uuid obj.CaliopenUUID
		err := uuid.UnmarshalBinary(result.User_id)
		if err != nil {
			return []obj.CaliopenUUID{}, err
		}
		user_ids = append(user_ids, uuid)
	}
	return
}
