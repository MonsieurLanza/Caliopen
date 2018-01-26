/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package objects

import "time"

type Device struct {
	DateInsert      time.Time
	DeviceId        UUID
	LastSeen        time.Time
	Locations       DeviceLocations
	Name            string
	PrivacyFeatures PrivacyFeatures
	PrivacyIndex    PrivacyIndex
	Status          string
	Type            string
	UserId          UUID
	SignatureKey    string // string or []byte ?
	Fingerprint     string // string or []byte ?
}
