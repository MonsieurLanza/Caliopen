// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"encoding/json"
	"github.com/gocql/gocql"
	"github.com/satori/go.uuid"
	"time"
)

type ContactPublicKey struct {
	ContactId  UUID      `cql:"contact_id"       json:"contact_id,omitempty"                                      patch:"system"`
	DateInsert time.Time `cql:"date_insert"      json:"date_insert,omitempty"         formatter:"RFC3339Milli"    patch:"system"`
	DateUpdate time.Time `cql:"date_update"      json:"date_update,omitempty"         formatter:"RFC3339Milli"    patch:"system"`
	ExpireDate time.Time `cql:"expire_date"      json:"expire_date,omitempty"         formatter:"RFC3339Milli"    patch:"user"`
	// string or []byte for fingerprint & key ?
	Fingerprint     string           `cql:"fingerprint"      json:"fingerprint,omitempty"                                     patch:"user"`
	Key             string           `cql:"key"              json:"key,omitempty"                                             patch:"user"`
	Name            string           `cql:"name"             json:"name,omitempty"                                            patch:"user"`
	PrivacyFeatures *PrivacyFeatures `cql:"privacy_features" json:"privacy_features,omitempty"                                patch:"system"`
	Size            int              `cql:"size"             json:"size,omitempty"                                            patch:"user"`
	Type            string           `cql:"type"             json:"type,omitempty"                                            patch:"user"`
	UserId          UUID             `cql:"user_id"          json:"user_id,omitempty"                                         patch:"system"`
}

// unmarshal a map[string]interface{} that must owns all ContactPublicKey's fields
// typical usage is for unmarshaling response from Cassandra backend
func (pk *ContactPublicKey) UnmarshalCQLMap(input map[string]interface{}) {
	if contactId, ok := input["contact_id"].(gocql.UUID); ok {
		pk.ContactId.UnmarshalBinary(contactId.Bytes())
	}
	if dateInsert, ok := input["date_insert"].(time.Time); ok {
		pk.DateInsert = dateInsert
	}
	if dateUpdate, ok := input["date_update"].(time.Time); ok {
		pk.DateUpdate = dateUpdate
	}
	if expireDate, ok := input["expire_date"].(time.Time); ok {
		pk.ExpireDate = expireDate
	}
	if fingerprint, ok := input["fingerprint"].(string); ok {
		pk.Fingerprint = fingerprint
	}
	if key, ok := input["key"].(string); ok {
		pk.Key = key
	}
	if name, ok := input["name"].(string); ok {
		pk.Name = name
	}
	if i_pf, ok := input["privacy_features"].(map[string]string); ok && i_pf != nil {
		pf := PrivacyFeatures{}
		for k, v := range i_pf {
			pf[k] = v
		}
		pk.PrivacyFeatures = &pf
	} else {
		pk.PrivacyFeatures = nil
	}
	if size, ok := input["size"].(int); ok {
		pk.Size = size
	}
	if userid, ok := input["user_id"].(gocql.UUID); ok {
		pk.UserId.UnmarshalBinary(userid.Bytes())
	}
}

func (pk *ContactPublicKey) UnmarshalMap(input map[string]interface{}) error {
	if contact_id, ok := input["contact_id"].(string); ok {
		if id, err := uuid.FromString(contact_id); err == nil {
			pk.ContactId.UnmarshalBinary(id.Bytes())
		}
	}
	if date, ok := input["date_insert"]; ok {
		pk.DateInsert, _ = time.Parse(time.RFC3339Nano, date.(string))
	}
	if date, ok := input["date_update"]; ok {
		pk.DateUpdate, _ = time.Parse(time.RFC3339Nano, date.(string))
	}
	if date, ok := input["expire_date"]; ok {
		pk.ExpireDate, _ = time.Parse(time.RFC3339Nano, date.(string))
	}
	if fingerprint, ok := input["fingerprint"].(string); ok {
		pk.Fingerprint = fingerprint
	}
	if key, ok := input["key"].(string); ok {
		pk.Key = key
	}
	if name, ok := input["name"].(string); ok {
		pk.Name = name
	}
	if pf, ok := input["privacy_features"]; ok && pf != nil {
		PF := &PrivacyFeatures{}
		PF.UnmarshalMap(pf.(map[string]interface{}))
		pk.PrivacyFeatures = PF
	} else {
		pk.PrivacyFeatures = nil
	}
	if size, ok := input["size"].(float64); ok {
		pk.Size = int(size)
	}
	if u_id, ok := input["user_id"].(string); ok {
		if id, err := uuid.FromString(u_id); err == nil {
			pk.UserId.UnmarshalBinary(id.Bytes())
		}
	}

	return nil //TODO : errors handling
}

func (pk *ContactPublicKey) UnmarshalJSON(b []byte) error {
	input := map[string]interface{}{}
	if err := json.Unmarshal(b, &input); err != nil {
		return err
	}

	return pk.UnmarshalMap(input)
}

// GetTableInfos implements HasTable interface.
// It returns params needed by CassandraBackend to CRUD on ContactPublicKey table.
func (pk *ContactPublicKey) GetTableInfos() (table string, partitionKeys map[string]string, clusteringKeys map[string]string) {
	return "public_key",
		map[string]string{
			"UserId":    "user_id",
			"ContactId": "contact_id",
			"Name":      "name",
		},
		map[string]string{
			"UserId":    "user_id",
			"ContactId": "contact_id",
		}
}

func (pk *ContactPublicKey) MarshallNew(contacts ...interface{}) {
	if len(contacts) == 1 {
		c := contacts[0].(*Contact)
		pk.UserId.UnmarshalBinary(c.UserId.Bytes())
		pk.ContactId.UnmarshalBinary(c.ContactId.Bytes())
		// do not change date if mashallNew has been called multiple time on a publickey being created
		if pk.DateInsert.IsZero() {
			pk.DateInsert = time.Now()
		}
		if pk.DateUpdate.IsZero() {
			pk.DateUpdate = pk.DateInsert
		}
	}
}

// return a JSON representation of ContactPublicKey suitable for frontend client
func (pk *ContactPublicKey) MarshalFrontEnd() ([]byte, error) {
	return JSONMarshaller("frontend", pk)
}

func (pk *ContactPublicKey) JSONMarshaller() ([]byte, error) {
	return JSONMarshaller("", pk)
}

func (pk *ContactPublicKey) NewEmpty() interface{} {
	p := new(ContactPublicKey)
	p.Size = 0
	return p
}

/* ObjectPatchable interface */
func (pk *ContactPublicKey) JsonTags() map[string]string {
	return jsonTags(pk)
}

func (pk *ContactPublicKey) SortSlices() {
	// nothing to sort
}

// Sort interface implementation
type ByName []ContactPublicKey

func (p ByName) Len() int {
	return len(p)
}

func (p ByName) Less(i, j int) bool {
	return p[i].Name < p[j].Name
}

func (p ByName) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
}

type DevicePublicKey struct {
}
