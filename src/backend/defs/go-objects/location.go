/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package objects

type DeviceLocation struct {
	Address         string
	Country         string
	PrivacyFeatures PrivacyFeatures
	Type            string
}

type DeviceLocations []DeviceLocation
