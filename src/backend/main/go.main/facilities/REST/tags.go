package REST

import (
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/helpers"
	"github.com/bitly/go-simplejson"
	"github.com/mozillazg/go-unidecode"
	"github.com/pkg/errors"
	"strings"
)

func (rest *RESTfacility) RetrieveUserTags(user_id string) (tags []Tag, err error) {
	return rest.store.RetrieveUserTags(user_id)
}

// CreateTag :
// - ensures tag's label is unique
// - copies tag's name to tag's label
// - converts tag's name to lower & ASCII and replace spaces by "_"
// - adds the tag in db for user if it doesn't exist yet
// - updates tag in-place with its new properties
func (rest *RESTfacility) CreateTag(tag *Tag) error {
	tag.Label = tag.Name
	var isUnique bool
	isUnique, tag.Name = rest.IsTagLabelNameUnique(tag.Label, tag.User_id.String())
	if !isUnique {
		return errors.New("[RESTfacility] tag's name/label conflict with existing one")
	}

	return rest.store.CreateTag(tag)
}

func (rest *RESTfacility) RetrieveTag(user_id, tag_name string) (tag Tag, err error) {
	return rest.store.RetrieveTag(user_id, tag_name)
}

// PatchTag is a shortcut for REST api to call two methods :
// - UpdateWithPatch () to retrieve the tag from db
// - checks that new label is not conflicting with an existing one
// - then UpdateTag() to save updated tag to stores if everything went good.
func (rest *RESTfacility) PatchTag(patch []byte, user_id, tag_name string) error {

	current_tag, err := rest.RetrieveTag(user_id, tag_name)
	if err != nil {
		return err
	}

	p, err := simplejson.NewJson(patch)
	if err != nil {
		return err
	}
	label := p.Get("label")
	if isUnique, _ := rest.IsTagLabelNameUnique(label.MustString(), user_id); !isUnique {
		return errors.New("[RESTfacility] tag's name/label conflict with existing one")
	}

	err = helpers.UpdateWithPatch(&current_tag, patch, UserActor)
	if err != nil {
		return err
	}

	return rest.UpdateTag(&current_tag)

}

// UpdateTag updates a tag in store with payload,
func (rest *RESTfacility) UpdateTag(tag *Tag) error {
	user_id := tag.User_id.String()
	if user_id != "" && tag.Name != "" {

		db_tag, err := rest.store.RetrieveTag(user_id, tag.Name)
		if err != nil {
			return err
		}
		// RESTfacility allows user to only modify label and importance_level properties
		// thus squash other properties with those from db to ignore any modifications
		tag.Date_insert = db_tag.Date_insert
		tag.Name = db_tag.Name
		tag.Type = db_tag.Type
		tag.User_id = db_tag.User_id
		return rest.store.UpdateTag(tag)

	} else {
		return errors.New("[RESTfacility] invalid tag's name and/or user_id")
	}
}

// DeleteTag deletes a tag in store,
// only if tag is a user tag.
func (rest *RESTfacility) DeleteTag(user_id, tag_name string) error {

	tag, err := rest.store.RetrieveTag(user_id, tag_name)
	if err != nil {
		return err
	}
	if tag.Type == SystemTag {
		return errors.New("[RESTfacility] system tags can't be deleted by user")
	}

	err = rest.store.DeleteTag(user_id, tag_name)
	if err != nil {
		return err
	}
	go rest.deleteEmbeddedTagReferences(user_id, tag_name)
	return nil
}

// UpdateResourceTags :
// - checks that tag_names within patch belong to user and are unique,
// - calls generic UpdateWithPatch func to patch the resource,
// - saves and indexes updated resource.
// It is caller responsibility to call this func with a well-formed patch that has only "tags" properties
func (rest *RESTfacility) UpdateResourceTags(user *UserInfo, resourceID, resourceType string, patch []byte) error {
	var err error
	// 1. check that tag_names within patch belong to user and are unique
	tags, err := rest.RetrieveUserTags(user.User_id)
	if err != nil {
		return err
	}
	userTagsMap := make(map[string]bool)
	for _, tag := range tags {
		userTagsMap[tag.Name] = true
	}

	p, err := simplejson.NewJson(patch)
	if err != nil {
		return err
	}
	deduplicatedTagsList := []string{}
	patchTagsMap := make(map[string]bool)
	for _, tag := range p.Get("tags").MustStringArray() {
		// is tag belonging to user ?
		if _, ok := userTagsMap[tag]; !ok {
			err = fmt.Errorf("[RESTfacility] UpdateResourceTags : tag with name <%s> does not belong to user <%s>", tag, user.User_id)
			break
		}
		// is tag unique ?
		if _, ok := patchTagsMap[tag]; !ok {

			patchTagsMap[tag] = true
			deduplicatedTagsList = append(deduplicatedTagsList, tag)
		}
	}

	p.Set("tags", deduplicatedTagsList)

	if err != nil {
		return err
	}
	patch, _ = p.MarshalJSON()
	// 2. call generic UpdateWitchPatch func
	var obj CaliopenObject

	switch resourceType {
	case MessageType:
		m, err := rest.store.RetrieveMessage(user.User_id, resourceID)
		if err != nil {
			return err
		}
		obj = CaliopenObject(m)
	case ContactType:
		c, err := rest.store.RetrieveContact(user.User_id, resourceID)
		if err != nil {
			return err
		}
		obj = CaliopenObject(c)
	default:
		return errors.New("[RESTfacility] UpdateResourceWithPatch : invalid resourceType")
	}
	err = helpers.UpdateWithPatch(obj, patch, UserActor)
	if err != nil {
		return err
	}

	// 3. store and index updated resource
	switch resourceType {
	case MessageType:
		update := map[string]interface{}{
			"tags": obj.(*Message).Tags,
		}
		err := rest.store.UpdateMessage(obj.(*Message), update)
		if err != nil {
			return err
		}

		err = rest.index.UpdateMessage(user, obj.(*Message), update)
		if err != nil {
			return err
		}
	case ContactType:
		update := map[string]interface{}{
			"tags": obj.(*Contact).Tags,
		}
		err := rest.store.UpdateContact(obj.(*Contact), update)
		if err != nil {
			return err
		}

		err = rest.index.UpdateContact(user, obj.(*Contact), update)
		if err != nil {
			return err
		}
	}

	return nil
}

// IsTagLabelNameUnique ensures that a name and/or label is not conflicting with a name/label of another tag.
// returns true if tag is unique, along with the label normalized to a string that could be used as tag's name.
func (rest *RESTfacility) IsTagLabelNameUnique(label, userID string) (bool, string) {
	normalizedLabel := utf8ToASCIILowerNoSpace(label)
	tags, err := rest.store.RetrieveUserTags(userID)
	if err != nil {
		return false, ""
	}
	for _, t := range tags {
		if t.Name == normalizedLabel {
			return false, ""
		}
	}
	return true, normalizedLabel
}

func (rest *RESTfacility) deleteEmbeddedTagReferences(userID, tagName string) {
	//TODO : async deletion of tag references embedded into resources.
}

func utf8ToASCIILowerNoSpace(s string) string {
	b := make([]byte, len(s))
	b = []byte(unidecode.Unidecode(s))
	b = []byte(strings.ToLower(string(b)))
	b = []byte(strings.Replace(string(b), " ", "_", -1))
	return string(b)
}
