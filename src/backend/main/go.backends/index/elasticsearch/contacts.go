// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package index

import (
	"context"
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
)

func (es *ElasticSearchBackend) CreateContact(contact *Contact) error {
	return errors.New("[ElasticSearchBackend] not implemented")
}

func (es *ElasticSearchBackend) UpdateContact(user *UserInfo, contact *Contact, fields map[string]interface{}) error {
	update, err := es.Client.Update().Index(user.Shard_id).Type(ContactIndexType).Id(contact.ContactId.String()).
		Doc(fields).
		Refresh("wait_for").
		Do(context.TODO())
	if err != nil {
		log.WithError(err).Warn("[ElasticSearchBackend] updateContact operation failed")
		return err
	}
	log.Infof("New version of indexed contact %s is now %d", update.Id, update.Version)
	return nil
}

func (es *ElasticSearchBackend) FilterContacts(filter IndexSearch) (Contacts []*Contact, totalFound int64, err error) {
	err = errors.New("[ElasticSearchBackend] not implemented")
	return
}
