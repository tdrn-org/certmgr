// Copyright (C) 2015-2023 Holger de Carne
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

package keys

import (
	"crypto"
	"crypto/ecdsa"
	"crypto/ed25519"
	"crypto/rsa"
)

func PrivatesEqual(key1 crypto.PrivateKey, key2 crypto.PrivateKey) bool {
	ecdsaKey1, ok := key1.(*ecdsa.PrivateKey)
	if ok {
		return ecdsaKey1.Equal(key2)
	}
	ed25519Key1, ok := key1.(ed25519.PrivateKey)
	if ok {
		return ed25519Key1.Equal(key2)
	}
	rsaKey1, ok := key1.(*rsa.PrivateKey)
	if ok {
		return rsaKey1.Equal(key2)
	}
	return false
}

func PublicsEqual(key1 crypto.PublicKey, key2 crypto.PublicKey) bool {
	ecdsaKey1, ok := key1.(*ecdsa.PublicKey)
	if ok {
		return ecdsaKey1.Equal(key2)
	}
	ed25519Key1, ok := key1.(ed25519.PublicKey)
	if ok {
		return ed25519Key1.Equal(key2)
	}
	rsaKey1, ok := key1.(*rsa.PublicKey)
	if ok {
		return rsaKey1.Equal(key2)
	}
	return false
}