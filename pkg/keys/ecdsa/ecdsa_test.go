// Copyright (C) 2015-2023 Holger de Carne
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

package ecdsa

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func TestECDSAKeyPair(t *testing.T) {
	kpfs := StandardKeys()
	for _, kpf := range kpfs {
		fmt.Printf("Generating %s", kpf.Name())
		start := time.Now()
		keypair, err := kpf.New()
		elapsed := time.Since(start)
		fmt.Printf(" (took: %s)\n", elapsed)
		require.NoError(t, err)
		require.NotNil(t, keypair)
	}
}
